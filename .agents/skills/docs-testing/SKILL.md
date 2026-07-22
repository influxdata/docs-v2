---
name: docs-testing
description: Testing decision guide for agents working in docs-v2. Maps changed file types to the exact test commands to run, documents what runs automatically in hooks and CI, and flags coverage gaps. Load Part 1 for the decision table; load later parts only when executing a specific test type.
---

# docs-testing Skill

## Part 1: Decision Table — What to Run

Identify the changed file type and run the corresponding commands. Pre-commit hooks run automatically; "Run locally" items require manual invocation before or after committing.

| Changed file                                                                             | Pre-commit (auto)                               | Run locally                                                                             | CI (auto on PR)                                    |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `content/**/*.md`                                                                        | Vale, markdown checks                           | `yarn lint-codeblocks <files>` · `link-checker map+check`                               | Vale, link-checker, codeblock lint                 |
| `content/shared/**/*.md`                                                                 | Vale (via product globs)                        | Same as content. Also find consuming products: `grep -r "source:.*<filename>" content/` | Same                                               |
| `layouts/**/*.html`                                                                      | render-hook whitespace (if render hook)         | `node cypress/support/run-e2e-specs.js --spec cypress/e2e/... --no-mapping`             | pr-render-check, Cypress (if layout/asset changed) |
| `assets/js/*.ts`                                                                         | TypeScript build (auto-staged)                  | —                                                                                       | —                                                  |
| `assets/**/*.{js,mjs,css,scss}` or `layouts/*.html` or `content/example.md`              | prettier, eslint                                | (pre-push auto) Cypress shortcode examples                                              | pr-render-check                                    |
| `data/products.yml`                                                                      | build-agent-instructions, check-feedback-links  | —                                                                                       | pr-feedback-links                                  |
| `api-docs/**/*.yml`                                                                      | —                                               | `yarn build:api-docs` then Cypress for affected pages                                   | —                                                  |
| `*.sh`                                                                                   | shellcheck                                      | —                                                                                       | —                                                  |
| `README.md`, `DOCS-*.md`, `AGENTS.md`, `CLAUDE.md`, `.github/**/*.md`, `.claude/**/*.md` | remark (auto-fixed), Vale (instructions config) | —                                                                                       | pr-remark-check                                    |
| `lefthook.yml`, `.github/workflows/*.yml`                                                | —                                               | Manual review                                                                           | —                                                  |
| `scripts/**` or `layouts/index.llmstxt.txt` or `scripts/lib/corpus-paths.js`             | —                                               | `yarn build:ts && npx hugo --quiet && yarn build:md && yarn check:md-coherence`         | —                                                  |

**Shared content rule:** A change to `content/shared/foo.md` affects every product that has `source: /shared/foo.md` in a stub. Run the lint commands against the shared file; the CI link-checker and Vale resolve stubs to products automatically.

***

## Part 2: Automation Coverage

Do not re-run these manually — they run automatically.

### Pre-commit (lefthook.yml)

Runs on `git commit` against staged files:

- `deprecated-markdown-patterns` — banned shortcodes, `py` fence identifier
- `check-support-links` — non-standard support.influxdata.com URLs
- `check-source-paths` — `source:` must start with `/shared/`
- `check-render-hook-whitespace` — whitespace leaks in render hooks
- `check-feedback-links` — `data/products.yml` product feedback URLs
- Vale per-product — one hook per product, matches its content glob
- `lint-markdown-instructions` + `lint-instructions` — remark + Vale for repo docs
- `build-typescript` — compiles `assets/js/*.ts`
- `prettier` — formats JS/CSS/TS (auto-staged)
- `lint-js` — ESLint on `assets/js/`
- `shellcheck` — shell script lint

### Pre-push (lefthook.yml)

Runs on `git push`:

- `packages-audit` — `yarn audit` (fails on default branch only)
- `e2e-shortcode-examples` — Cypress shortcode test (triggers on asset/layout/example.md changes)

Code block execution tests are **disabled** in pre-push hooks. Run them manually.

### CI checks on every PR

| Workflow                         | What it checks                                 | Blocks merge?              |
| -------------------------------- | ---------------------------------------------- | -------------------------- |
| `pr-vale-check.yml`              | Vale on changed markdown + shared content      | Errors only                |
| `pr-link-check.yml`              | Links in changed pages (also download/install pages when `data/products.yml` changes) | Warnings only |
| `pr-release-check.yml`           | Reminds to bump `data/products.yml` when release notes advance; gates release PRs on published download artifacts | Reminder: no. Artifact gate: yes, on version-bump PRs (override label `release:artifacts-pending`) |
| `test.yml` (lint-codeblocks job) | Parse/compile check on changed content         | JSON/YAML/TOML errors only |
| `pr-render-check.yml`            | Whitespace-escaped code blocks, Cypress render | Yes (render artifacts)     |
| `pr-remark-check.yml`            | Remark lint on repo docs                       | No                         |
| `block-ephemeral-docs.yml`       | Blocks PLAN.md and HANDOVER.md on master       | Yes                        |
| `pr-feedback-links.yml`          | Rendered feedback link validation              | Warnings only              |
| `pr-lockfile-lint.yml`           | yarn.lock integrity                            | Yes                        |
| `auto-label.yml`                 | Applies product labels                         | No                         |
| `pr-preview.yml`                 | Deploys preview pages listed in PR body        | No                         |

Code block **execution** is NOT a PR check. It runs on demand via `workflow_dispatch`.

### Dependency updates (org-managed)

**Dependabot runs org-wide** for all influxdata repos — it is managed by the
security team, not by a workflow in this repo. Do not add a parallel
dependency-update mechanism. Two implications for agents:

