# InfluxData Documentation Repository (docs-v2)

> **For GitHub Copilot and other AI coding agents**
>
> This is the primary instruction file for GitHub Copilot working with the InfluxData documentation site.
>
> **Instruction resources**:
>
> - [.github/agents/copilot-instructions-agent.md](agents/copilot-instructions-agent.md) - **Creating/improving Copilot instructions**
> - [.claude/skills/](../.claude/skills/) - **Detailed workflows** (content editing, testing, InfluxDB setup, templates)
> - [.github/instructions/](instructions/) - **Pattern-specific** (auto-loaded by file type)
> - [.github/agents/](agents/) - **Specialist agents** (TypeScript/Hugo, Copilot management)
> - [AGENTS.md](../AGENTS.md), [CLAUDE.md](../CLAUDE.md) - General AI assistant guides

## Quick Reference

| Task             | Command                                               | Time    | Details                               |
| ---------------- | ----------------------------------------------------- | ------- | ------------------------------------- |
| Install          | `CYPRESS_INSTALL_BINARY=0 yarn install`               | \~4s    | Skip Cypress for CI                   |
| Build            | `npx hugo --quiet`                                    | \~75s   | NEVER CANCEL                          |
| Dev Server       | `npx hugo server`                                     | \~92s   | Port 1313                             |
| Create Docs      | `docs create <draft> --products <keys>`               | varies  | AI-assisted scaffolding               |
| Create & Open    | `docs create <draft> --products <keys> --open`        | instant | Non-blocking (background)             |
| Create & Wait    | `docs create <draft> --products <keys> --open --wait` | varies  | Blocking (interactive)                |
| Edit Docs        | `docs edit <url>`                                     | instant | Non-blocking (background)             |
| Edit Docs (wait) | `docs edit <url> --wait`                              | varies  | Blocking (interactive)                |
| List Files       | `docs edit <url> --list`                              | instant | Show files without opening            |
| Add Placeholders | `docs placeholders <file>`                            | instant | Add placeholder syntax to code blocks |
| Audit Docs       | `docs audit --products <keys>`                        | varies  | Audit documentation coverage          |
| Release Notes    | `docs release-notes <v1> <v2> --products <keys>`      | varies  | Generate release notes from commits   |
| Test All         | `yarn test:codeblocks:all`                            | 15-45m  | NEVER CANCEL                          |
| Lint             | `yarn lint`                                           | \~1m    | Pre-commit checks                     |

## CLI Tools

**For when to use CLI vs direct editing**, see [docs-cli-workflow skill](../.claude/skills/docs-cli-workflow/SKILL.md).

```bash
# Create new documentation (AI-assisted scaffolding)
docs create <draft> --products <key-or-path>
docs create <draft> --products influxdb3_core --open        # Non-blocking
docs create <draft> --products influxdb3_core --open --wait # Blocking

# Find and edit documentation by URL
docs edit <url>               # Non-blocking (agent-friendly)
docs edit <url> --list        # List files only
docs edit <url> --wait        # Wait for editor

# Other tools
docs placeholders <file>      # Add placeholder syntax to code blocks
docs audit --products <keys>  # Audit documentation coverage
docs release-notes <v1> <v2> --products <keys>

# Get help
docs --help
docs create --help
```

**Key points**:

- Accepts both product keys (`influxdb3_core`) and paths (`/influxdb3/core`)
- Non-blocking by default (agent-friendly)
- Use `--wait` for interactive editing
- `--products` and `--repos` are mutually exclusive for audit/release-notes

## Workflows

### Content Editing

See [content-editing skill](../.claude/skills/content-editing/SKILL.md) for complete workflow:

- Creating/editing content with CLI
- Shared content management
- Testing and validation

### Testing

See [DOCS-TESTING.md](../DOCS-TESTING.md) and [cypress-e2e-testing skill](../.claude/skills/cypress-e2e-testing/SKILL.md).

Quick tests (NEVER CANCEL long-running):

