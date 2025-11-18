# Documentation Build Scripts

## html-to-markdown.js

Converts Hugo-generated HTML files to fully-rendered Markdown with evaluated shortcodes, dereferenced shared content, and removed comments.

### Purpose

This script generates production-ready Markdown output for LLM consumption and user downloads. The generated Markdown:

- Has all Hugo shortcodes evaluated to text (e.g., `{{% product-name %}}` → "InfluxDB 3 Core")
- Includes dereferenced shared content in the body
- Removes HTML/Markdown comments
- Adds product context to frontmatter
- Mirrors the HTML version but in clean Markdown format

### Usage

```bash
# Generate all markdown files (run after Hugo build)
yarn build:md

# Generate with verbose logging
yarn build:md:verbose

# Generate for specific path
node scripts/html-to-markdown.js --path influxdb3/core

# Generate limited number for testing
node scripts/html-to-markdown.js --limit 10

# Combine options
node scripts/html-to-markdown.js --path telegraf/v1 --verbose
```

### Options

- `--path <path>`: Process specific path within `public/` (default: process all)
- `--limit <n>`: Limit number of files to process (useful for testing)
- `--verbose`: Enable detailed logging of conversion progress

### Build Process

1. **Hugo generates HTML** (with all shortcodes evaluated):
   ```bash
   npx hugo --quiet
   ```

2. **Script converts HTML to Markdown**:
   ```bash
   yarn build:md
   ```

3. **Generated files**:
   - Location: `public/**/index.md` (alongside `index.html`)
   - Git status: Ignored (entire `public/` directory is gitignored)
   - Deployment: Generated at build time, like API docs

### Features

#### Product Context Detection

Automatically detects and adds product information to frontmatter:

```yaml
---
title: Set up InfluxDB 3 Core
description: Install, configure, and set up authorization...
url: /influxdb3/core/get-started/setup/
product: InfluxDB 3 Core
product_version: core
date: 2025-11-13
lastmod: 2025-11-13
---
```

Supported products:
- InfluxDB 3 Core, Enterprise, Cloud Dedicated, Cloud Serverless, Clustered
- InfluxDB v2, v1, Cloud (TSM), Enterprise v1
- Telegraf, Chronograf, Kapacitor, Flux

#### Turndown Configuration

Custom Turndown rules for InfluxData documentation:

- **Code blocks**: Preserves language identifiers
- **GitHub callouts**: Converts to `> [!Note]` format
- **Tables**: GitHub-flavored markdown tables
- **Lists**: Preserves nested lists and formatting
- **Links**: Keeps relative links intact
- **Images**: Preserves alt text and paths

#### Content Extraction

Extracts only article content (removes navigation, footer, etc.):
- Target selector: `article.article--content`
- Skips files without article content (with warning)

### Integration

**Local Development:**
```bash
# After making content changes
npx hugo --quiet && yarn build:md
```

**CircleCI Build Pipeline:**

The script runs automatically in the CircleCI build pipeline after Hugo generates HTML:

```yaml
# .circleci/config.yml
- run:
    name: Hugo Build
    command: yarn hugo --environment production --logLevel info --gc --destination workspace/public
- run:
    name: Generate LLM-friendly Markdown
    command: node scripts/html-to-markdown.js
```

**Build order:**
1. Hugo builds HTML → `workspace/public/**/*.html`
2. `html-to-markdown.js` converts HTML → `workspace/public/**/*.md`
3. All files deployed to S3

**Production Build (Manual):**
```bash
npx hugo --quiet
yarn build:md
```

**Watch Mode:**
For development with auto-regeneration, run Hugo server and regenerate markdown after content changes:
```bash
# Terminal 1: Hugo server
npx hugo server

# Terminal 2: After making changes
yarn build:md
```

### Performance

- **Processing speed**: ~10-20 files/second
- **Full site**: 5,581 HTML files in ~5 minutes
- **Memory usage**: Minimal (processes files sequentially)
- **Caching**: None (regenerates from HTML each time)

### Troubleshooting

**No article content found:**
```
⚠️  No article content found in /path/to/file.html
```
- File doesn't have `article.article--content` selector
- Usually navigation pages or redirects
- Safe to ignore

**Shortcodes still present:**
- Run after Hugo has generated HTML, not before
- Hugo must complete its build first

**Missing product context:**
- Check that URL path matches patterns in `PRODUCT_MAP`
- Add new products to the map if needed

### See Also

- [Plan document](../.context/PLAN-markdown-rendering.md) - Architecture decisions
- [API docs generation](../api-docs/README.md) - Similar pattern for API reference
- [Package.json scripts](../package.json) - Build commands
