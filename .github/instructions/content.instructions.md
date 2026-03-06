---
applyTo: "content/**/*.md"
---

# Content File Guidelines

**Frontmatter reference**: [DOCS-FRONTMATTER.md](../../DOCS-FRONTMATTER.md)
**Shortcodes reference**: [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md)
**Working examples**: [content/example.md](../../content/example.md)

**For complete content editing workflow**, see [.claude/skills/content-editing/SKILL.md](../../.claude/skills/content-editing/SKILL.md) which covers:

- Creating and editing content with CLI tools
- Shared content management and testing
- Fact-checking with MCP server
- Complete validation workflows

## CLI Tools for Content Workflow

The unified `docs` CLI provides tools for content creation and editing. For decision guidance on when to use CLI vs direct editing, see [.claude/skills/docs-cli-workflow/SKILL.md](../../.claude/skills/docs-cli-workflow/SKILL.md).

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

**Options:**

- Both commands are **non-blocking by default** (agent-friendly)
- Use `--wait` for interactive editing sessions
- Use `--list` with `docs edit` to see files without opening
- Accepts both product keys (`influxdb3_core`) and paths (`/influxdb3/core`)

### Other CLI Commands

```bash
# Add placeholder syntax to code blocks
docs placeholders <file.md>

# Audit documentation coverage
docs audit --products influxdb3_core

# Generate release notes
docs release-notes v3.1.0 v3.2.0 --products influxdb3_core
```

For complete CLI reference, run `docs --help`.

## Shared Content Management

When editing files with `source:` frontmatter (shared content):

- **Recommended**: Use `docs edit <url>` - automatically finds and opens all related files
- **Manual**: If editing directly, remember to touch sourcing files to trigger Hugo rebuild

For complete shared content workflow, see [.claude/skills/content-editing/SKILL.md](../../.claude/skills/content-editing/SKILL.md).

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

## Testing After Content Changes

```bash
# 1. Verify Hugo build
hugo --quiet

# 2. Validate links
yarn test:links

# 3. Test code blocks (if applicable)
yarn test:codeblocks:all
```

For comprehensive testing workflows, see [.claude/skills/content-editing/SKILL.md](../../.claude/skills/content-editing/SKILL.md).

## Style Guidelines

- Use semantic line feeds (one sentence per line)
- Test all code examples before committing
- Use appropriate shortcodes for UI elements
- Follow Google Developer Documentation Style Guide
- Use active voice, present tense, second person

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

````markdown
```sh { placeholders="DATABASE_NAME|API_TOKEN" }
curl -X POST https://cloud2.influxdata.com/api/v2/write?bucket=DATABASE_NAME
```
````

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your database name

````

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
````

For complete shortcodes reference, see [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md).

## Related Resources

- **Complete workflow**: [.claude/skills/content-editing/SKILL.md](../../.claude/skills/content-editing/SKILL.md)
- **CLI decision guidance**: [.claude/skills/docs-cli-workflow/SKILL.md](../../.claude/skills/docs-cli-workflow/SKILL.md)
- **Frontmatter**: [DOCS-FRONTMATTER.md](../../DOCS-FRONTMATTER.md)
- **Shortcodes**: [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md)
- **Contributing**: [DOCS-CONTRIBUTING.md](../../DOCS-CONTRIBUTING.md)
