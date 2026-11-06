# Specialized checks

Layouts require a Hugo build and rendered browser coverage. Use the project's
Playwright migration for new or migrated scenarios; keep Cypress for coverage
that has not migrated. When behavior changes, search both suites for obsolete
expectations. Move an affected scenario with its meaningful assertions instead
of adding parallel coverage that leaves the old suite failing.

Use checked TypeScript declarations for browser harnesses and DOM extensions.
Keep readiness waits for asynchronous initialization; use type checking for
static contracts. Keep screenshots in Playwright's per-test output directory.
Validate browser-capability claims from automated reviews against the pinned
Playwright version before adding skips, and distinguish source evidence from a
browser run blocked by unavailable binaries.

Assets require their scoped build or lint. For UI changes, also follow
[rendered UI verification](../../cypress-e2e-testing/references/ui-verification.md),
including asset reuse, component widths, and shadow-root fonts.
API specs require `yarn build:api-docs`. Shell, workflows, and
other deferred paths need a deliberate review until verifier support expands.

A Hugo build that exits 0 but renders only a few pages is a build artifact, not
a template bug. Rebuild into a fresh `--destination` with no other Hugo process
running, then investigate. A check that fails for every page in the site points
at a missing build step or a missing dependency, not at your change.
