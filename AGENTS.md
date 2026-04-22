# InfluxData Documentation (docs-v2)

> **Shared project guidelines for all AI assistants**
>
> **Other instruction resources**:
> - [.github/copilot-instructions.md](.github/copilot-instructions.md) - GitHub Copilot (CLI tools, workflows, repo structure)
> - [CLAUDE.md](CLAUDE.md) - Claude with MCP (pointer file)
> - [.claude/](.claude/) - Claude MCP configuration (commands, agents, skills)
> - [.github/instructions/](.github/instructions/) - File pattern-specific instructions

## Commands

| Task | Command | Notes |
|------|---------|-------|
| Install | `CYPRESS_INSTALL_BINARY=0 yarn install` | ~4s |
| Build | `npx hugo --quiet` | ~75s — **NEVER CANCEL** |
| Dev server | `npx hugo server` | ~92s, port 1313 |
| Test code blocks | `yarn test:codeblocks:all` | 15-45m — **NEVER CANCEL** |
| Lint | `yarn lint` | ~1m |

## Repository Structure

```
docs-v2/
├── content/                 # Documentation content
│   ├── influxdb3/          # InfluxDB 3 (core, enterprise, cloud-*)
│   ├── influxdb/           # InfluxDB v2 and v1
│   ├── enterprise_influxdb/ # InfluxDB Enterprise v1
│   ├── telegraf/           # Telegraf docs
│   ├── shared/             # Shared content across products
│   └── example.md          # Shortcode testing playground
├── layouts/                # Hugo templates and shortcodes
├── assets/                 # JS, CSS, TypeScript
├── api-docs/              # InfluxDB OpenAPI specifications, API reference documentation generation scripts
├── data/                  # YAML/JSON data files
├── public/                # Build output (gitignored, ~529MB)
└── .github/
    └── copilot-instructions.md  # Primary AI instructions
```

