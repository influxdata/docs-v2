---
name: cypress-e2e-testing
description: Run, validate, and analyze Cypress E2E tests for the InfluxData documentation site. Covers Hugo server management, test execution modes, and failure analysis.
author: InfluxData
version: "1.0"
---

# Cypress E2E Testing Skill

## Purpose

This skill guides agents through running Cypress end-to-end tests for the documentation site, including understanding when Hugo starts automatically vs. manually, interpreting test results, and debugging failures.

For comprehensive testing documentation, see **[DOCS-TESTING.md](../../../DOCS-TESTING.md)**.

## Key Insight: Hugo Server Management

**The test runner (`run-e2e-specs.js`) automatically manages Hugo.**

- **Port 1315** is used for testing (not 1313)
- If port 1315 is free → starts Hugo automatically
- If port 1315 is in use → checks if it's a working Hugo server and reuses it
- Hugo logs written to `/tmp/hugo_server.log`

**You do NOT need to start Hugo separately** unless you want to keep it running between test runs for faster iteration.

## Quick Reference

| Task                            | Command                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Test content file               | `node cypress/support/run-e2e-specs.js content/path/to/file.md`                                         |
| Test with specific spec         | `node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/spec.cy.js" content/path/to/file.md` |
| Functionality test (no content) | `node cypress/support/run-e2e-specs.js --spec "cypress/e2e/page-context.cy.js" --no-mapping`            |
| Test shortcode examples         | `yarn test:shortcode-examples`                                                                          |

## Prerequisites

```bash
# Install dependencies (required)
yarn install

# Verify Cypress is available
yarn cypress --version
```

### API Reference Tests: Additional Prerequisites

**API reference pages require generation before testing.** The pages don't exist until you run:

```bash
# Generate API documentation content from OpenAPI specs
yarn build:api-docs
```

This step:

- Processes OpenAPI specs in `api-docs/` directories
- Generates Hugo content pages in `content/*/api/`
- Creates operation pages, tag pages, and index pages

**Without this step**, all API reference tests will fail with 404 errors.

**Quick check** - verify API content exists:

```bash
# Should list generated API content directories
ls content/influxdb3/core/api/

# If "No such file or directory", run: yarn build:api-docs
```

### Markdown Validation Tests: Additional Prerequisites

**Markdown validation tests require generated markdown files.** Run:

```bash
# Build Hugo site first (generates HTML in public/)
npx hugo --quiet

# Generate LLM-friendly markdown from HTML
yarn build:md
```

This creates `.md` files in the `public/` directory that the markdown validation tests check.

**Without this step**, markdown validation tests will fail with missing file errors.

## Test Execution Modes

### Mode 1: Content-Specific Tests (Default)

Tests specific content files by mapping them to URLs.

```bash
# Single file
node cypress/support/run-e2e-specs.js content/influxdb3/core/_index.md

# Multiple files
node cypress/support/run-e2e-specs.js content/influxdb3/core/_index.md content/influxdb3/enterprise/_index.md

# With specific test spec
node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/content/api-reference.cy.js" \
  content/influxdb3/core/reference/api/_index.md
```

**What happens:**

1. Maps content files to URLs (e.g., `content/influxdb3/core/_index.md` → `/influxdb3/core/`)
2. Starts Hugo on port 1315 (if not running)
3. Runs Cypress tests against mapped URLs
4. Stops Hugo when done

### Mode 2: Functionality Tests (`--no-mapping`)

Tests UI functionality without requiring content file paths.

```bash
# Run functionality test
node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/page-context.cy.js" \
  --no-mapping
```

**Use when:** Testing JavaScript components, theme switching, navigation, or other UI behavior not tied to specific content.

### Mode 3: Reusing an Existing Hugo Server

For faster iteration during development:

```bash
# Terminal 1: Start Hugo manually on port 1315
npx hugo server --port 1315 --environment testing --noHTTPCache

# Terminal 2: Run tests (will detect and reuse existing server)
node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/content/api-reference.cy.js" \
  content/influxdb3/core/reference/api/_index.md
```

## Available Test Specs

| Spec File                                               | Purpose                                       |
| ------------------------------------------------------- | --------------------------------------------- |
| `cypress/e2e/content/api-reference.cy.js`               | API reference pages (RapiDoc, layouts, links) |
| `cypress/e2e/content/index.cy.js`                       | General content validation                    |
| `cypress/e2e/content/markdown-content-validation.cy.js` | LLM markdown generation                       |
| `cypress/e2e/page-context.cy.js`                        | Page context and navigation                   |

## Understanding Test Output

### Success Output

```
✅ e2e tests completed successfully
📊 Detailed Test Results:
   • Total Tests: 25
   • Tests Passed: 25
   • Tests Failed: 0
```

### Failure Output

```
ℹ️ Note: 3 test(s) failed.
📊 Detailed Test Results:
   • Total Tests: 25
   • Tests Passed: 22
   • Tests Failed: 3

📋 Failed Spec Files:
   • cypress/e2e/content/api-reference.cy.js
     - Failures: 3
     - Failed Tests:
       * has API info
         Error: Expected to find element '.article--description'
```

### Common Failure Patterns

