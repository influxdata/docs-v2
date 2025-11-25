use clap::{Parser, Subcommand};
use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use std::time::Instant;
use walkdir::WalkDir;

#[derive(Parser)]
#[command(name = "rust-markdown")]
#[command(about = "Convert HTML to Markdown (Rust prototype)", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Convert a single HTML file to Markdown
    Convert {
        /// Input HTML file path
        input: String,
        /// Output markdown file path (optional, prints to stdout if not specified)
        #[arg(short, long)]
        output: Option<String>,
    },
    /// Benchmark conversion on a directory of HTML files
    Benchmark {
        /// Directory containing HTML files
        dir: String,
        /// Pattern to match (e.g., "index.html")
        #[arg(short, long, default_value = "index.html")]
        pattern: String,
    },
}

#[derive(Serialize, Deserialize, Debug)]
struct Frontmatter {
    title: String,
    description: String,
    url: String,
    product: Option<String>,
    estimated_tokens: usize,
}

fn extract_article_content(html: &str) -> Option<String> {
    let document = Html::parse_document(html);

    // Try to find article content using the same selector as JavaScript version
    let article_selector = Selector::parse(".article--content").ok()?;

    if let Some(article) = document.select(&article_selector).next() {
        Some(article.html())
    } else {
        // Fallback: use entire body
        let body_selector = Selector::parse("body").ok()?;
        document.select(&body_selector).next().map(|b| b.html())
    }
}

fn extract_title(html: &str) -> String {
    let document = Html::parse_document(html);

    // Try h1 first
    if let Ok(h1_selector) = Selector::parse("h1") {
        if let Some(h1) = document.select(&h1_selector).next() {
            return h1.text().collect::<Vec<_>>().join(" ");
        }
    }

    // Fallback to title tag
    if let Ok(title_selector) = Selector::parse("title") {
        if let Some(title) = document.select(&title_selector).next() {
            return title.text().collect::<Vec<_>>().join(" ");
        }
    }

    "Untitled".to_string()
}

fn extract_description(html: &str) -> String {
    let document = Html::parse_document(html);

    // Look for meta description
    if let Ok(meta_selector) = Selector::parse("meta[name='description']") {
        if let Some(meta) = document.select(&meta_selector).next() {
            if let Some(content) = meta.value().attr("content") {
                return content.to_string();
            }
        }
    }

    String::new()
}

fn generate_frontmatter(title: &str, description: &str, url_path: &str, content_length: usize) -> String {
    let estimated_tokens = content_length / 4; // 4 chars per token heuristic

    let frontmatter = Frontmatter {
        title: title.to_string(),
        description: description.to_string(),
        url: url_path.to_string(),
        product: None, // TODO: Implement product detection
        estimated_tokens,
    };

    match serde_yaml::to_string(&frontmatter) {
        Ok(yaml) => format!("---\n{}---\n\n", yaml),
        Err(_) => String::from("---\n---\n\n"),
    }
}

fn convert_html_to_markdown(html: &str, url_path: &str) -> Result<String, String> {
    // Extract metadata
    let title = extract_title(html);
    let description = extract_description(html);

    // Extract article content
    let article_html = extract_article_content(html)
        .ok_or_else(|| "No article content found".to_string())?;

    // Convert HTML to Markdown using html2md
    let markdown_content = html2md::parse_html(&article_html);

    // Generate frontmatter
    let frontmatter = generate_frontmatter(&title, &description, url_path, markdown_content.len());

    // Combine frontmatter + content
    Ok(format!("{}{}", frontmatter, markdown_content))
}

fn convert_file(input_path: &str, output_path: Option<&str>) -> Result<(), String> {
    // Read input HTML
    let html = fs::read_to_string(input_path)
        .map_err(|e| format!("Failed to read {}: {}", input_path, e))?;

    // Derive URL path from file path (similar to JavaScript version)
    let url_path = input_path
        .replace("public", "")
        .replace("/index.html", "/");

    // Convert to markdown
    let markdown = convert_html_to_markdown(&html, &url_path)?;

    // Write output
    if let Some(output) = output_path {
        fs::write(output, &markdown)
            .map_err(|e| format!("Failed to write {}: {}", output, e))?;
        println!("✓ Converted {} → {}", input_path, output);
    } else {
        print!("{}", markdown);
    }

    Ok(())
}

fn benchmark_directory(dir_path: &str, pattern: &str) -> Result<(), String> {
    println!("🔍 Finding HTML files in {}...\n", dir_path);

    let start_find = Instant::now();

    // Find all matching HTML files
    let files: Vec<_> = WalkDir::new(dir_path)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
        .filter(|e| e.file_name().to_string_lossy() == pattern)
        .collect();

    let find_duration = start_find.elapsed();
    let file_count = files.len();

    println!("Found {} files in {:.2}s\n", file_count, find_duration.as_secs_f64());

    if file_count == 0 {
        return Err("No files found to benchmark".to_string());
    }

    println!("📊 Starting benchmark...\n");

    let start_convert = Instant::now();
    let mut success_count = 0;
    let mut error_count = 0;

    for (idx, entry) in files.iter().enumerate() {
        let path = entry.path().to_string_lossy().to_string();

        match convert_file(&path, None) {
            Ok(_) => success_count += 1,
            Err(e) => {
                eprintln!("✗ Error converting {}: {}", path, e);
                error_count += 1;
            }
        }

        // Progress updates every 100 files
        if (idx + 1) % 100 == 0 {
            let elapsed = start_convert.elapsed().as_secs_f64();
            let rate = (idx + 1) as f64 / elapsed;
            println!("  Progress: {}/{} ({:.1} files/sec)", idx + 1, file_count, rate);
        }
    }

    let convert_duration = start_convert.elapsed();
    let total_duration = start_find.elapsed();

    println!("\n════════════════════════════════");
    println!("📊 Benchmark Results");
    println!("════════════════════════════════");
    println!("Files processed:  {}", success_count);
    println!("Errors:          {}", error_count);
    println!("Conversion time: {:.2}s", convert_duration.as_secs_f64());
    println!("Total time:      {:.2}s", total_duration.as_secs_f64());
    println!("Throughput:      {:.1} files/sec", success_count as f64 / convert_duration.as_secs_f64());
    println!("════════════════════════════════\n");

    Ok(())
}

fn main() {
    let cli = Cli::parse();

    let result = match cli.command {
        Commands::Convert { input, output } => {
            convert_file(&input, output.as_deref())
        }
        Commands::Benchmark { dir, pattern } => {
            benchmark_directory(&dir, &pattern)
        }
    };

    if let Err(e) = result {
        eprintln!("Error: {}", e);
        std::process::exit(1);
    }
}
