# Specialized checks

Layouts require Hugo and Cypress runtime coverage. Assets require their scoped
build or lint. For UI changes, also follow
[rendered UI verification](../../cypress-e2e-testing/references/ui-verification.md),
including asset reuse, component widths, and shadow-root fonts.
API specs require `yarn build:api-docs`. Shell, workflows, and
other deferred paths need a deliberate review until verifier support expands.

A Hugo build that exits 0 but renders only a few pages is a build artifact, not
a template bug. Rebuild into a fresh `--destination` with no other Hugo process
running, then investigate. A check that fails for every page in the site points
at a missing build step or a missing dependency, not at your change.
