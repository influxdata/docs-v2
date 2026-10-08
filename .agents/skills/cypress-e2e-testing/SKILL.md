---
name: cypress-e2e-testing
description: "Run, validate, and analyze Cypress E2E tests for the InfluxData documentation site. Covers Hugo server management, test execution modes, and failure analysis. Use when writing or running Cypress tests, verifying rendered pages, checking JSON-LD/structured data, or debugging E2E failures after template, layout, or content changes."
---

# Cypress E2E testing

| Goal                        | Command                                                            | Load                                                           |
| --------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------- |
| Map a content page to tests | `node cypress/support/run-e2e-specs.js <file>`                     | [references/content-mapping.md](references/content-mapping.md) |
| Run one explicit spec       | `node cypress/support/run-e2e-specs.js --spec <spec> --no-mapping` | [references/runner.md](references/runner.md)                   |
| Diagnose failure            | inspect runner output and artifacts                                | [references/failures.md](references/failures.md)               |

Prerequisites: use this after selecting E2E coverage in docs-testing. The runner
manages its Hugo server; do not start a competing server. Add a failing behavior
test before changing templates or interactive UI.

Load only the reference matching the task. See [DOCS-TESTING.md](../../../DOCS-TESTING.md)
for suite-wide contributor guidance.
