# Testing Guide for InfluxData Documentation

This guide covers all testing procedures for the InfluxData documentation, including code block testing, link validation, and style linting.

## Quick Start

1. **Prerequisites**: Install [Node.js](https://nodejs.org/en), [Yarn](https://yarnpkg.com/getting-started/install), and [Docker](https://docs.docker.com/get-docker/)
2. **Install dependencies**: Run `yarn` to install all dependencies
3. **Build test environment**: Run `docker build -t influxdata/docs-pytest:latest -f Dockerfile.pytest .`
4. **Run tests**: Use any of the test commands below

## Test Types Overview

| Test Type | Purpose | Command |
|-----------|---------|---------|
| **Code blocks** | Validate shell/Python code examples | `yarn test:codeblocks:all` |
| **Link validation** | Check internal/external links | `yarn test:links` |
| **Style linting** | Enforce writing standards | `docker compose run -T vale` |
| **E2E tests** | UI and functionality testing | `yarn test:e2e` |

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

> [!Warning]
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

## Link Validation Testing

Link validation uses Cypress for e2e browser-based testing against the Hugo site to ensure all internal and external links work correctly.

### Basic Usage

```bash
# Test specific files
yarn test:links content/influxdb3/core/**/*.md

# Test all links (may take a long time)
yarn test:links

# Test by product (may take a long time)
yarn test:links:v3
yarn test:links:v2  
yarn test:links:telegraf
yarn test:links:chronograf
yarn test:links:kapacitor
```

### How Link Validation Works

The tests:
1. Start a Hugo development server
2. Navigate to each page in a browser
3. Check all links for validity
4. Report broken or invalid links

### GitHub Actions Integration

#### Composite Action

The `.github/actions/validate-links/` composite action provides reusable link validation:

```yaml
- uses: ./.github/actions/validate-links
  with:
    files: "content/influxdb3/core/file.md content/influxdb/v2/file2.md"
    product-name: "core"
    cache-enabled: "true"
    cache-key: "link-validation"
```

#### Matrix Generator

The `.github/scripts/matrix-generator.js` script provides intelligent strategy selection:

- **Sequential validation**: For small changes (< 10 files) or single-product changes
- **Parallel validation**: For large changes across multiple products (up to 5 concurrent jobs)

Test locally:

```bash
node .github/scripts/matrix-generator.js content/influxdb3/core/file1.md content/influxdb/v2/file2.md
```

Configuration options:
- `--max-concurrent <n>`: Maximum parallel jobs (default: 5)
- `--force-sequential`: Force sequential execution
- `--min-files-parallel <n>`: Minimum files for parallel (default: 10)

### Caching for Link Validation

Link validation supports caching to improve performance:

- **Cache location**: `.cache/link-validation/` (local), GitHub Actions cache (CI)
- **Cache keys**: Based on content file hashes
- **TTL**: 30 days by default, configurable

#### Cache Configuration Options

```bash
# Use 7-day cache for more frequent validation
yarn test:links --cache-ttl=7 content/influxdb3/**/*.md

# Use 1-day cache via environment variable
LINK_CACHE_TTL_DAYS=1 yarn test:links content/**/*.md

# Clean up expired cache entries
node .github/scripts/incremental-validator.js --cleanup
```

#### How Caching Works

- **Cache key**: Based on file path + content hash (file changes invalidate cache immediately)
- **External links**: Cached for the TTL period since URLs rarely change
- **Internal links**: Effectively cached until file content changes
- **Automatic cleanup**: Expired entries are removed on access and via `--cleanup`

## Style Linting (Vale)

Style linting uses [Vale](https://vale.sh/) to enforce documentation writing standards, branding guidelines, and vocabulary consistency.

### Basic Usage

```bash
# Basic linting with Docker
docker compose run -T vale --config=content/influxdb/cloud-dedicated/.vale.ini --minAlertLevel=error content/influxdb/cloud-dedicated/write-data/**/*.md
```

### VS Code Integration

1. Install the [Vale VSCode](https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode) extension
2. Set the `Vale:Vale CLI:Path` setting to `${workspaceFolder}/node_modules/.bin/vale`

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
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/article-links.cy.js"
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

## Getting Help

- **GitHub Issues**: [docs-v2 issues](https://github.com/influxdata/docs-v2/issues)
- **Good first issues**: [good-first-issue label](https://github.com/influxdata/docs-v2/issues?q=is%3Aissue+is%3Aopen+label%3Agood-first-issue)
- **InfluxData CLA**: [Sign here](https://www.influxdata.com/legal/cla/) for substantial contributions