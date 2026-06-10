/*!
 * Rust Markdown Converter Library
 *
 * High-performance HTML to Markdown converter for InfluxData documentation.
 * This library provides Node.js bindings via napi-rs for seamless integration.
 *
 * Features:
 * - Custom Turndown-like conversion rules
 * - Product detection from URL paths
 * - GitHub-style callout support
 * - UI element removal
 * - YAML frontmatter generation
 */

#[macro_use]
extern crate napi_derive;

use napi::Result;
use scraper::{ElementRef, Html, Selector};
use serde::{Deserialize, Serialize};
use regex::Regex;
use lazy_static::lazy_static;
use std::collections::HashMap;

// ============================================================================
// Product Detection
// ============================================================================

#[napi(object)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProductInfo {
    pub name: String,
    pub version: String,
}

// Include auto-generated product mappings from data/products.yml
// This is generated at compile time by build.rs
include!(concat!(env!("OUT_DIR"), "/product_mappings.rs"));

fn detect_product(url_path: &str) -> Option<ProductInfo> {
    for (pattern, (name, version)) in URL_PATTERN_MAP.iter() {
        if url_path.contains(pattern) {
            return Some(ProductInfo {
                name: name.to_string(),
                version: version.to_string(),
            });
        }
    }
    None
}

// ============================================================================
// HTML Processing
// ============================================================================

// Configurable list of CSS selectors for elements to remove from article
// content. Add new selectors here to remove unwanted UI widgets, forms,
// navigation, etc.
const REMOVE_SELECTORS: &[&str] = &[
    // Navigation and structure
    "nav",
    "header",
    "footer",
    // Scripts and styles
    "script",
    "style",
    "noscript",
    "iframe",
    // UI widgets and controls
    ".format-selector",
    ".format-selector__button",
    "button[aria-label*='Copy']",
    "hr",
    // Feedback and support sections (inside article content)
    ".helpful",           // "Was this page helpful?" form
    "div.feedback.block", // Block-level feedback sections (combined class selector)
    ".feedback",          // General feedback sections (must come after specific .feedback.block)
    ".page-feedback",
    "#page-feedback",
    ".feedback-widget",
    ".support", // Support section at bottom of pages
];

/// Remove unwanted UI elements from an article element.
///
/// Both the haystack (`article.html()`) and the per-element needles
/// (`element.html()`) are serialized from the **same** parse tree, so html5ever
/// guarantees each descendant's serialization is a verbatim substring of the
/// article's — making the string removal reliable. (Re-parsing the article
/// HTML, as a previous version did, restructured the tree — e.g. inserted
/// `<tbody>` — so re-serialized needles no longer matched and complex widgets
/// like the format-selector leaked their text.)
fn clean_article_html(article: ElementRef) -> String {
    let mut cleaned = article.html();

    // Collect every element to remove, then strip longest-first so a parent is
    // removed before a (also-matched) child, avoiding a stale child needle that
    // no longer matches the already-shortened haystack.
    let mut needles: Vec<String> = Vec::new();
    for selector_str in REMOVE_SELECTORS {
        if let Ok(selector) = Selector::parse(selector_str) {
            for element in article.select(&selector) {
                needles.push(element.html());
            }
        }
    }
    needles.sort_by_key(|h| std::cmp::Reverse(h.len()));
    for needle in needles {
        cleaned = cleaned.replace(&needle, "");
    }

    cleaned
}

/// Replace icon spans with text checkmarks
/// Converts <span class="inline cf-icon Checkmark_New large"></span> to ✓
fn replace_icon_spans(html: &str) -> String {
    let document = Html::parse_document(html);
    let mut result = html.to_string();

    // Select icon spans (specifically checkmark icons used in tables)
    // The selector matches any span that has both cf-icon and Checkmark_New classes
    if let Ok(selector) = Selector::parse("span[class*='cf-icon'][class*='Checkmark_New']") {
        for element in document.select(&selector) {
            // Build the full element HTML to replace (empty span with classes)
            let class_attr = element.value().attr("class").unwrap_or("");
            let full_html = format!("<span class=\"{}\"></span>", class_attr);

            // Replace with checkmark character
            result = result.replace(&full_html, "✓");
        }
    }

    result
}