**Content Paths**: See [copilot-instructions.md](.github/copilot-instructions.md#content-organization)

## Documentation MCP Server

A hosted MCP server provides semantic search over all InfluxDB documentation.
Use it to verify technical accuracy, check API syntax, and find related docs.

See the [InfluxDB documentation MCP server guide](https://docs.influxdata.com/influxdb3/core/admin/mcp-server/) for setup instructions.

## Common Workflows

### Creating/Editing Content

**Frontmatter** (page metadata):
```yaml
title: Page Title          # Required - becomes h1
description: Brief desc    # Required - for SEO
menu:
  influxdb_2_0:
    name: Nav Label       # Optional - nav display name
    parent: Parent Node   # Optional - for nesting
weight: 1                  # Required - sort order
```

**Shared Content** (avoid duplication):
```yaml
source: /shared/path/to/content.md
```

Shared content files (`/shared/path/to/content.md`):
- Don't store frontmatter
- Can use `{{% show-in %}}`, `{{% hide-in %}}`, and the `version` keyword (`/influxdb3/version/content.md`)

**Common Shortcodes**:
- Callouts: `> [!Note]`, `> [!Warning]`, `> [!Important]`, `> [!Tip]`
- Tabs: `{{< tabs-wrapper >}}` + `{{% tabs %}}` + `{{% tab-content %}}`
- Required: `{{< req >}}` or `{{< req type="key" >}}`
- Code placeholders: `{ placeholders="<PLACEHOLDER>" }`

**📖 Complete Reference**: [DOCS-SHORTCODES.md](DOCS-SHORTCODES.md) | [DOCS-FRONTMATTER.md](DOCS-FRONTMATTER.md)

### Testing Changes

**Always test before committing**:
```bash
# Verify server renders (check 200 status)
curl -s -o /dev/null -w "%{http_code}" http://localhost:1313/influxdb3/core/

# Test specific content
yarn test:links content/influxdb3/core/**/*.md

# Run style linting
.ci/vale/vale.sh content/**/*.md
```

**📖 Complete Reference**: [DOCS-TESTING.md](DOCS-TESTING.md)


## Worktree Awareness

This repository uses git worktrees. When running in a worktree, the working
directory IS the repo root — use it for all file paths. Never hardcode or resolve
paths to the main clone (`/Users/*/docs-v2/` without `.claude/worktrees/`).

Scripts that need `PROJECT_ROOT` derive it from `SCRIPT_DIR` (see
`test/scripts/init-influxdb3.sh`). Agents should use their current working
directory, not the main clone path.

## Search Patterns

When searching for InfluxDB 3 content, search these paths in parallel (not
sequentially):
- `content/shared/influxdb3-*/` — actual content (most content lives here)
- `content/influxdb3/core/` — Core frontmatter stubs with `source:` references
- `content/influxdb3/enterprise/` — Enterprise frontmatter stubs

Use Grep and Glob for all local content searches. Run independent searches in
parallel — one call per directory — rather than one at a time.

## Constraints

- **NEVER cancel** Hugo builds (~75s) or test runs (15-45m) — the site has 5,359+ pages
- Set timeouts: Hugo 180s+, tests 30m+
- Use `python` not `py` for code block language identifiers (pytest won't collect `py` blocks)
- Shared content files (`content/shared/`) have no frontmatter — the consuming page provides it via `source:` reference. For InfluxDB 3, the shared directories (`content/shared/influxdb3-*/`) contain the actual prose; product directories contain thin stubs
- Product names and versions come from `data/products.yml` (single source of truth)
- Commit format: `type(scope): description` — see [DOCS-CONTRIBUTING.md](DOCS-CONTRIBUTING.md#commit-guidelines)
- Network-restricted environments: Cypress (`CYPRESS_INSTALL_BINARY=0`), Docker builds, and Alpine packages may fail

## Style Rules

Follows [Google Developer Documentation Style Guide](https://developers.google.com/style) with these project-specific additions:

- **Semantic line feeds** — one sentence per line (better diffs)
- **No h1 in content** — `title` frontmatter auto-generates h1
- Active voice, present tense, second person
- Long options in CLI examples (`--output` not `-o`)
- Code blocks within 80 characters

## Content Structure

**Required frontmatter**: `title`, `description`, `menu`, `weight`
— see [DOCS-FRONTMATTER.md](DOCS-FRONTMATTER.md)

**Shared content**: `source: /shared/path/to/content.md`
— shared files use `{{% show-in %}}` / `{{% hide-in %}}` for product-specific content

**Shortcodes**: Callouts use `> [!Note]` / `> [!Warning]` syntax
— see [DOCS-SHORTCODES.md](DOCS-SHORTCODES.md) and [content/example.md](content/example.md)

## Product Content Paths

Canonical paths from `data/products.yml`:

| Product | Content Path |
|---------|-------------|
| InfluxDB 3 Core | `content/influxdb3/core/` |
| InfluxDB 3 Enterprise | `content/influxdb3/enterprise/` |
| InfluxDB 3 Explorer | `content/influxdb3/explorer/` |
| InfluxDB Cloud Serverless | `content/influxdb3/cloud-serverless/` |
| InfluxDB Cloud Dedicated | `content/influxdb3/cloud-dedicated/` |
| InfluxDB Clustered | `content/influxdb3/clustered/` |
| InfluxDB OSS v2 | `content/influxdb/v2/` |
| InfluxDB OSS v1 | `content/influxdb/v1/` |
| InfluxDB Cloud (TSM) | `content/influxdb/cloud/` |
| InfluxDB Enterprise v1 | `content/enterprise_influxdb/` |
| Telegraf | `content/telegraf/` |
| Chronograf | `content/chronograf/` |
| Kapacitor | `content/kapacitor/` |
| Flux | `content/flux/` |
| Shared content | `content/shared/` |

## Doc Review Pipeline

Automated PR review for documentation changes.
See [.github/LABEL_GUIDE.md](.github/LABEL_GUIDE.md) for the label taxonomy.

| Resource | Path |
|----------|------|
| Label guide | [.github/LABEL_GUIDE.md](.github/LABEL_GUIDE.md) |
| Triage agent | [.claude/agents/doc-triage-agent.md](.claude/agents/doc-triage-agent.md) |
| Content review instructions | [.github/instructions/content-review.instructions.md](.github/instructions/content-review.instructions.md) |
| Review agent (local) | [.claude/agents/doc-review-agent.md](.claude/agents/doc-review-agent.md) |
| Auto-label workflow | [.github/workflows/auto-label.yml](.github/workflows/auto-label.yml) |
| Doc review workflow | [.github/workflows/doc-review.yml](.github/workflows/doc-review.yml) |

## Reference

| Document | Purpose |
|----------|---------|
| [DOCS-CONTRIBUTING.md](DOCS-CONTRIBUTING.md) | Style guidelines, commit format, contribution workflow |
| [DOCS-TESTING.md](DOCS-TESTING.md) | Code block testing, link validation, Vale linting |
| [DOCS-SHORTCODES.md](DOCS-SHORTCODES.md) | Complete shortcode reference |
| [DOCS-FRONTMATTER.md](DOCS-FRONTMATTER.md) | Complete frontmatter field reference |
| [api-docs/README.md](api-docs/README.md) | API documentation workflow |
| [content/example.md](content/example.md) | Live shortcode examples |
| [.github/copilot-instructions.md](.github/copilot-instructions.md) | CLI tools, repo structure, workflows |
| [.github/LABEL_GUIDE.md](.github/LABEL_GUIDE.md) | Label taxonomy and review pipeline |
