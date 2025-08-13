# InfluxData Documentation Repository (docs-v2)

Always follow these instructions first and fallback to additional search and context gathering only when the information provided here is incomplete or found to be in error.

## Working Effectively

### Bootstrap, Build, and Test the Repository

Execute these commands in order to set up a complete working environment:

1. **Install Node.js dependencies** (takes ~4 seconds):

   ```bash
   # Skip Cypress binary download due to network restrictions in CI environments
   CYPRESS_INSTALL_BINARY=0 yarn install
   ```

2. **Build the static site** (takes ~75 seconds, NEVER CANCEL - set timeout to 180+ seconds):

   ```bash
   npx hugo --quiet
   ```

3. **Start the development server** (builds in ~92 seconds, NEVER CANCEL - set timeout to 150+ seconds):

   ```bash
   npx hugo server --bind 0.0.0.0 --port 1313
   ```

   - Access at: http://localhost:1313/
   - Serves 5,359+ pages and 441 static files
   - Auto-rebuilds on file changes

4. **Alternative Docker development setup** (use if local Hugo fails):
   ```bash
   docker compose up local-dev
   ```
   **Note**: May fail in restricted network environments due to Alpine package manager issues.

### Testing (CRITICAL: NEVER CANCEL long-running tests)

#### Code Block Testing (takes 5-15 minutes per product, NEVER CANCEL - set timeout to 30+ minutes):

```bash
# Build test environment first (takes ~30 seconds, may fail due to network restrictions)
docker build -t influxdata/docs-pytest:latest -f Dockerfile.pytest .

# Test all products (takes 15-45 minutes total)
yarn test:codeblocks:all

# Test specific products
yarn test:codeblocks:cloud
yarn test:codeblocks:v2
yarn test:codeblocks:telegraf
```

#### Link Validation (takes 10-30 minutes, NEVER CANCEL - set timeout to 45+ minutes):

```bash
# Test all links (very long-running)
yarn test:links

# Test specific files/products (faster)
yarn test:links content/influxdb3/core/**/*.md
yarn test:links:v3
yarn test:links:v2
```

#### Style Linting (takes 30-60 seconds):

```bash
# Basic Vale linting
docker compose run -T vale content/**/*.md

# Product-specific linting with custom configurations
docker compose run -T vale --config=content/influxdb3/cloud-dedicated/.vale.ini --minAlertLevel=error content/influxdb3/cloud-dedicated/**/*.md
```

#### JavaScript and CSS Linting (takes 5-10 seconds):

```bash
yarn eslint assets/js/**/*.js
yarn prettier --check "**/*.{css,js,ts,jsx,tsx}"
```

### Pre-commit Hooks (automatically run, can be skipped if needed):

```bash
# Run all pre-commit checks manually
yarn lint

# Skip pre-commit hooks if necessary (not recommended)
git commit -m "message" --no-verify
```

## Validation Scenarios

Always test these scenarios after making changes to ensure full functionality:

### 1. Documentation Rendering Test

```bash
# Start Hugo server
npx hugo server --bind 0.0.0.0 --port 1313

# Verify key pages load correctly (200 status)
curl -s -o /dev/null -w "%{http_code}" http://localhost:1313/influxdb3/core/
curl -s -o /dev/null -w "%{http_code}" http://localhost:1313/influxdb/v2/
curl -s -o /dev/null -w "%{http_code}" http://localhost:1313/telegraf/v1/

# Verify content contains expected elements
curl -s http://localhost:1313/influxdb3/core/ | grep -i "influxdb"
```

### 2. Build Output Validation

```bash
# Verify build completes successfully
npx hugo --quiet

# Check build output exists and has reasonable size (~529MB)
ls -la public/
du -sh public/

# Verify key files exist
file public/index.html
file public/influxdb3/core/index.html
```

### 3. Shortcode and Formatting Test

```bash
# Test shortcode examples page
yarn test:links content/example.md
```

## Repository Structure and Key Locations

### Content Organization

- **InfluxDB 3**: `/content/influxdb3/` (core, enterprise, cloud-dedicated, cloud-serverless, clustered, explorer)
- **InfluxDB v2**: `/content/influxdb/` (v2, cloud, enterprise_influxdb, v1)
- **Telegraf**: `/content/telegraf/v1/`
- **Other tools**: `/content/kapacitor/`, `/content/chronograf/`, `/content/flux/`
- **Shared content**: `/content/shared/`
- **Examples**: `/content/example.md` (comprehensive shortcode reference)

### Configuration Files

- **Hugo config**: `/config/_default/`
- **Package management**: `package.json`, `yarn.lock`
- **Docker**: `compose.yaml`, `Dockerfile.pytest`
- **Git hooks**: `lefthook.yml`
- **Testing**: `cypress.config.js`, `pytest.ini` (in test directories)
- **Linting**: `.vale.ini`, `.prettierrc.yaml`, `eslint.config.js`

### Build and Development

- **Hugo binary**: Available via `npx hugo` (version 0.148.2+)
- **Static assets**: `/assets/` (JavaScript, CSS, images)
- **Build output**: `/public/` (generated, ~529MB)
- **Layouts**: `/layouts/` (Hugo templates)
- **Data files**: `/data/` (YAML/JSON data for templates)

## Technology Stack