/// Extract article content from HTML
fn extract_article_content(html: &str) -> Option<(String, String, String)> {
    let document = Html::parse_document(html);

    // Find main article content
    let article_selector = Selector::parse("article.article--content").ok()?;
    let article = document.select(&article_selector).next()?;

    // Extract title
    let title = if let Ok(h1_sel) = Selector::parse("h1") {
        document
            .select(&h1_sel)
            .next()
            .map(|el| el.text().collect::<Vec<_>>().join(" "))
            .or_else(|| {
                if let Ok(title_sel) = Selector::parse("title") {
                    document
                        .select(&title_sel)
                        .next()
                        .map(|el| el.text().collect::<Vec<_>>().join(" "))
                } else {
                    None
                }
            })
            .unwrap_or_else(|| "Untitled".to_string())
    } else {
        "Untitled".to_string()
    };

    // Extract description from meta tags
    let description = if let Ok(meta_sel) = Selector::parse("meta[name='description']") {
        document
            .select(&meta_sel)
            .next()
            .and_then(|el| el.value().attr("content"))
            .or_else(|| {
                if let Ok(og_sel) = Selector::parse("meta[property='og:description']") {
                    document
                        .select(&og_sel)
                        .next()
                        .and_then(|el| el.value().attr("content"))
                } else {
                    None
                }
            })
            .unwrap_or("")
            .to_string()
    } else {
        String::new()
    };

    // Get cleaned article HTML
    let content = clean_article_html(article);

    Some((title, description, content))
}

// ============================================================================
// Markdown Conversion
// ============================================================================

lazy_static! {
    // Regex patterns for post-processing
    static ref EXCESSIVE_NEWLINES: Regex = Regex::new(r"\n{3,}").unwrap();
    static ref SEPARATOR_ARTIFACTS: Regex = Regex::new(r"\* \* \*\s*\n\s*\* \* \*").unwrap();
    static ref TRAILING_SEPARATOR: Regex = Regex::new(r"\* \* \*\s*$").unwrap();
    static ref CODE_FENCE: Regex = Regex::new(r"```(\w+)?\n").unwrap();
    // Heading normalization (see normalize_headings)
    static ref SETEXT_H1: Regex = Regex::new(r"(?m)^([^#>|\-*+\s].*\S)\n=+[ \t]*$").unwrap();
    static ref SETEXT_H2: Regex = Regex::new(r"(?m)^([^#>|\-*+\s].*\S)\n-+[ \t]*$").unwrap();
    static ref CLOSED_ATX: Regex = Regex::new(r"(?m)^(#{1,6} .*?)[ \t]+#+[ \t]*$").unwrap();
}

/// Convert HTML blockquote callouts to GitHub-style
fn convert_callouts(markdown: &str, html: &str) -> String {
    let document = Html::parse_document(html);
    let mut result = markdown.to_string();

    // Process both <blockquote> elements and <div class="block ..."> callouts
    let selectors = vec![
        "blockquote.note",
        "blockquote.warning",
        "blockquote.important",
        "blockquote.tip",
        "blockquote.caution",
        "div.block.note",
        "div.block.warning",
        "div.block.important",
        "div.block.tip",
        "div.block.caution",
    ];

    for selector_str in selectors {
        if let Ok(callout_sel) = Selector::parse(selector_str) {
            // Determine callout type from selector
            let callout_type = if selector_str.ends_with("note") {
                "note"
            } else if selector_str.ends_with("warning") {
                "warning"
            } else if selector_str.ends_with("caution") {
                "caution"
            } else if selector_str.ends_with("important") {
                "important"
            } else if selector_str.ends_with("tip") {
                "tip"
            } else {
                "note"
            };

            for element in document.select(&callout_sel) {
                let label = match callout_type {
                    "note" => "Note",
                    "warning" => "Warning",
                    "caution" => "Caution",
                    "important" => "Important",
                    "tip" => "Tip",
                    _ => "Note",
                };

                // Convert the callout content to markdown preserving structure
                let callout_html = element.html();
                let callout_markdown = html2md::parse_html(&callout_html);

                if !callout_markdown.trim().is_empty() && callout_markdown.len() > 10 {
                    // Build GitHub-style callout
                    let mut callout_lines = vec![format!("> [!{}]", label)];

                    // Process markdown line by line, preserving headings and structure
                    for line in callout_markdown.lines() {
                        let trimmed = line.trim();
                        if !trimmed.is_empty() {
                            // Preserve markdown headings (#### becomes > ####)
                            callout_lines.push(format!("> {}", trimmed));
                        }
                    }

                    // Check for modal trigger links and add annotations
                    if let Ok(modal_sel) = Selector::parse("a.influxdb-detector-trigger, a[onclick*='toggleModal']") {
                        if element.select(&modal_sel).next().is_some() {
                            // Add annotation about interactive modal
                            callout_lines.push("> *(Interactive feature in HTML: Opens version detector modal)*".to_string());
                        }
                    }

                    let callout = callout_lines.join("\n") + "\n";

                    // Try to find and replace in markdown
                    // Extract the first line of content (likely a heading or distinctive text)
                    let first_content_line = callout_markdown.lines()
                        .map(|l| l.trim())
                        .find(|l| !l.is_empty() && l.len() > 3)
                        .unwrap_or("");

                    if !first_content_line.is_empty() {
                        // Try to find this content in the markdown
                        if let Some(idx) = result.find(first_content_line) {
                            // Find the end of this section (next heading or double newline)
                            let after_start = &result[idx..];
                            if let Some(section_end) = after_start.find("\n\n") {
                                let end_idx = idx + section_end;
                                result.replace_range(idx..end_idx, &callout);
                            }
                        }
                    }
                }
            }
        }
    }

    result
}