| Error                               | Likely Cause                        | Solution                         |
| ----------------------------------- | ----------------------------------- | -------------------------------- |
| All API tests fail with 404         | API content not generated           | Run `yarn build:api-docs` first  |
| `Expected to find element 'X'`      | Selector changed or element removed | Update test or fix template      |
| `Timed out waiting for element`     | Page load issue or JS error         | Check Hugo logs, browser console |
| `cy.request() failed`               | Broken link or 404                  | Fix the link in content          |
| `Hugo server died during execution` | Build error or memory issue         | Check `/tmp/hugo_server.log`     |

## Debugging Failures

### Step 1: Check Hugo Logs

```bash
cat /tmp/hugo_server.log | tail -50
```

Look for:

- Template errors (`error calling partial`)
- Build failures
- Missing data files

### Step 2: Run Test in Interactive Mode

```bash
# Start Hugo manually
npx hugo server --port 1315 --environment testing

# In another terminal, open Cypress interactively
yarn cypress open
```

### Step 3: Inspect the Page

Visit `http://localhost:1315/path/to/page/` in a browser and:

- Open DevTools Console for JavaScript errors
- Inspect elements to verify selectors
- Check Network tab for failed requests

### Step 4: Run Single Test with Verbose Output

```bash
DEBUG=cypress:* node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/content/api-reference.cy.js" \
  content/influxdb3/core/reference/api/_index.md
```

## Test Configuration

The test runner uses these settings:

```javascript
{
  browser: 'chrome',
  baseUrl: 'http://localhost:1315',
  video: false,  // Disabled in CI
  defaultCommandTimeout: 10000,  // 15000 in CI
  pageLoadTimeout: 30000,  // 45000 in CI
}
```

## Writing New Tests

### Basic Test Structure

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visit('/path/to/page/');
  });

  it('validates expected behavior', () => {
    cy.get('.selector').should('exist');
    cy.get('.selector').should('be.visible');
    cy.get('.selector').contains('Expected text');
  });
});
```

### Testing Components

```javascript
describe('Component Name', () => {
  it('initializes correctly', () => {
    cy.visit('/path/with/component/');

    // Wait for component initialization
    cy.get('[data-component="my-component"]', { timeout: 5000 })
      .should('be.visible');

    // Verify component rendered expected elements
    cy.get('[data-component="my-component"] .child-element')
      .should('have.length.at.least', 1);
  });
});
```

### Using Real Configuration Data

Import real configuration data (from `data/*.yml`) via `cy.task('getData')` instead of hardcoding expected values. This keeps tests in sync with the source of truth.

```javascript
describe('Product shortcodes', function () {
  let products;

  before(function () {
    // Load products.yml via the getData task defined in cypress.config.js
    cy.task('getData', 'products').then((data) => {
      products = data;
    });
  });

  it('renders the correct product name', function () {
    cy.visit('/influxdb3/core/_test/shortcodes/');
    // Assert against YAML data, not a hardcoded string
    cy.get('[data-testid="product-name"]').should(
      'contain.text',
      products.influxdb3_core.name
    );
  });

  it('renders current-version from YAML', function () {
    cy.visit('/influxdb/v2/_test/shortcodes/');
    // Derive expected value the same way the Hugo shortcode does
    const patch = products.influxdb.latest_patches?.v2;
    const expected = patch ? patch.replace(/\.\d+$/, '') : '';
    cy.get('[data-testid="current-version"] .current-version').should(
      'have.text',
      expected
    );
  });
});
```

**Key principles:**

- Load YAML data in `before()` — available to all tests in the suite
- Derive expected values from the data, mirroring shortcode logic
- Only hardcode what you must: content paths and test page URLs
- Derive boolean flags from data fields (e.g., `product.distributed_architecture`, `product.limits`)

See `cypress/e2e/content/shortcodes.cy.js` and `cypress/e2e/content/latest-patch-shortcode.cy.js` for full examples.

### Testing Links

```javascript
it('contains valid internal links', () => {
  cy.get('body').then(($body) => {
    if ($body.find('a[href^="/"]').length === 0) {
      cy.log('No internal links found');
      return;
    }

    cy.get('a[href^="/"]').each(($a) => {
      cy.request($a.attr('href')).its('status').should('eq', 200);
    });
  });
});
```

## CI/CD Considerations

In CI environments:

- Video recording is disabled to save resources
- Timeouts are increased (15s command, 45s page load)
- Memory management is enabled
- Only 1 test kept in memory at a time

## Related Files

- **Test runner**: `cypress/support/run-e2e-specs.js`
- **Hugo server helper**: `cypress/support/hugo-server.js`
- **URL mapper**: `cypress/support/map-files-to-urls.js`
- **Config**: `cypress.config.js`
- **Comprehensive docs**: `DOCS-TESTING.md`

## Checklist for Test Validation

Before concluding test analysis:

- [ ] For API tests: Verify `yarn build:api-docs` was run (check `ls content/*/api/`)
- [ ] All tests passed, or failures are understood
- [ ] Hugo logs checked for build errors
- [ ] Failed selectors verified against current templates
- [ ] Broken links identified and reported
- [ ] JavaScript console errors investigated (if relevant)

## Related Skills

- **hugo-template-dev** - For Hugo template syntax, data access patterns, and runtime testing
- **docs-cli-workflow** - For creating/editing documentation content with CLI tools
- **ts-component-dev** (agent) - TypeScript component behavior and interactivity
- **hugo-ui-dev** (agent) - Hugo templates and SASS/CSS styling
