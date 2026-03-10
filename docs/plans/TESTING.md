# API Reference Testing Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Validate Hugo-native API reference pages render correctly and all tests pass.

**Architecture:** Hugo-native rendering uses standard HTML without shadow DOM, making tests simpler. No RapiDoc web components - operations are rendered server-side by Hugo templates.

**Tech Stack:** Hugo templates, SCSS, Cypress

***

## Test Structure

The API reference tests validate:

1. **API index pages** - Main API landing pages load correctly
2. **API tag pages** - Tag pages render operations with parameters/responses
3. **Section structure** - Section pages list tag children correctly
4. **All endpoints** - All endpoints page shows all operations
5. **Layout** - 3-column layout with sidebar, content, and TOC

## Running Tests

### Quick validation

```bash
# Build site
yarn hugo --quiet

# Start server
yarn hugo server &

# Test pages load
curl -s -o /dev/null -w "%{http_code}" http://localhost:1313/influxdb3/core/api/
# Expected: 200

# Run Cypress tests (for example, for InfluxDB 3 Core)
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/api-reference.cy.js" content/influxdb3/core/api/_index.md

# Stop server
pkill -f "hugo server"
```

### Full test suite

```bash
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/api-reference.cy.js"
```

## Test Selectors (Hugo-Native)

Since Hugo-native uses standard HTML, tests use simple CSS selectors:

| Element          | Selector            |
| ---------------- | ------------------- |
| Page title       | `h1`                |
| Operation        | `.api-operation`    |
| Method badge     | `.api-method`       |
| Path             | `.api-path`         |
| Parameters table | `.api-parameters`   |
| Request body     | `.api-request-body` |
| Responses        | `.api-responses`    |
| TOC              | `.api-toc`          |
| Related links    | `.article--related` |

## Expected Test Coverage

- [ ] API index pages (Core, Enterprise, Cloud Dedicated, Clustered, Cloud Serverless)
- [ ] Tag pages render operations
- [ ] Parameters display correctly
- [ ] Request body sections display
- [ ] Response sections display
- [ ] TOC links work
- [ ] All endpoints page lists operations
- [ ] Section pages list tags
- [ ] Links are valid