/// Convert HTML tables to Markdown format
fn convert_tables(markdown: &str, html: &str) -> String {
    let document = Html::parse_document(html);
    let mut result = markdown.to_string();

    if let Ok(table_sel) = Selector::parse("table") {
        for table in document.select(&table_sel) {
            // Get headers
            let mut headers = Vec::new();
            if let Ok(th_sel) = Selector::parse("thead th, thead td") {
                for th in table.select(&th_sel) {
                    headers.push(th.text().collect::<Vec<_>>().join(" ").trim().to_string());
                }
            }

            // If no thead, try first tr
            if headers.is_empty() {
                if let Ok(tr_sel) = Selector::parse("tr") {
                    if let Some(first_row) = table.select(&tr_sel).next() {
                        if let Ok(cell_sel) = Selector::parse("th, td") {
                            for cell in first_row.select(&cell_sel) {
                                headers.push(cell.text().collect::<Vec<_>>().join(" ").trim().to_string());
                            }
                        }
                    }
                }
            }

            if headers.is_empty() {
                continue;
            }

            // Build separator
            let separator = headers.iter().map(|_| "---").collect::<Vec<_>>().join(" | ");

            // Get data rows
            let mut data_rows = Vec::new();
            if let Ok(tr_sel) = Selector::parse("tbody tr, tr") {
                for (idx, row) in table.select(&tr_sel).enumerate() {
                    // Skip first row if it was used for headers
                    if idx == 0 && !table.select(&Selector::parse("thead").unwrap()).next().is_some() {
                        continue;
                    }

                    let mut cells = Vec::new();
                    if let Ok(cell_sel) = Selector::parse("td, th") {
                        for cell in row.select(&cell_sel) {
                            cells.push(cell.text().collect::<Vec<_>>().join(" ").trim().replace('\n', " "));
                        }
                    }

                    if !cells.is_empty() {
                        data_rows.push(format!("| {} |", cells.join(" | ")));
                    }
                }
            }

            // Build markdown table
            let md_table = format!(
                "\n| {} |\n| {} |\n{}\n\n",
                headers.join(" | "),
                separator,
                data_rows.join("\n")
            );

            // This is approximate replacement
            result.push_str(&md_table);
        }
    }

    result
}

/// Add headings to delimit tabbed content in markdown
/// Finds patterns like [Go](#)[Node.js](#)[Python](#) and replaces with heading
fn add_tab_delimiters_to_markdown(markdown: &str) -> String {
    use regex::Regex;

    // Pattern to match 2+ consecutive tab links
    let tabs_pattern = Regex::new(r"(\[[^\]]+\]\(#\)){2,}").unwrap();
    let first_tab_re = Regex::new(r"\[([^\]]+)\]\(#\)").unwrap();

    tabs_pattern.replace_all(markdown, |caps: &regex::Captures| {
        let full_match = &caps[0];

        // Extract first tab name
        if let Some(first_cap) = first_tab_re.captures(full_match) {
            format!("#### {} ####", &first_cap[1])
        } else {
            full_match.to_string()
        }
    }).to_string()
}

