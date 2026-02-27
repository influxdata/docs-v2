# Testing Guide for InfluxData Documentation

This guide covers all testing procedures for the InfluxData documentation, including code block testing, link validation, and style linting.

## Quick Start

1. **Prerequisites**: Install [Node.js](https://nodejs.org/en), [Yarn](https://yarnpkg.com/getting-started/install), and [Docker](https://docs.docker.com/get-docker/)
2. **Install dependencies**: Run `yarn` to install all dependencies
3. **Build test environment**: Run `docker build -t influxdata/docs-pytest:latest -f Dockerfile.pytest .`
4. **Run tests**: Use any of the test commands below

## Test Types Overview

| Test Type               | Purpose                             | Command                      |
| ----------------------- | ----------------------------------- | ---------------------------- |
| **Code blocks**         | Validate shell/Python code examples | `yarn test:codeblocks:all`   |
| **Link validation**     | Check internal/external links       | `yarn test:links`            |
| **Style linting**       | Enforce writing standards           | `.ci/vale/vale.sh`           |
| **Markdown generation** | Generate LLM-friendly Markdown      | `yarn build:md`              |
| **E2E tests**           | UI and functionality testing        | `yarn test:e2e`              |

## Code Block Testing

Code block testing validates that shell commands and Python scripts in documentation work correctly using [pytest-codeblocks](https://github.com/nschloe/pytest-codeblocks/tree/main).

### Basic Usage

```bash
# Test all code blocks
yarn test:codeblocks:all

# Test specific products
yarn test:codeblocks:cloud
yarn test:codeblocks:v2
yarn test:codeblocks:telegraf
```

### Setup and Configuration

#### 1. Set executable permissions on test scripts

```sh
chmod +x ./test/src/*.sh
```

#### 2. Create test credentials

Create databases, buckets, and tokens for the product(s) you're testing.
If you don't have access to a Clustered instance, you can use your Cloud Dedicated instance for testing in most cases.

#### 3. Configure environment variables

Copy the `./test/env.test.example` file into each product directory and rename as `.env.test`:

```sh
# Example locations
./content/influxdb/cloud-dedicated/.env.test
./content/influxdb3/clustered/.env.test
```

Inside each product's `.env.test` file, assign your InfluxDB credentials:

- Include the usual `INFLUX_` environment variables
- For `cloud-dedicated/.env.test` and `clustered/.env.test`, also define:
  - `ACCOUNT_ID`, `CLUSTER_ID`: Found in your `influxctl config.toml`
  - `MANAGEMENT_TOKEN`: Generate with `influxctl management create`

See `./test/src/prepare-content.sh` for the full list of variables you may need.

#### 4. Configure influxctl commands

For influxctl commands to run in tests, move or copy your `config.toml` file to the `./test` directory.

> \[!Warning]
>
> - The database you configure in `.env.test` and any written data may be deleted during test runs
> - Don't add your `.env.test` files to Git. Git is configured to ignore `.env*` files to prevent accidentally committing credentials

### Writing Testable Code Blocks

#### Basic Example

```python
print("Hello, world!")
```

<!--pytest-codeblocks:expected-output-->

```
Hello, world!
```

#### Interactive Commands

For commands that require TTY interaction (like `influxctl` authentication), wrap the command in a subshell and redirect output:

```sh
# Test the preceding command outside of the code block.
# influxctl authentication requires TTY interaction--
# output the auth URL to a file that the host can open.
script -c "influxctl user list " \
 /dev/null > /shared/urls.txt
```

To hide test blocks from users, wrap them in HTML comments. pytest-codeblocks will still collect and run them.

#### Skipping Tests

pytest-codeblocks has features for skipping tests and marking blocks as failed. See the [pytest-codeblocks README](https://github.com/nschloe/pytest-codeblocks/tree/main) for details.

### Troubleshooting

#### "Pytest collected 0 items"

Potential causes:

- Check test discovery options in `pytest.ini`
- Use `python` (not `py`) for Python code block language identifiers:
  ```python
  # This works
  ```
  vs
  ```py
  # This is ignored
  ```

## LLM-Friendly Markdown Generation

The documentation includes tooling to generate LLM-friendly Markdown versions of documentation pages, both locally via CLI and on-demand via Lambda\@Edge in production.

### Quick Start

```bash
# Prerequisites (run once)
yarn install
yarn build:ts
npx hugo --quiet

# Generate Markdown
node scripts/html-to-markdown.js --path influxdb3/core/get-started --limit 10

# Validate generated Markdown
node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/content/markdown-content-validation.cy.js"
```

### Comprehensive Documentation

For complete documentation including prerequisites, usage examples, output formats, frontmatter structure, troubleshooting, and architecture details, see the inline documentation:

```bash
# Or view the first 150 lines in terminal
head -150 scripts/html-to-markdown.js
```

The script documentation includes:

- Prerequisites and setup steps
- Command-line options and examples
- Output file types (single page vs section aggregation)
- Frontmatter structure for both output types
- Testing procedures
- Common issues and solutions
- Architecture overview
- Related files

### Related Files

- **CLI tool**: `scripts/html-to-markdown.js` - Comprehensive inline documentation
- **Core logic**: `scripts/lib/markdown-converter.js` - Shared conversion library
- **Lambda handler**: `deploy/llm-markdown/lambda-edge/markdown-generator/index.js` - Production deployment
- **Lambda docs**: `deploy/llm-markdown/README.md` - Deployment guide
- **Cypress tests**: `cypress/e2e/content/markdown-content-validation.cy.js` - Validation tests

### Frontmatter Structure

All generated markdown files include structured YAML frontmatter:

```yaml
---
title: Page Title
description: Page description for SEO
url: /influxdb3/core/get-started/
product: InfluxDB 3 Core
version: core
date: 2024-01-15T00:00:00Z
lastmod: 2024-11-20T00:00:00Z
type: page
estimated_tokens: 2500
---
```

Section pages include additional fields:

```yaml
---
type: section
pages: 4
child_pages:
  - title: Set up InfluxDB 3 Core
    url: /influxdb3/core/get-started/setup/
  - title: Write data
    url: /influxdb3/core/get-started/write/
---
```

### Testing Generated Markdown

#### Manual Testing

```bash
# Generate markdown with verbose output
node scripts/html-to-markdown.js --path influxdb3/core/get-started --limit 2 --verbose

# Check files were created
ls -la public/influxdb3/core/get-started/*.md

# View generated content
cat public/influxdb3/core/get-started/index.md

# Check frontmatter
head -20 public/influxdb3/core/get-started/index.md
```

#### Automated Testing with Cypress

The repository includes comprehensive Cypress tests for markdown validation:

```bash
# Run all markdown validation tests
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/markdown-content-validation.cy.js"

# Test specific content file
node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/content/markdown-content-validation.cy.js" \
  content/influxdb3/core/query-data/execute-queries/_index.md
```

The Cypress tests validate:

- ✅ No raw Hugo shortcodes (`{{< >}}` or `{{% %}}`)
- ✅ No HTML comments
- ✅ Proper YAML frontmatter with required fields
- ✅ UI elements removed (feedback forms, navigation)
- ✅ GitHub-style callouts (Note, Warning, etc.)
- ✅ Properly formatted tables, lists, and code blocks
- ✅ Product context metadata
- ✅ Clean link formatting

### Common Issues and Solutions

#### Issue: "No article content found" warnings

**Cause**: Page doesn't have `<article class="article--content">` element (common for index/list pages)

**Solution**: This is normal behavior. The converter skips pages without article content. To verify:

```bash
# Check HTML structure
grep -l 'article--content' public/path/to/page/index.html
```

#### Issue: "Cannot find module" errors

**Cause**: TypeScript not compiled (product-mappings.js missing)

**Solution**: Build TypeScript first:

```bash
yarn build:ts
ls -la dist/utils/product-mappings.js
```

#### Issue: Memory issues when processing all files

**Cause**: Attempting to process thousands of pages at once

**Solution**: Use `--limit` flag to process in batches:

```bash
# Process 1000 files at a time
node scripts/html-to-markdown.js --limit 1000
```

#### Issue: Missing or incorrect product detection

**Cause**: Product mappings not up to date or path doesn't match known patterns

**Solution**:

1. Rebuild TypeScript: `yarn build:ts`
2. Check product mappings in `assets/js/utils/product-mappings.ts`
3. Add new product paths if needed

### Validation Checklist

Before committing markdown generation changes:

- [ ] Run TypeScript build: `yarn build:ts`
- [ ] Build Hugo site: `npx hugo --quiet`
- [ ] Generate markdown for affected paths
- [ ] Run Cypress validation tests
- [ ] Manually check sample output files:
  - [ ] Frontmatter is valid YAML
  - [ ] No shortcode remnants (`{{<`, `{{%`)
  - [ ] No HTML comments (`<!--`, `-->`)
  - [ ] Product context is correct
  - [ ] Links are properly formatted
  - [ ] Code blocks have language identifiers
  - [ ] Tables render correctly

### Architecture

The markdown generation uses a shared library architecture:

```
docs-v2/
├── scripts/
│   ├── html-to-markdown.js          # CLI wrapper (filesystem operations)
│   └── lib/
│       └── markdown-converter.js    # Core conversion logic (shared library)
├── dist/
│   └── utils/
│       └── product-mappings.js      # Product detection (compiled from TS)
└── public/                          # Generated HTML + Markdown files
```

The shared library (`scripts/lib/markdown-converter.js`) is:

- Used by local markdown generation scripts
- Imported by docs-tooling Lambda\@Edge for on-demand generation
- Tested independently with isolated conversion logic

For deployment details, see [deploy/lambda-edge/markdown-generator/README.md](deploy/lambda-edge/markdown-generator/README.md).

## Link Validation with Link-Checker

Link validation uses the `link-checker` tool to validate internal and external links in documentation files.

### Basic Usage

#### Installation

**Option 1: Build from source (macOS/local development)**

For local development on macOS, build the link-checker from source:

```bash
# Clone and build link-checker
git clone https://github.com/influxdata/docs-tooling.git
cd docs-tooling/link-checker
cargo build --release

# Copy binary to your PATH or use directly
cp target/release/link-checker /usr/local/bin/
# OR use directly: ./target/release/link-checker
```

**Option 2: Download pre-built binary (GitHub Actions/Linux)**

The link-checker binary is distributed via docs-v2 releases for reliable access from GitHub Actions workflows:

```bash
# Download Linux binary from docs-v2 releases
curl -L -o link-checker \
  https://github.com/influxdata/docs-v2/releases/download/link-checker-v1.0.0/link-checker-linux-x86_64
chmod +x link-checker

# Verify installation
./link-checker --version
```

> \[!Note]
> Pre-built binaries are currently Linux x86\_64 only. For macOS development, use Option 1 to build from source.

```bash
# Clone and build link-checker
git clone https://github.com/influxdata/docs-tooling.git
cd docs-tooling/link-checker
cargo build --release

# Copy binary to your PATH or use directly
cp target/release/link-checker /usr/local/bin/
```

#### Binary Release Process

**For maintainers:** To create a new link-checker release in docs-v2:

1. **Create release in docs-tooling** (builds and releases binary automatically):
   ```bash
   cd docs-tooling
   git tag link-checker-v1.2.x
   git push origin link-checker-v1.2.x
   ```

2. **Manually distribute to docs-v2** (required due to private repository access):
   ```bash
   # Download binary from docs-tooling release
   curl -L -H "Authorization: Bearer $(gh auth token)" \
     -o link-checker-linux-x86_64 \
     "https://github.com/influxdata/docs-tooling/releases/download/link-checker-v1.2.x/link-checker-linux-x86_64"

   curl -L -H "Authorization: Bearer $(gh auth token)" \
     -o checksums.txt \
     "https://github.com/influxdata/docs-tooling/releases/download/link-checker-v1.2.x/checksums.txt"

   # Create docs-v2 release
   gh release create \
     --repo influxdata/docs-v2 \
     --title "Link Checker Binary v1.2.x" \
     --notes "Link validation tooling binary for docs-v2 GitHub Actions workflows." \
     link-checker-v1.2.x \
     link-checker-linux-x86_64 \
     checksums.txt
   ```

3. **Update workflow reference** (if needed):
   ```bash
   # Update .github/workflows/pr-link-check.yml line 98 to use new version
   sed -i 's/link-checker-v[0-9.]*/link-checker-v1.2.x/' .github/workflows/pr-link-check.yml
   ```

> \[!Note]
> The manual distribution is required because docs-tooling is a private repository and the default GitHub token doesn't have cross-repository access for private repos.

#### Core Commands

```bash
# Map content files to public HTML files
link-checker map content/path/to/file.md

# Check links in HTML files
link-checker check public/path/to/file.html

# Generate configuration file
link-checker config
```

### Link Resolution Behavior

The link-checker automatically handles relative link resolution based on the input type:

**Local Files → Local Resolution**

```bash
# When checking local files, relative links resolve to the local filesystem
link-checker check public/influxdb3/core/admin/scale-cluster/index.html
# Relative link /influxdb3/clustered/tags/kubernetes/ becomes:
# → /path/to/public/influxdb3/clustered/tags/kubernetes/index.html
```

**URLs → Production Resolution**

```bash
# When checking URLs, relative links resolve to the production site
link-checker check https://docs.influxdata.com/influxdb3/core/admin/scale-cluster/
# Relative link /influxdb3/clustered/tags/kubernetes/ becomes:
# → https://docs.influxdata.com/influxdb3/clustered/tags/kubernetes/
```

**Why This Matters**

- **Testing new content**: Tag pages generated locally will be found when testing local files
- **Production validation**: Production URLs validate against the live site
- **No false positives**: New content won't appear broken when testing locally before deployment

### Content Mapping Workflows

#### Scenario 1: Map and check InfluxDB 3 Core content

```bash
# Map Markdown files to HTML
link-checker map content/influxdb3/core/get-started/

# Check links in mapped HTML files
link-checker check public/influxdb3/core/get-started/
```

#### Scenario 2: Map and check shared CLI content

```bash
# Map shared content files
link-checker map content/shared/influxdb3-cli/

# Check the mapped output files
# (link-checker map outputs the HTML file paths)
link-checker map content/shared/influxdb3-cli/ | \
  xargs link-checker check
```

#### Scenario 3: Direct HTML checking

```bash
# Check HTML files directly without mapping
link-checker check public/influxdb3/core/get-started/
```

#### Combined workflow for changed files

```bash
# Check only files changed in the last commit
git diff --name-only HEAD~1 HEAD | grep '\.md$' | \
  xargs link-checker map | \
  xargs link-checker check
```

### Configuration Options

#### Local usage (default configuration)

```bash
# Uses default settings or test.lycherc.toml if present
link-checker check public/influxdb3/core/get-started/
```

#### Production usage (GitHub Actions)

```bash
# Use production configuration with comprehensive exclusions
link-checker check \
  --config .ci/link-checker/production.lycherc.toml \
  public/influxdb3/core/get-started/
```

### GitHub Actions Integration

**Automated Integration (docs-v2)**

The docs-v2 repository includes automated link checking for pull requests:

- **Trigger**: Runs automatically on PRs that modify content files
- **Binary distribution**: Downloads latest pre-built binary from docs-v2 releases
- **Smart detection**: Only checks files affected by PR changes
- **Production config**: Uses optimized settings with exclusions for GitHub, social media, etc.
- **Results reporting**: Broken links reported as GitHub annotations with detailed summaries

The workflow automatically:

1. Detects content changes in PRs using GitHub Files API
2. Downloads latest link-checker binary from docs-v2 releases
3. Builds Hugo site and maps changed content to public HTML files
4. Runs link checking with production configuration
5. Reports results with annotations and step summaries

**Manual Integration (other repositories)**

For other repositories, you can integrate link checking manually:

```yaml
name: Link Check
on:
  pull_request:
    paths:
      - 'content/**/*.md'

jobs:
  link-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Download link-checker
        run: |
          curl -L -o link-checker \
            https://github.com/influxdata/docs-tooling/releases/latest/download/link-checker-linux-x86_64
          chmod +x link-checker
          cp target/release/link-checker ../../link-checker
          cd ../..
          
      - name: Build Hugo site
        run: |
          npm install
          npx hugo --minify
          
      - name: Check changed files
        run: |
          git diff --name-only origin/main HEAD | \
            grep '\.md$' | \
            xargs ./link-checker map | \
            xargs ./link-checker check \
              --config .ci/link-checker/production.lycherc.toml
```

## Style Linting (Vale)

Style linting uses [Vale](https://vale.sh/) to enforce documentation writing standards, branding guidelines, and vocabulary consistency.

### Setup

1. **Install Vale locally (recommended):** `brew install vale` (or see [Vale installation guide](https://vale.sh/docs/install/))
2. **Or use Docker:** The `.ci/vale/vale.sh` wrapper falls back to a pinned Docker image if `vale` isn't installed locally.

### Basic Usage

```bash
# Lint specific files
.ci/vale/vale.sh content/influxdb3/core/**/*.md

# With product config and alert level
.ci/vale/vale.sh --config=content/influxdb/cloud-dedicated/.vale.ini --minAlertLevel=error content/influxdb/cloud-dedicated/write-data/**/*.md
```

### VS Code Integration

1. Install the [Vale VSCode](https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode) extension.
2. Set `Vale:Vale CLI:Path` to `vale` (or the full path to the binary).

### Alert Levels

Vale can raise different alert levels:

- **Error**: Problems that can cause content to render incorrectly, violations of branding guidelines, rejected vocabulary terms
- **Warning**: General style guide rules and best practices
- **Suggestion**: Style preferences that may require refactoring or updates to an exceptions list

### Configuration

- **Styles**: `.ci/vale/styles/` contains configuration for the custom `InfluxDataDocs` style
- **Vocabulary**: Add accepted/rejected terms to `.ci/vale/styles/config/vocabularies`
- **Product-specific**: Configure per-product styles like `content/influxdb/cloud-dedicated/.vale.ini`

For more configuration details, see [Vale configuration](https://vale.sh/docs/topics/config).

## Pre-commit Hooks

docs-v2 uses [Lefthook](https://github.com/evilmartians/lefthook) to manage Git hooks that run automatically during pre-commit and pre-push.

### What Runs Automatically

When you run `git commit`, Git runs:

- **Vale**: Style linting (if configured)
- **Prettier**: Code formatting
- **Cypress**: Link validation tests
- **Pytest**: Code block tests

### Skipping Pre-commit Hooks

We strongly recommend running linting and tests, but you can skip them:

```sh
# Skip with --no-verify flag
git commit -m "<COMMIT_MESSAGE>" --no-verify

# Skip with environment variable
LEFTHOOK=0 git commit
```

## Advanced Testing

### E2E Testing

```bash
# Run all E2E tests
yarn test:e2e

# Run specific E2E specs
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/index.cy.js"
```

### JavaScript Testing and Debugging

For JavaScript code in the documentation UI (`assets/js`):

#### Using Source Maps and Chrome DevTools

1. In VS Code, select Run > Start Debugging
2. Select "Debug Docs (source maps)" configuration
3. Set breakpoints in the `assets/js/ns-hugo-imp:` namespace

#### Using Debug Helpers

1. Import debug helpers in your JavaScript module:
   ```js
   import { debugLog, debugBreak, debugInspect } from './utils/debug-helpers.js';
   ```

2. Insert debug statements:
   ```js
   const data = debugInspect(someData, 'Data');
   debugLog('Processing data', 'myFunction');
   debugBreak(); // Add breakpoint
   ```

3. Start Hugo: `yarn hugo server`

4. In VS Code, select "Debug JS (debug-helpers)" configuration

Remember to remove debug statements before committing.

## Docker Compose Services

Available test services:

```bash
# All code block tests
docker compose --profile test up

# Individual product tests
docker compose run --rm cloud-pytest
docker compose run --rm v2-pytest
docker compose run --rm telegraf-pytest

# Stop monitoring services
yarn test:codeblocks:stop-monitors
```

## Testing Best Practices

### Code Block Examples

- Always test code examples before committing
- Use realistic data and examples that users would encounter
- Include proper error handling in examples
- Format code to fit within 80 characters
- Use long options in command-line examples (`--option` vs `-o`)

### Markdown Generation

- Build Hugo site before generating markdown: `npx hugo --quiet`
- Compile TypeScript before generation: `yarn build:ts`
- Test on small subsets first using `--limit` flag
- Use `--verbose` flag to debug conversion issues
- Always run Cypress validation tests after generation
- Check sample output manually for quality
- Verify shortcodes are evaluated (no `{{<` or `{{%` in output)
- Ensure UI elements are removed (no "Copy page", "Was this helpful?")
- Test both single pages (`index.md`) and section pages (`index.section.md`)

### Link Validation

- Test links regularly, especially after content restructuring
- Use appropriate cache TTL settings for your validation needs
- Monitor cache hit rates to optimize performance
- Clean up expired cache entries periodically

### Style Guidelines

- Run Vale regularly to catch style issues early
- Add accepted terms to vocabulary files rather than ignoring errors
- Configure product-specific styles for branding consistency
- Review suggestions periodically for content improvement opportunities

## Related Files

- **Configuration**: `pytest.ini`, `cypress.config.js`, `lefthook.yml`
- **Docker**: `compose.yaml`, `Dockerfile.pytest`
- **Scripts**: `.github/scripts/` directory
- **Test data**: `./test/` directory
- **Vale config**: `.ci/vale/styles/`
- **Markdown generation**:
  - `scripts/html-to-markdown.js` - CLI wrapper
  - `scripts/lib/markdown-converter.js` - Core conversion library
  - `deploy/lambda-edge/markdown-generator/` - Lambda deployment
  - `cypress/e2e/content/markdown-content-validation.cy.js` - Validation tests

## Getting Help

- **GitHub Issues**: [docs-v2 issues](https://github.com/influxdata/docs-v2/issues)
- **Good first issues**: [good-first-issue label](https://github.com/influxdata/docs-v2/issues?q=is%3Aissue+is%3Aopen+label%3Agood-first-issue)
- **InfluxData CLA**: [Sign here](https://www.influxdata.com/legal/cla/) for substantial contributions
