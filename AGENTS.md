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

## Constraints

- **NEVER cancel** Hugo builds (~75s) or test runs (15-45m) — the site has 5,359+ pages
- Set timeouts: Hugo 180s+, tests 30m+
- Use `python` not `py` for code block language identifiers (pytest won't collect `py` blocks)
- Shared content files (`content/shared/`) have no frontmatter — the consuming page provides it
- Product names and versions come from `data/products.yml` (single source of truth)

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
| Review agent | [.claude/agents/doc-review-agent.md](.claude/agents/doc-review-agent.md) |
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