/// Normalize markdown headings to open-ATX style.
///
/// Converts setext headings (`Text\n====` → `# Text`, `Text\n----` → `## Text`)
/// and strips closing hashes from closed-ATX headings (`## Text ##` → `## Text`).
/// The setext text line must begin with a content character (not `#`, `>`, `|`,
/// `-`, `*`, `+`, or whitespace) so list items, blockquotes, and table rows are
/// never matched, and the underline must be a whole line of only `=`/`-`.
fn normalize_headings(markdown: &str) -> String {
    let result = SETEXT_H1.replace_all(markdown, "# $1");
    let result = SETEXT_H2.replace_all(&result, "## $1");
    let result = CLOSED_ATX.replace_all(&result, "$1");
    result.into_owned()
}

/// Post-process markdown to clean up formatting
fn postprocess_markdown(markdown: &str, html: &str, remove_h1: bool) -> String {
    let mut result = markdown.to_string();

    if remove_h1 {
        // Remove the first h1 heading (title is already in frontmatter)
        // Match both formats:
        // 1. ATX style: # Title\n
        // 2. Setext style: Title\n=====\n
        let h1_atx_pattern = Regex::new(r"^#\s+.*?\n+").unwrap();
        let h1_setext_pattern = Regex::new(r"^.+?\n=+\s*\n+").unwrap();

        // Try ATX style first
        if h1_atx_pattern.is_match(&result) {
            result = h1_atx_pattern.replace(&result, "").to_string();
        } else {
            // Try Setext style
            result = h1_setext_pattern.replace(&result, "").to_string();
        }
    }

    // Normalize headings to open-ATX. html2md emits setext for h1/h2
    // (`Text\n====` / `Text\n----`) and sometimes closed-ATX (`## Text ##`); the
    // baseline and the rest of the corpus use open-ATX. Run before callouts and
    // tables so a table separator (`| --- |`, contains `|`) or a thematic break
    // (blank line above) is never mistaken for a setext underline: the text line
    // must start with a content char (not `#>|-*+` or whitespace) and sit
    // directly above an all-`=`/`-` line.
    result = normalize_headings(&result);

    // Convert callouts
    result = convert_callouts(&result, html);

    // Convert tables (html2md might not handle them well)
    result = convert_tables(&result, html);

    // Add tab delimiters for tabbed content
    result = add_tab_delimiters_to_markdown(&result);

    // Remove UI element text that shouldn't be in markdown
    result = result.replace("Copy section", "");
    result = result.replace("Copy page", "");
    result = result.replace(" Copy to clipboard", "");

    // Remove HTML comments (<!--SOURCE-->, <!--pytest-codeblocks:...-->, etc.)
    let comment_pattern = Regex::new(r"<!--.*?-->").unwrap();
    result = comment_pattern.replace_all(&result, "").to_string();

    // Remove feedback and support sections at the bottom
    // Match "Was this page helpful?" to end of document
    let feedback_section = Regex::new(r"(?s)Was this page helpful\?.*$").unwrap();
    result = feedback_section.replace(&result, "").to_string();

    // Also remove "Support and feedback" heading if it somehow remains
    let support_section = Regex::new(r"(?s)#{2,6}\s+Support and feedback\s*\n.*$").unwrap();
    result = support_section.replace(&result, "").to_string();

    // Clean up excessive newlines
    result = EXCESSIVE_NEWLINES.replace_all(&result, "\n\n").to_string();

    // Remove separator artifacts
    result = SEPARATOR_ARTIFACTS.replace_all(&result, "").to_string();
    result = TRAILING_SEPARATOR.replace_all(&result, "").to_string();

    result.trim().to_string()
}

