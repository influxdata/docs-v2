---
applyTo: "content/**/*.md"
---

# Content File Guidelines

**Frontmatter reference**: [DOCS-FRONTMATTER.md](../../DOCS-FRONTMATTER.md)
**Shortcodes reference**: [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md)
**Working examples**: [content/example.md](../../content/example.md)

## CLI Tools for Content Workflow

### Creating New Content

Use `docs create` for AI-assisted scaffolding:

```bash
# Create from draft
docs create drafts/feature.md --products influxdb3_core

# Create and open files in editor (non-blocking)
docs create drafts/feature.md --products influxdb3_core --open

# Create and open, wait for editor (blocking)
docs create drafts/feature.md --products influxdb3_core --open --wait
```

### Editing Existing Content

Use `docs edit` to quickly find and open content files:

```bash
# Find and list files (no editor)
docs edit /influxdb3/core/admin/databases/ --list

# Open in editor (non-blocking, exits immediately)
docs edit /influxdb3/core/admin/databases/

# Open and wait for editor (blocking, interactive)
docs edit /influxdb3/core/admin/databases/ --wait

# Use specific editor
docs edit /influxdb3/core/admin/databases/ --editor nano
```

**Note:** Both commands are non-blocking by default (agent-friendly). Use `--wait` for interactive editing sessions.

## Required for All Content Files

Every content file needs:
```yaml
title:       # Page h1 heading
description: # SEO meta description
menu:
  product_menu_key: # Identifies the Hugo menu specific to the current product
    name:    # Navigation link text
    parent:  # Parent menu item (if nested)
weight:      # Sort order (1-99, 101-199, 201-299...)
```

## Style Guidelines

- Use semantic line feeds (one sentence per line)
- Test all code examples before committing
- Use appropriate shortcodes for UI elements

## Most Common Shortcodes

**Callouts**:
```markdown
> [!Note]
> [!Warning]
> [!Caution]
> [!Important]
> [!Tip]
```

**Required elements**:
```markdown
{{< req >}}
{{< req type="key" >}}
```

**Code placeholders**:
~~~markdown
```sh { placeholders="DATABASE_NAME|API_TOKEN" }
curl -X POST https://cloud2.influxdata.com/api/v2/write?bucket=DATABASE_NAME
```
~~~

Replace the following:
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your database name
```

**Tabbed content**:
```markdown
{{< tabs-wrapper >}}
{{% tabs %}}
[Tab 1](#)
[Tab 2](#)
{{% /tabs %}}
{{% tab-content %}}
Content for tab 1
{{% /tab-content %}}
{{% tab-content %}}
Content for tab 2
{{% /tab-content %}}
{{< /tabs-wrapper >}}
```

For complete shortcodes reference, see [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md).