- **Static Site Generator**: Hugo (0.148.2+ extended)
- **Package Manager**: Yarn (1.22.22+) with Node.js (20.19.4+)
- **Testing Framework**:
  - Pytest with pytest-codeblocks (for code examples)
  - Cypress (for link validation and E2E tests)
  - Vale (for style and writing guidelines)
- **Containerization**: Docker with Docker Compose
- **Linting**: ESLint, Prettier, Vale
- **Git Hooks**: Lefthook

## Common Tasks and Build Times

### Time Expectations (CRITICAL - NEVER CANCEL)

- **Dependency installation**: 4 seconds
- **Hugo static build**: 75 seconds (NEVER CANCEL - timeout: 180+ seconds)
- **Hugo server startup**: 92 seconds (NEVER CANCEL - timeout: 150+ seconds)
- **Code block tests**: 5-15 minutes per product (NEVER CANCEL - timeout: 30+ minutes)
- **Link validation**: 10-30 minutes (NEVER CANCEL - timeout: 45+ minutes)
- **Style linting**: 30-60 seconds
- **Docker image build**: 30+ seconds (may fail due to network restrictions)

### Network Connectivity Issues

In restricted environments, these commands may fail due to external dependency downloads:

- `docker build -t influxdata/docs-pytest:latest -f Dockerfile.pytest .` (InfluxData repositories, HashiCorp repos)
- `docker compose up local-dev` (Alpine package manager)
- Cypress binary installation (use `CYPRESS_INSTALL_BINARY=0`)

Document these limitations but proceed with available functionality.

### Validation Commands for CI

Always run these before committing changes:

```bash
# Format and lint code
yarn prettier --write "**/*.{css,js,ts,jsx,tsx}"
yarn eslint assets/js/**/*.js

# Test Hugo build
npx hugo --quiet

# Test development server startup
timeout 150 npx hugo server --bind 0.0.0.0 --port 1313 &
sleep 120
curl -s -o /dev/null -w "%{http_code}" http://localhost:1313/
pkill hugo
```

## Key Projects in This Codebase

1. **InfluxDB 3 Documentation** (Core, Enterprise, Cloud variants)
2. **InfluxDB v2 Documentation** (OSS and Cloud)
3. **Telegraf Documentation** (agent and plugins)
4. **Supporting Tools Documentation** (Kapacitor, Chronograf, Flux)
5. **API Reference Documentation** (`/api-docs/`)
6. **Shared Documentation Components** (`/content/shared/`)

## Important Locations for Frequent Tasks

- **Shortcode reference**: `/content/example.md`
- **Contributing guide**: `CONTRIBUTING.md`
- **Testing guide**: `TESTING.md`
- **Product configurations**: `/data/products.yml`
- **Vale style rules**: `/.ci/vale/styles/`
- **GitHub workflows**: `/.github/workflows/`
- **Test scripts**: `/test/scripts/`
- **Hugo layouts**: `/layouts/`
- **CSS/JS assets**: `/assets/`

## Content Guidelines and Style

### Documentation Structure

- **Product version data**: `/data/products.yml`
- **Query Languages**: SQL, InfluxQL, Flux (use appropriate language per product version)
- **Documentation Site**: https://docs.influxdata.com
- **Framework**: Hugo static site generator

### Style Guidelines

- Follow Google Developer Documentation style guidelines
- Use semantic line feeds (one sentence per line)
- Format code examples to fit within 80 characters
- Use long options in command line examples (`--option` instead of `-o`)
- Use GitHub callout syntax for notes and warnings
- Image naming: `project/version-context-description.png`

### Markdown and Shortcodes

Include proper frontmatter for all content pages:

```yaml
title: # Page title (h1)
seotitle: # SEO title
description: # SEO description
menu:
  product_version:
weight: # Page order (1-99, 101-199, etc.)
```

Key shortcodes (see `/content/example.md` for full reference):

- Notes/warnings: `{{% note %}}`, `{{% warn %}}`
- Tabbed content: `{{< tabs-wrapper >}}`, `{{% tabs %}}`, `{{% tab-content %}}`
- Code examples: `{{< code-tabs-wrapper >}}`, `{{% code-tabs %}}`, `{{% code-tab-content %}}`
- Required elements: `{{< req >}}`
- API endpoints: `{{< api-endpoint >}}`

### Code Examples and Testing

Provide complete, working examples with pytest annotations:

```python
print("Hello, world!")
```

<!--pytest-codeblocks:expected-output-->

```
Hello, world!
```

## Troubleshooting Common Issues

1. **"Pytest collected 0 items"**: Use `python` (not `py`) for code block language identifiers
2. **Hugo build errors**: Check `/config/_default/` for configuration issues
3. **Docker build failures**: Expected in restricted networks - document and continue with local Hugo
4. **Cypress installation failures**: Use `CYPRESS_INSTALL_BINARY=0 yarn install`
5. **Link validation slow**: Use file-specific testing: `yarn test:links content/specific-file.md`
6. **Vale linting errors**: Check `.ci/vale/styles/config/vocabularies` for accepted/rejected terms

## Additional Instruction Files

For specific workflows and content types, also refer to:

- **InfluxDB 3 code placeholders**: `.github/instructions/influxdb3-code-placeholders.instructions.md`
- **Contributing guidelines**: `.github/instructions/contributing.instructions.md`
- **Content-specific instructions**: Check `.github/instructions/` directory

Remember: This is a large documentation site with complex build processes. Patience with build times is essential, and NEVER CANCEL long-running operations.