```bash
yarn test:codeblocks:all  # 15-45m
yarn test:links           # 1-5m
yarn lint                 # 1m
```

### InfluxDB 3 Setup

See [influxdb3-test-setup skill](../.claude/skills/influxdb3-test-setup/SKILL.md).

Quick setup:

```bash
./test/scripts/init-influxdb3.sh core        # Per-worktree, port 8282
./test/scripts/init-influxdb3.sh enterprise  # Shared, port 8181
./test/scripts/init-influxdb3.sh all         # Both
```

### Hugo Template Development

See [hugo-template-dev skill](../.claude/skills/hugo-template-dev/SKILL.md) for template syntax, data access, and testing strategies.

## Repository Structure

### Content Organization

- **InfluxDB 3**: `/content/influxdb3/` (core, enterprise, cloud-dedicated, cloud-serverless, clustered, explorer)
- **InfluxDB v2**: `/content/influxdb/` (v2, cloud)
- **InfluxDB v1**: `/content/influxdb/v1`
- **InfluxDB Enterprise (v1)**: `/content/enterprise_influxdb/v1/`
- **Telegraf**: `/content/telegraf/v1/`
- **Kapacitor**: `/content/kapacitor/`
- **Chronograf**: `/content/chronograf/`
- **Flux**: `/content/flux/`
- **Examples**: `/content/example.md` (comprehensive shortcode reference)
- **Shared content**: `/content/shared/`

### Key Files

- **Config**: `/config/_default/`, `package.json`, `compose.yaml`, `lefthook.yml`
- **Testing**: `cypress.config.js`, `pytest.ini`, `.vale.ini`
- **Assets**: `/assets/` (JS, CSS), `/layouts/` (templates), `/data/` (YAML/JSON)
- **Build output**: `/public/` (\~529MB, gitignored)

## Technology Stack

- **Hugo** - Static site generator
- **Node.js/Yarn** - Package management
- **Testing**: Pytest, Cypress, link-checker, Vale
- **Tools**: Docker, ESLint, Prettier, Lefthook

## Common Issues

### Network Restrictions

Commands that may fail in restricted environments:

- Docker builds (external repos)
- `docker compose up local-dev` (Alpine packages)
- Cypress installation (use `CYPRESS_INSTALL_BINARY=0`)

### Pre-commit Validation

```bash
# Quick validation before commits
yarn prettier --write "**/*.{css,js,ts,jsx,tsx}"
yarn eslint assets/js/**/*.js
npx hugo --quiet
```

## Documentation Coverage

- **InfluxDB 3**: Core, Enterprise, Cloud (Dedicated/Serverless), Clustered, Explorer, plugins
- **InfluxDB v2/v1**: OSS, Cloud, Enterprise
- **Tools**: Telegraf, Kapacitor, Chronograf, Flux
- **API Reference**: All InfluxDB editions

## Content Guidelines

**Style guide**: Google Developer Documentation Style Guide\
**Voice**: Active, present tense, second person\
**Line breaks**: Semantic line feeds (one sentence per line)\
**Files**: lowercase-with-hyphens.md

### Quick Shortcodes

````markdown
# Callouts (GitHub-style alerts)
> [!Note] / [!Warning] / [!Tip] / [!Important] / [!Caution]

# Required elements
{{< req >}}
{{< req type="key" >}}

# Code placeholders
```sh { placeholders="DATABASE_NAME|API_TOKEN" }
curl https://example.com/api?db=DATABASE_NAME
````

````

**Complete reference**: [DOCS-SHORTCODES.md](../DOCS-SHORTCODES.md)

### Required Frontmatter

```yaml
title:       # Required
description: # Required
menu:
  product_menu_key:
    name:    # Optional
    parent:  # Optional
weight:      # Required: 1-99, 101-199, 201-299...
````

**Shared content**: Add `source: /shared/path/to/file.md`

**Complete reference**: [DOCS-FRONTMATTER.md](../DOCS-FRONTMATTER.md)

