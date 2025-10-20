# InfluxData Documentation Repository (docs-v2)

This is the primary instruction file for working with the InfluxData documentation site.
For detailed information on specific topics, refer to the specialized instruction files in `.github/instructions/`.

## Quick Reference

| Task | Command | Time | Details |
|------|---------|------|---------|
| Install | `CYPRESS_INSTALL_BINARY=0 yarn install` | ~4s | Skip Cypress for CI |
| Build | `npx hugo --quiet` | ~75s | NEVER CANCEL |
| Dev Server | `npx hugo server` | ~92s | Port 1313 |
| Test All | `yarn test:codeblocks:all` | 15-45m | NEVER CANCEL |
| Lint | `yarn lint` | ~1m | Pre-commit checks |

## Working Effectively

### Collaboration approach

Be a critical thinking partner, provide honest feedback, and identify potential issues.

### Setup Steps

1. Install dependencies (see Quick Reference table above)
2. Build the static site
3. Start development server at http://localhost:1313/
4. Alternative: Use `docker compose up local-dev` if local setup fails

### Testing

For comprehensive testing procedures, see **[DOCS-TESTING.md](../DOCS-TESTING.md)**.

**Quick reference** (NEVER CANCEL long-running tests):
- **Code blocks**: `yarn test:codeblocks:all` (15-45 minutes)
- **Links**: `yarn test:links` (1-5 minutes, requires link-checker binary)
- **Style**: `docker compose run -T vale content/**/*.md` (30-60 seconds)
- **Pre-commit**: `yarn lint` (or skip with `--no-verify`)

### Validation

Test these after changes:

```bash
# 1. Server renders pages (check 200 status)
curl -s -o /dev/null -w "%{http_code}" http://localhost:1313/influxdb3/core/

# 2. Build outputs exist (~529MB)
npx hugo --quiet && du -sh public/

# 3. Shortcodes work
yarn test:links content/example.md
```

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
- **Build output**: `/public/` (~529MB, gitignored)

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

- **Product versions**: `/data/products.yml`
- **Query languages**: SQL, InfluxQL, Flux (per product version)
- **Site**: https://docs.influxdata.com

### Writing Documentation

For detailed guidelines, see:
- **Workflow**: [DOCS-CONTRIBUTING.md](../DOCS-CONTRIBUTING.md) - Contribution guidelines and workflow
- **Shortcodes**: [DOCS-SHORTCODES.md](../DOCS-SHORTCODES.md) - Complete shortcode reference
  - **Examples**: [content/example.md](../content/example.md) - Working examples for testing
- **Frontmatter**: [DOCS-FRONTMATTER.md](../DOCS-FRONTMATTER.md) - Complete page metadata reference
- **Testing**: [DOCS-TESTING.md](../DOCS-TESTING.md) - Testing procedures
- **API Docs**: [api-docs/README.md](../api-docs/README.md) - API documentation workflow

### Code Examples

Use pytest annotations for testable examples:

```python
print("Hello, world!")
```

<!--pytest-codeblocks:expected-output-->

```
Hello, world!
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Pytest collected 0 items | Use `python` not `py` for language identifier |
| Hugo build errors | Check `/config/_default/` |
| Docker build fails | Expected in restricted networks - use local Hugo |
| Cypress install fails | Use `CYPRESS_INSTALL_BINARY=0 yarn install` |
| Link validation slow | Test specific files: `yarn test:links content/file.md` |
| Vale errors | Check `.ci/vale/styles/config/vocabularies` |

## Specialized Instructions

For detailed information on specific topics:

| Topic | File | Description |
|-------|------|-------------|
| **Content** | [content.instructions.md](instructions/content.instructions.md) | Lightweight pointer to frontmatter and shortcode references |
| **Layouts** | [layouts.instructions.md](instructions/layouts.instructions.md) | Shortcode implementation patterns and testing |
| **API Docs** | [api-docs.instructions.md](instructions/api-docs.instructions.md) | OpenAPI spec workflow |
| **Assets** | [assets.instructions.md](instructions/assets.instructions.md) | TypeScript/JavaScript and CSS development |
| **Testing** | [DOCS-TESTING.md](../DOCS-TESTING.md) | Comprehensive testing procedures |

## Important Notes

- This is a large site (5,359+ pages) with complex build processes
- **NEVER CANCEL** long-running operations (Hugo builds, tests)
- Set appropriate timeouts: Hugo build (180s+), tests (30+ minutes)
