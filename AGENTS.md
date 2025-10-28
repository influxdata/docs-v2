# InfluxData Documentation (docs-v2)

> **For AI agents working with the InfluxData documentation repository**

## Project Overview

This repository powers [docs.influxdata.com](https://docs.influxdata.com), a Hugo-based static documentation site covering InfluxDB 3, InfluxDB v2/v1, Telegraf, and related products.

**Key Characteristics:**
- **Scale**: 5,359+ pages
- **Build time**: ~75 seconds (NEVER cancel Hugo builds)
- **Tech stack**: Hugo, Node.js, Docker, Vale, Pytest, Cypress
- **Test time**: 15-45 minutes for full code block tests

## Quick Commands

| Task | Command | Time |
|------|---------|------|
| Install dependencies | `CYPRESS_INSTALL_BINARY=0 yarn install` | ~4s |
| Build site | `npx hugo --quiet` | ~75s |
| Dev server | `npx hugo server` | ~92s |
| Test code blocks | `yarn test:codeblocks:all` | 15-45m |
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
├── api-docs/              # OpenAPI specifications
├── data/                  # YAML/JSON data files
├── public/                # Build output (gitignored, ~529MB)
└── .github/
    └── copilot-instructions.md  # Primary AI instructions
```

**Content Paths**: See [copilot-instructions.md](.github/copilot-instructions.md#content-organization)

## Common Workflows

### Editing a page in your browser

1. Navigate to the desired page on [docs.influxdata.com](https://docs.influxdata.com)
2. Click the "Edit this page" link at the bottom
3. Make changes in the GitHub web editor
4. Commit changes via a pull request

### Creating/Editing Content Manually

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
docker compose run -T vale content/**/*.md
```

**📖 Complete Reference**: [DOCS-TESTING.md](DOCS-TESTING.md)

### Committing Changes

**Commit Message Format**:
```
type(scope): description

Examples:
- fix(enterprise): correct Docker environment variable
- feat(influxdb3): add new plugin documentation
- docs(core): update configuration examples
```

**Types**: `fix`, `feat`, `style`, `refactor`, `test`, `chore`

**Scopes**: `enterprise`, `influxdb3`, `core`, `cloud`, `telegraf`, etc.

**Pre-commit hooks** run automatically (Vale, Prettier, tests). Skip with:
```bash
git commit -m "message" --no-verify
```

**📖 Complete Reference**: [DOCS-CONTRIBUTING.md](DOCS-CONTRIBUTING.md#commit-guidelines)

## Key Patterns

### Content Organization

- **Product versions**: Managed in `/data/products.yml`
- **Semantic line feeds**: One sentence per line for better diffs
- **Heading hierarchy**: Use h2-h6 only (h1 auto-generated from frontmatter)
- **Image naming**: `project/version-context-description.png`

### Code Examples

**Testable code blocks** (pytest):
```python
print("Hello, world!")
```

<!--pytest-codeblocks:expected-output-->

```
Hello, world!
```

**Language identifiers**: Use `python` not `py`, `bash` not `sh` (for pytest collection)

### API Documentation

- **Location**: `/api-docs/` directory
- **Format**: OpenAPI 3.0 YAML
- **Generation**: Uses Redoc + custom processing
- **📖 Workflow**: [api-docs/README.md](api-docs/README.md)

### JavaScript/TypeScript

- **Entry point**: `assets/js/main.js`
- **Pattern**: Component-based with `data-component` attributes
- **Debugging**: Source maps or debug helpers available
- **📖 Details**: [DOCS-CONTRIBUTING.md](DOCS-CONTRIBUTING.md#javascript-in-the-documentation-ui)

## Important Constraints

### Performance
- **NEVER cancel Hugo builds** - they take ~75s normally
- **NEVER cancel test runs** - code block tests take 15-45 minutes
- **Set timeouts**: Hugo (180s+), tests (30+ minutes)

### Style Guidelines
- Use Google Developer Documentation style
- Active voice, present tense, second person for instructions
- No emojis unless explicitly requested
- Use long options in CLI examples (`--option` vs `-o`)
- Format code blocks within 80 characters

### Network Restrictions
Some operations may fail in restricted environments:
- Docker builds requiring external repos
- `docker compose up local-dev` (Alpine packages)
- Cypress installation (use `CYPRESS_INSTALL_BINARY=0`)

## Documentation References

| Document | Purpose |
|----------|---------|
| [DOCS-CONTRIBUTING.md](DOCS-CONTRIBUTING.md) | Contribution workflow, style guidelines |
| [DOCS-TESTING.md](DOCS-TESTING.md) | Testing procedures (code blocks, links, linting) |
| [DOCS-SHORTCODES.md](DOCS-SHORTCODES.md) | Complete shortcode reference |
| [DOCS-FRONTMATTER.md](DOCS-FRONTMATTER.md) | Complete frontmatter field reference |
| [.github/copilot-instructions.md](.github/copilot-instructions.md) | Primary AI assistant instructions |
| [api-docs/README.md](api-docs/README.md) | API documentation workflow |
| [content/example.md](content/example.md) | Live shortcode examples for testing |

## Specialized Topics

### Working with Specific Products

| Product | Content Path | Special Notes |
|---------|-------------|---------------|
| InfluxDB 3 Core | `/content/influxdb3/core/` | Latest architecture |
| InfluxDB 3 Enterprise | `/content/influxdb3/enterprise/` | Core + licensed features, clustered |
| InfluxDB Cloud Dedicated | `/content/influxdb3/cloud-dedicated/`, `/content/influxdb3/cloud-serverless/` | Managed and distributed |
| InfluxDB Clustered | `/content/influxdb3/clustered/` | Self-managed and distributed |
| InfluxDB Cloud | `/content/influxdb/cloud/` | Legacy but active |
| InfluxDB v2 | `/content/influxdb/v2/` | Legacy but active |
| InfluxDB Enterprise v1 | `/content/enterprise_influxdb/v1/` | Legacy but active enterprise, clustered |

### Advanced Tasks

- **Vale configuration**: `.ci/vale/styles/` for custom rules
- **Link checking**: Uses custom `link-checker` binary
- **Docker testing**: `compose.yaml` defines test services
- **Lefthook**: Git hooks configuration in `lefthook.yml`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Pytest collected 0 items | Use `python` not `py` for code block language |
| Hugo build errors | Check `/config/_default/` configuration |
| Link validation slow | Test specific files: `yarn test:links content/file.md` |
| Vale errors | Check `.ci/vale/styles/config/vocabularies` |

## Critical Reminders

1. **Be a critical thinking partner** - Challenge assumptions, identify issues
2. **Test before committing** - Run relevant tests locally
3. **Reference, don't duplicate** - Link to detailed docs instead of copying
4. **Respect build times** - Don't cancel long-running operations
5. **Follow conventions** - Use established patterns for consistency