### Resources

- [DOCS-CONTRIBUTING.md](../DOCS-CONTRIBUTING.md) - Workflow & guidelines
- [DOCS-SHORTCODES.md](../DOCS-SHORTCODES.md) - Complete shortcodes
- [DOCS-FRONTMATTER.md](../DOCS-FRONTMATTER.md) - Complete metadata
- [DOCS-TESTING.md](../DOCS-TESTING.md) - Testing procedures
- [content/example.md](../content/example.md) - Working examples

## Troubleshooting

| Issue                    | Solution                                                         |
| ------------------------ | ---------------------------------------------------------------- |
| Pytest collected 0 items | Use `python` not `py` for language identifier                    |
| Hugo build errors        | Check `/config/_default/`                                        |
| Docker build fails       | Expected in restricted networks - use local Hugo                 |
| Cypress install fails    | Use `CYPRESS_INSTALL_BINARY=0 yarn install`                      |
| Link validation slow     | Test specific files: `yarn test:links content/file.md`           |
| Vale "0 errors in stdin" | File is outside repo - Vale Docker can only access repo files    |
| Vale false positives     | Add terms to `.ci/vale/styles/InfluxDataDocs/Terms/ignore.txt`   |
| Vale duration warnings   | Duration literals (`30d`) are valid - check InfluxDataDocs.Units |

## Specialized Instructions

### File Pattern-Specific Instructions

These instructions are automatically loaded by GitHub Copilot based on the files you're working with:

| Pattern                  | File                                                              | Description                                      |
| ------------------------ | ----------------------------------------------------------------- | ------------------------------------------------ |
| `content/**/*.md`        | [content.instructions.md](instructions/content.instructions.md)   | Content file guidelines, frontmatter, shortcodes |
| `layouts/**/*.html`      | [layouts.instructions.md](instructions/layouts.instructions.md)   | Shortcode implementation patterns and testing    |
| `api-docs/**/*.yml`      | [api-docs.instructions.md](instructions/api-docs.instructions.md) | OpenAPI spec workflow                            |
| `assets/js/**/*.{js,ts}` | [assets.instructions.md](instructions/assets.instructions.md)     | TypeScript/JavaScript and CSS development        |

### Specialized Resources

**Custom Agents** (`.github/agents/`):

- [typescript-hugo-agent.md](agents/typescript-hugo-agent.md) - TypeScript/Hugo development
- [copilot-instructions-agent.md](agents/copilot-instructions-agent.md) - Managing Copilot instructions

**Claude Skills** (`.claude/skills/` - detailed workflows):

- [content-editing](../.claude/skills/content-editing/SKILL.md) - Complete content workflow
- [docs-cli-workflow](../.claude/skills/docs-cli-workflow/SKILL.md) - CLI decision guidance
- [cypress-e2e-testing](../.claude/skills/cypress-e2e-testing/SKILL.md) - E2E testing
- [hugo-template-dev](../.claude/skills/hugo-template-dev/SKILL.md) - Hugo templates
- [influxdb3-test-setup](../.claude/skills/influxdb3-test-setup/SKILL.md) - InfluxDB 3 setup
- [vale-linting](../.claude/skills/vale-linting/SKILL.md) - Vale configuration and debugging

**Documentation**:

- [DOCS-TESTING.md](../DOCS-TESTING.md) - Testing procedures
- [DOCS-CONTRIBUTING.md](../DOCS-CONTRIBUTING.md) - Contribution guidelines
- [DOCS-FRONTMATTER.md](../DOCS-FRONTMATTER.md) - Frontmatter reference
- [DOCS-SHORTCODES.md](../DOCS-SHORTCODES.md) - Shortcodes reference

## Important Notes

- This is a large site (5,359+ pages) with complex build processes
- **NEVER CANCEL** long-running operations (Hugo builds, tests)
- Set appropriate timeouts: Hugo build (180s+), tests (30+ minutes)