/// Fix code block language identifiers
/// html2md doesn't preserve language classes, so we need to extract them from HTML
/// and add them to the markdown code fences
fn fix_code_block_languages(markdown: &str, html: &str) -> String {
    let document = Html::parse_document(html);
    let mut result = markdown.to_string();

    // Find all code blocks with language classes or data-lang attributes
    if let Ok(code_selector) = Selector::parse("code[class*='language-'], code[data-lang]") {
        for code_element in document.select(&code_selector) {
            let mut lang: Option<String> = None;

            // Try to extract language from class (e.g., "language-bash" -> "bash")
            if let Some(class_attr) = code_element.value().attr("class") {
                for class in class_attr.split_whitespace() {
                    if class.starts_with("language-") {
                        lang = Some(class[9..].to_string()); // Skip "language-" prefix
                        break;
                    }
                }
            }

            // Fallback to data-lang attribute if class didn't have language
            if lang.is_none() {
                if let Some(data_lang) = code_element.value().attr("data-lang") {
                    lang = Some(data_lang.to_string());
                }
            }

            // If we found a language identifier, add it to the markdown fence
            if let Some(lang_str) = lang {
                // Get the code content
                let code_text = code_element.text().collect::<Vec<_>>().join("");
                let code_text = code_text.trim();

                // Find the code block in markdown (without language identifier)
                // Look for ```\n<code>\n``` pattern
                let fence_pattern = format!("```\n{}\n```", code_text);
                let fence_with_lang = format!("```{}\n{}\n```", lang_str, code_text);

                // Replace first occurrence
                if result.contains(&fence_pattern) {
                    result = result.replacen(&fence_pattern, &fence_with_lang, 1);
                }
            }
        }
    }

    result
}

/// Convert HTML to Markdown
fn html_to_markdown(html: &str, remove_h1: bool) -> String {
    // Pre-process HTML
    let html = replace_icon_spans(html);
    // Note: tab delimiters are added in post-processing on markdown, not HTML preprocessing

    // Use html2md for basic conversion
    let markdown = html2md::parse_html(&html);

    // Apply post-processing
    let markdown = postprocess_markdown(&markdown, &html, remove_h1);

    // Fix code block language identifiers
    fix_code_block_languages(&markdown, &html)
}

// ============================================================================
// Frontmatter Generation
// ============================================================================

#[derive(Debug, Serialize)]
struct Frontmatter {
    title: String,
    description: String,
    url: String,
    estimated_tokens: usize,
    #[serde(skip_serializing_if = "Option::is_none")]
    product: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    version: Option<String>,
}

fn generate_frontmatter(
    title: &str,
    description: &str,
    url_path: &str,
    content_length: usize,
    base_url: &str,
) -> String {
    let product = detect_product(url_path);

    // Sanitize description
    let description = description
        .chars()
        .filter(|c| !c.is_control() || *c == '\n')
        .collect::<String>()
        .split_whitespace()
        .collect::<Vec<_>>()
        .join(" ")
        .chars()
        .take(500)
        .collect::<String>();

    // Estimate tokens (4 chars per token)
    let estimated_tokens = (content_length + 3) / 4;

    // Convert relative URL to full URL using the provided base URL
    let full_url = format!("{}{}", base_url, url_path);

    let frontmatter = Frontmatter {
        title: title.to_string(),
        description,
        url: full_url,
        estimated_tokens,
        product: product.as_ref().map(|p| p.name.clone()),
        version: product.as_ref().map(|p| p.version.clone()),
    };

    match serde_yaml::to_string(&frontmatter) {
        Ok(yaml) => format!("---\n{}---", yaml),
        Err(_) => "---\n---".to_string(),
    }
}

// ============================================================================
// Node.js API (napi-rs bindings)
// ============================================================================

/// Convert HTML to Markdown with frontmatter
///
/// # Arguments
/// * `html_content` - Raw HTML content
/// * `url_path` - URL path for the page (for frontmatter generation)
/// * `base_url` - Base URL for the site (e.g., "http://localhost:1313" or "https://docs.influxdata.com")
///
/// # Returns
/// Markdown string with YAML frontmatter, or null if conversion fails
#[napi]
pub fn convert_to_markdown(html_content: String, url_path: String, base_url: String) -> Result<Option<String>> {
    match extract_article_content(&html_content) {
        Some((title, description, content)) => {
            // Omit the body h1 (the rendered page title): the title is already
            // in frontmatter, and dropping it keeps the LLM-facing twins
            // consistent with the API-reference markdown, which also omits it.
            let markdown = html_to_markdown(&content, true);
            let frontmatter = generate_frontmatter(&title, &description, &url_path, markdown.len(), &base_url);

            // Product info is already in frontmatter, no need to duplicate in content
            Ok(Some(format!("{}\n\n{}\n", frontmatter, markdown)))
        }
        None => Ok(None),
    }
}