- When you add or update a third-party GitHub Action, **pin it by full commit
  SHA** with a version comment (see `.github/workflows/pr-lockfile-lint.yml`) so
  Dependabot can bump it cleanly.
- A repo-level `.github/dependabot.yml`, if present, supplements the org config;
  scheduled `github-actions` version updates require an explicit entry there.
  Coordinate with the security team before changing dependency automation.

***

## Part 3: Running Specific Tests

Load this section only when you need to run a specific test type.

### Codeblock lint (parse/compile)

```sh
# Single file or glob
yarn lint-codeblocks content/influxdb3/core/admin/tokens/admin/*.md

# Compact summary (counts by severity, top failing files)
yarn lint-codeblocks:pretty content/**/*.md

# Self-tests
yarn test:lint-codeblocks
```

Exit code 1 if any JSON/YAML/TOML block fails to parse. bash/python/JS failures are warnings only.

Linter normalizes `{ placeholders="..." }` fence attributes and strips Hugo shortcodes inside fences before parsing.

### Code block execution (pytest)

Prerequisites: Docker installed, `docker build -t influxdata/docs-pytest:latest -f Dockerfile.pytest .`, `.env.test` file in the product directory.

```sh
yarn test:codeblocks:influxdb3_core
yarn test:codeblocks:influxdb3_enterprise
yarn test:codeblocks:telegraf
yarn test:codeblocks:v2
yarn test:codeblocks:cloud
yarn test:codeblocks:all
```

For InfluxDB 3 Core/Enterprise local server setup: see the [influxdb3-test-setup skill](../influxdb3-test-setup/SKILL.md).

For CI manual dispatch:

```sh
gh workflow run "Test Code Blocks" \
  --repo influxdata/docs-v2 \
  -f products=core,telegraf \
  -f use_default_group=false
```

### Link validation

```sh
# Map content file(s) to HTML paths, then check
link-checker map content/influxdb3/core/get-started/ | xargs link-checker check

# Changed files in last commit
git diff --name-only HEAD~1 HEAD | grep '\.md$' | \
  xargs link-checker map | xargs link-checker check

# With production config (same as CI)
link-checker check \
  --config .ci/link-checker/production.lycherc.toml \
  public/path/to/page/
```

macOS: build from source (`cargo build --release` in `docs-tooling/link-checker`).

### Vale style linting

```sh
# Default config
.ci/vale/vale.sh content/influxdb3/core/**/*.md

# Product-specific config
.ci/vale/vale.sh \
  --config=content/influxdb3/cloud-dedicated/.vale.ini \
  --minAlertLevel=error \
  content/influxdb3/cloud-dedicated/write-data/**/*.md

# Repo docs (DOCS-*.md, .github/, .claude/)
.ci/vale/vale.sh --config=.vale-instructions.ini README.md
```

Vocabulary edits: `.ci/vale/styles/config/vocabularies`.
Rule authoring: see [vale-linting skill](../vale-linting/SKILL.md) and [vale-rule-config skill](../vale-rule-config/SKILL.md).

### Cypress E2E tests

```sh
# Test a content file
node cypress/support/run-e2e-specs.js content/influxdb3/core/_index.md

# Run a specific spec (no content mapping)
node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/content/jsonld-organization.cy.js" \
  --no-mapping

# Shortcode examples
yarn test:shortcode-examples

# All E2E tests
yarn test:e2e
```

The runner manages Hugo on port 1315 automatically. For writing Cypress tests: see [cypress-e2e-testing skill](../cypress-e2e-testing/SKILL.md).

### Markdown generation validation

```sh
# Build prerequisites
yarn build:ts
npx hugo --quiet

# Generate markdown for a path
yarn build:md --public-dir public --path influxdb3/core/get-started --limit 10

# Validate output
node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/content/markdown-content-validation.cy.js"

# Check autodiscovery coherence (run after full build:md)
yarn check:md-coherence
```

***

## Part 4: Known Coverage Gaps

Flag these when writing or reviewing content in affected areas.

| Area                                | Gap                                                                                         | Workaround                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| SQL, InfluxQL syntax                | `lint-codeblocks` skips these languages                                                     | Manual review only                                     |
| Code block execution                | Only `influxdb3_core` and `influxdb3_enterprise` run against a live server in CI            | Run locally with `yarn test:codeblocks:<product>`      |
| `v1`, `explorer` products           | No pytest Docker Compose service                                                            | No automated execution test; only codeblock lint       |
| `assets/js` unit tests              | No unit test framework                                                                      | ESLint only; behavior tested via Cypress E2E           |
| Accessibility                       | No automated a11y tests in CI                                                               | Manual audit or browser tool                           |
| Shared content → product resolution | Shared file changes affect consuming products; local test runs don't auto-detect consumers  | `grep -r "source:.*<filename>" content/` to find stubs |
| Cross-product link correctness      | link-checker checks pages in isolation; cross-product canonicals aren't verified end-to-end | PR preview + manual check                              |

***

## References

- Full contributor testing guide: [DOCS-TESTING.md](../../../DOCS-TESTING.md)
- Cypress test writing: [cypress-e2e-testing skill](../cypress-e2e-testing/SKILL.md)
- Vale rule authoring: [vale-linting skill](../vale-linting/SKILL.md), [vale-rule-config skill](../vale-rule-config/SKILL.md)
- InfluxDB 3 local server setup: [influxdb3-test-setup skill](../influxdb3-test-setup/SKILL.md)
- LLM markdown generation: [scripts/README.md](../../../scripts/README.md)
- Code block test performance: [test/TEST-PERFORMANCE.md](../../../test/TEST-PERFORMANCE.md)
