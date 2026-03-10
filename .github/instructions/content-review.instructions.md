---
applyTo: "content/**/*.md"
---

# Content Review Criteria

Review documentation changes against these rules. Only flag issues you are
confident about. Reference the linked docs for detailed rules.

## Frontmatter

Rules: [DOCS-FRONTMATTER.md](../../DOCS-FRONTMATTER.md)

- `title` and `description` are required on every page
- `menu` structure matches the product's menu key
- `weight` is present for pages in navigation
- `source` paths point to valid `/shared/` paths
- No duplicate or conflicting frontmatter keys

## Shortcode Syntax

Rules: [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md)

- `{{< >}}` for HTML output, `{{% %}}` for Markdown-processed content
- Closing tags match opening tags
- Required parameters are present
- Callouts use GitHub-style syntax: `> [!Note]`, `> [!Warning]`, etc.

## Heading Hierarchy

- No h1 headings in content (h1 comes from `title` frontmatter)
- Headings don't skip levels (h2 -> h4 without h3)

## Semantic Line Feeds

Rules: [DOCS-CONTRIBUTING.md](../../DOCS-CONTRIBUTING.md)

- One sentence per line (better diffs)
- Long sentences on their own line, not concatenated

## Terminology and Product Names

Products defined in [data/products.yml](../../data/products.yml):

- Use official names: "InfluxDB 3 Core", "InfluxDB 3 Enterprise",
  "InfluxDB Cloud Serverless", "InfluxDB Cloud Dedicated"
- Don't mix v2/v3 terminology (e.g., "bucket" in v3 Core docs)
- Version references match the content path

## Links

- Internal links use relative paths or Hugo `relref` shortcodes
- No hardcoded `docs.influxdata.com` links in content files
- Anchor links match actual heading IDs

## Code Blocks

- Use `python` not `py` for language identifiers (pytest requirement)
- Long options in CLI examples (`--output` not `-o`)
- Keep lines within 80 characters
- Include language identifier on fenced code blocks

## Shared Content

- `source:` frontmatter points to an existing shared file
- Shared files don't contain frontmatter (only content)
- Changes to shared content affect multiple products — flag if unintentional

## Severity

- **BLOCKING**: Broken rendering, wrong product names, missing required
  frontmatter, malformed shortcodes, h1 in content body
- **WARNING**: Missing semantic line feeds, skipped heading levels, missing
  `weight`, long CLI options not used
- **INFO**: Suggestions, code block missing language identifier, opportunities
  to use shared content