/// Detect product from URL path
#[napi]
pub fn detect_product_from_path(url_path: String) -> Result<Option<ProductInfo>> {
    Ok(detect_product(&url_path))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_product_detection() {
        let product = detect_product("/influxdb3/core/get-started/");
        assert!(product.is_some());
        let p = product.unwrap();
        assert_eq!(p.name, "InfluxDB 3 Core");
        assert_eq!(p.version, "core");
    }

    #[test]
    fn test_html_to_markdown() {
        let html = "<p>Hello <strong>world</strong>!</p>";
        let md = html_to_markdown(html, false);
        assert!(md.contains("Hello **world**!"));
    }

    #[test]
    fn test_frontmatter_uses_version_not_product_version() {
        let html = r#"<html><head></head><body>
            <article class="article--content"><h1>Get started</h1><p>Body.</p></article>
          </body></html>"#;
        let out = convert_to_markdown(
            html.to_string(),
            "/influxdb3/core/get-started/".to_string(),
            "https://docs.influxdata.com".to_string(),
        )
        .unwrap()
        .unwrap();
        assert!(out.contains("\nversion: core\n"));
        assert!(!out.contains("product_version:"));
    }

    #[test]
    fn test_normalize_headings_setext_and_closed_atx() {
        let md = "Data model\n----------\n\nBody.\n\n#### Related ####\n\n| Col |\n| --- |\n| x |\n";
        let out = normalize_headings(md);
        assert!(out.contains("## Data model"), "setext h2 -> open ATX");
        assert!(!out.contains("----------"), "setext underline removed");
        assert!(out.contains("#### Related\n"), "closed ATX -> open ATX");
        assert!(!out.contains("Related ####"), "trailing hashes stripped");
        // GFM table separator must be untouched.
        assert!(out.contains("| --- |"), "table separator preserved");
    }

    #[test]
    fn test_normalize_headings_ignores_thematic_break() {
        // A thematic break (blank line above) is not a setext underline.
        let md = "A paragraph.\n\n---\n\nNext.\n";
        let out = normalize_headings(md);
        assert!(out.contains("\n---\n"), "thematic break preserved");
        assert!(!out.contains("## A paragraph"), "paragraph not promoted");
    }

    #[test]
    fn test_omits_body_h1_and_strips_format_selector() {
        // Minified attributes (unquoted) like the real Hugo output — the
        // format-selector widget must be fully removed, and the body h1 (page
        // title) omitted (it lives in frontmatter; matches the API-ref twins).
        let html = r#"<html><head></head><body>
            <article class=article--content>
              <div class=format-selector data-component=format-selector>
                <button class=format-selector__button aria-label="Copy page for AI">Copy page</button>
                <ul><li>for AI</li><li>View as Markdown</li></ul>
              </div>
              <h1>Get started</h1>
              <p>Real body content.</p>
            </article>
          </body></html>"#;
        let out = convert_to_markdown(
            html.to_string(),
            "/influxdb3/core/get-started/".to_string(),
            "https://docs.influxdata.com".to_string(),
        )
        .unwrap()
        .unwrap();
        let body = out.split("---").nth(2).unwrap();
        // Title is in frontmatter; the body must not repeat it as an h1
        // (ATX `# ` or setext `Get started\n===`).
        assert!(!body.contains("# Get started"), "ATX h1 must be omitted");
        assert!(!body.contains("Get started\n="), "setext h1 must be omitted");
        assert!(body.contains("Real body content."));
        assert!(!body.contains("for AI"), "format-selector text must be stripped");
        assert!(!body.contains("Copy page"));
        assert!(!body.contains("View as Markdown"));
    }

    #[test]
    fn test_frontmatter_omits_provenance_and_timestamps() {
        // publisher/canonical/date/lastmod are added later by the JS post-step,
        // never by the converter.
        let html = r#"<html><head>
            <meta name="last-modified" content="2025-01-15T00:00:00Z">
          </head><body>
            <article class="article--content"><h1>X</h1><p>Body.</p></article>
          </body></html>"#;
        let out = convert_to_markdown(
            html.to_string(),
            "/influxdb3/core/x/".to_string(),
            "https://docs.influxdata.com".to_string(),
        )
        .unwrap()
        .unwrap();
        assert!(!out.contains("publisher:"));
        assert!(!out.contains("canonical:"));
        assert!(!out.contains("date:"));
        assert!(!out.contains("lastmod:"));
    }
}
