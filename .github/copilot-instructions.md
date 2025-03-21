# GitHub Copilot Instructions for InfluxData Documentation

GitHub Copilot should assist with writing and styling InfluxData documentation according to the following guidelines:

## Documentation Overview

- Documentation covers InfluxDB and associated products (Telegraf, client libraries)
- Primary documentation site: https://docs.influxdata.com
- Source repository: https://github.com/influxdata/docs-v2
- Hugo static site generator is used to build the documentation

## Products and Query Languages

When working with product-specific content, identify the appropriate product from:

- InfluxDB OSS (1.x, 2.x, 3 Core)
- InfluxDB Enterprise
- InfluxDB Cloud variants (TSM, Dedicated, Serverless)
- InfluxDB 3 Clustered
- Telegraf

Identify appropriate query language (SQL, InfluxQL, Flux) based on product version.

## Style Standards

- Follow Google Developer Documentation style guidelines
- For REST API references, follow YouTube Data API style
- Use semantic line feeds (one sentence per line) for easier diff comparison
- Use only h2-h6 headings in content (h1 comes from frontmatter)
- Image naming format: `project/version-context-description.png`

## Markdown Conventions

- Use standard Markdown for most content
- Include proper frontmatter for each page (title, description, weight, etc.)
- Use available shortcodes for notes, warnings, tabbed content, and other special formatting
- Observe semantic line feeds (one sentence per line)
- Use proper heading hierarchy (h2-h6 only)

## Shortcodes

Help use the following shortcodes appropriately:

- Notes and warnings: `{{% note %}}` and `{{% warn %}}`
- Product-specific content: `{{% enterprise %}}`, `{{% cloud %}}`
- Tabbed content: `{{< tabs-wrapper >}}`, `{{% tabs %}}`, `{{% tab-content %}}`
- Latest version links: `{{< latest >}}`, `{{< latest-patch >}}`
- API endpoints: `{{< api-endpoint >}}`
- Required elements: `{{< req >}}`
- Navigation: `{{< page-nav >}}`
- Diagrams: `{{< diagram >}}`, `{{< filesystem-diagram >}}`

## Page Frontmatter

Assist with creating appropriate frontmatter that includes:

```yaml
title: # Title of the page (h1)
seotitle: # Page title for SEO
list_title: # Title for article lists
description: # Page description for SEO
menu:
  product_version:
weight: # Page sort order (follow level structure: 1-99, 101-199, etc.)
```

## Testing Code Blocks

When writing code examples, add appropriate testing annotations:

```python
print("Hello, world!")
```

<!--pytest-codeblocks:expected-output-->
```
Hello, world!
```

## InfluxDB-specific Conventions

- Use appropriate product names and versions consistently
- Link to canonical documentation where appropriate
- Follow InfluxData vocabulary and terminology guidelines

## Pre-commit hooks

- Assist with Vale.sh linter configurations
- Assist with Dockerfile and Docker Compose files
- Assist with using pytest and pytest-codeblocks