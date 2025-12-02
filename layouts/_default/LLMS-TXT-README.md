# llms.txt Generation System

This directory contains Hugo templates for automatically generating `llms.txt` files following the [llmstxt.org](https://llmstxt.org/) specification.

## Overview

The llms.txt format helps LLMs discover and understand documentation structure. Hugo automatically generates these files during the build process.

## Template Files

### `index.llms.txt`
- **Location**: `/layouts/index.llms.txt`
- **Output**: `/llms.txt` (site-level)
- **Type**: Hugo template
- **Purpose**: Primary entry point for LLM discovery
- **Content**: Dynamically generated from `data/products.yml` with:
  - Product descriptions from data files
  - Organized by product category
  - Conditional rendering for optional products

### `section.llms.txt`
- **Location**: `/layouts/_default/section.llms.txt`
- **Output**: Product/section-level llms.txt files (e.g., `/influxdb3/core/llms.txt`)
- **Type**: Hugo template
- **Purpose**: Provide curated navigation for specific products/sections
- **Content**: Dynamically generated from:
  - Product metadata from `data/products.yml`
  - Section content and child pages
  - Page descriptions

## Hugo Configuration

In `config/_default/hugo.yml`:

```yaml
outputFormats:
  llmstxt:
    mediaType: text/plain
    baseName: llms
    isPlainText: true
    notAlternative: true
    permalinkable: true
    suffixes:
      - txt

outputs:
  section:
    - HTML
    - llmstxt  # Generates llms.txt for all sections
  home:
    - HTML
    - llmstxt  # Generates root /llms.txt
```

## Generated Files

After building with `hugo`:

```
public/
├── llms.txt                              # Site-level discovery file
├── influxdb3/
│   ├── core/
│   │   ├── llms.txt                      # InfluxDB 3 Core product index
│   │   ├── get-started/
│   │   │   └── llms.txt                  # Section-level index
│   │   └── query-data/
│   │       └── llms.txt                  # Section-level index
│   ├── cloud-dedicated/
│   │   └── llms.txt                      # Cloud Dedicated product index
│   └── cloud-serverless/
│       └── llms.txt                      # Cloud Serverless product index
├── telegraf/
│   └── v1/
│       └── llms.txt                      # Telegraf product index
└── flux/
    └── v0/
        └── llms.txt                      # Flux product index
```

## llmstxt.org Specification Compliance

### Required Elements
- ✅ **H1 header**: Product or section name
- ✅ **Curated links**: Not exhaustive - intentionally selective

### Optional Elements
- ✅ **Blockquote summary**: Brief product/section description
- ✅ **Content paragraphs**: Additional context (NO headings allowed)
- ✅ **H2-delimited sections**: Organize links by category
- ✅ **Link format**: `[Title](url): Description`

### Key Rules
1. **H1 is required** - Only the product/section name
2. **Content sections cannot have headings** - Use paragraphs only
3. **Curate, don't list everything** - Be selective with links
4. **Use relative URLs** - LLMs resolve them in context
5. **"Optional" section** - Signals skippable secondary content

## Customizing llms.txt Files

### For Site-Level (/llms.txt)

Edit `/layouts/index.llms.txt` directly. This file is hardcoded for precise curation of top-level products.

### For Product/Section-Level

The `/layouts/_default/section.llms.txt` template automatically generates llms.txt files for all sections.

**To customize a specific product's llms.txt:**

1. Create a product-specific template following Hugo's lookup order:
   ```
   layouts/influxdb3/core/section.llms.txt  # Specific to Core
   layouts/influxdb3/section.llms.txt       # All InfluxDB 3 products
   layouts/_default/section.llms.txt        # Default for all
   ```

2. **Example: Custom template for InfluxDB 3 Core**

   Create `/layouts/influxdb3/core/section.llms.txt`:
   ```
   # InfluxDB 3 Core

   > InfluxDB 3 Core is the open source, high-performance time series database.

   {{- /* Custom curated sections */ -}}

   ## Getting Started

   - [Install InfluxDB 3 Core](/influxdb3/core/install/): Installation guide
   - [Quick start](/influxdb3/core/get-started/): Get started in 5 minutes

   ## Guides

   - [Write data](/influxdb3/core/write-data/): Write data guide
   - [Query with SQL](/influxdb3/core/query-data/sql/): SQL query guide
   ```

### Using Product Metadata from data/products.yml

The template accesses product metadata:

```go-html-template
{{- $product := index .Site.Data.products "influxdb3_core" -}}
{{- $productName := $product.name -}}           {{/* "InfluxDB 3 Core" */}}
{{- $productAltname := $product.altname -}}     {{/* Alternative name */}}
{{- $productVersion := $product.latest -}}      {{/* "core" */}}
```

## Testing llms.txt Files

### Build and Check Output

```bash
# Build Hugo site
./node_modules/.bin/hugo --quiet

# Check generated llms.txt files
ls -la public/llms.txt
ls -la public/influxdb3/core/llms.txt

# View content
cat public/llms.txt
cat public/influxdb3/core/llms.txt
```

### Validate Against Specification

Check that generated files follow llmstxt.org spec:

1. ✅ Starts with single H1 header
2. ✅ Optional blockquote summary after H1
3. ✅ Content sections have NO headings
4. ✅ H2 sections organize curated links
5. ✅ Link format: `[Title](url): Description`
6. ✅ Relative URLs work correctly

### Test LLM Discovery

```bash
# Test with curl (simulates LLM access)
curl https://docs.influxdata.com/llms.txt
curl https://docs.influxdata.com/influxdb3/core/llms.txt

# Verify content type
curl -I https://docs.influxdata.com/llms.txt
# Should return: Content-Type: text/plain
```

## Build Process

llms.txt files are automatically generated during:

1. **Local development**: `hugo server` regenerates on file changes
2. **Production build**: `hugo --quiet` generates all llms.txt files
3. **CI/CD**: Build pipeline includes llms.txt generation

## Maintenance

### Adding a New Product

1. Add product metadata to `data/products.yml`
2. llms.txt will auto-generate using `section.llms.txt` template
3. Optionally create custom template in `layouts/<product>/section.llms.txt`

### Updating Site-Level llms.txt

Edit `/layouts/index.llms.txt` to add/remove product links.

### Troubleshooting

**Problem**: llms.txt file not generated
**Solution**: Check that output format is configured in `config/_default/hugo.yml`

**Problem**: Content includes HTML tags
**Solution**: Use `| plainify` filter in template

**Problem**: URLs are absolute instead of relative
**Solution**: Use `.RelPermalink` instead of `.Permalink`

## Resources

- [llmstxt.org specification](https://llmstxt.org/)
- [Hugo output formats](https://gohugo.io/templates/output-formats/)
- [InfluxData products.yml](../../data/products.yml)
