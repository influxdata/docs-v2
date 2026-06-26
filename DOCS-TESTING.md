# Testing Guide for InfluxData Documentation

This guide covers testing procedures for documentation contributors.
For agent-specific guidance, see the [docs-testing skill](.agents/skills/docs-testing/SKILL.md).

## Quick Reference

| Test Type                | Local command                                         | When to run                    |
| ------------------------ | ----------------------------------------------------- | ------------------------------ |
| **Codeblock lint**       | `yarn lint-codeblocks <files>`                        | Any content change             |
| **Code block execution** | `yarn test:codeblocks:<product>`                      | After adding runnable examples |
| **Link validation**      | `link-checker map <path> \| xargs link-checker check` | After adding/changing links    |
| **Style linting**        | `.ci/vale/vale.sh content/**/*.md`                    | Any content change             |
| **E2E tests**            | `node cypress/support/run-e2e-specs.js <file>`        | Template or UI changes         |
| **Shortcode examples**   | `yarn test:shortcode-examples`                        | Shortcode changes              |

## What Runs Automatically

### Pre-commit hooks (Lefthook)

When you run `git commit`, these checks run against staged files:

| Hook                           | Trigger                                                        | What it checks                              |
| ------------------------------ | -------------------------------------------------------------- | ------------------------------------------- |
| `deprecated-markdown-patterns` | `content/**/*.md`                                              | Banned shortcodes, `py` instead of `python` |
| `check-support-links`          | `content/**/*.md`                                              | Non-standard support.influxdata.com links   |
| `check-source-paths`           | `content/**/*.md`                                              | `source:` values must start with `/shared/` |
| Vale per-product               | `content/**/*.md`                                              | Style, branding, vocabulary                 |
| `lint-markdown-instructions`   | `README.md`, `[A-Z]*.md`, `.github/**/*.md`, `.claude/**/*.md` | Remark formatting (auto-fixed)              |
| `lint-instructions`            | Same as above                                                  | Vale (instructions config)                  |
| `check-render-hook-whitespace` | `layouts/_default/_markup/render-*.html`                       | Whitespace leaks in render hooks            |
| `check-feedback-links`         | `data/products.yml`, feedback template                         | Product feedback URL config                 |
| `build-typescript`             | `assets/js/*.ts`                                               | Compiles TypeScript (auto-staged)           |
| `prettier`                     | `*.{css,js,ts,jsx,tsx}`                                        | Code formatting (auto-fixed)                |
| `lint-js`                      | `assets/js/*.{js,ts}`                                          | ESLint                                      |
| `shellcheck`                   | `*.sh`                                                         | Shell script lint                           |

### Pre-push hooks

| Hook                     | Trigger                                           | What it checks                            |
| ------------------------ | ------------------------------------------------- | ----------------------------------------- |
| `packages-audit`         | Always                                            | `yarn audit` for security vulnerabilities |
| `e2e-shortcode-examples` | `assets/`, `layouts/*.html`, `content/example.md` | Cypress shortcode rendering               |

To skip hooks when needed:

```sh
git commit -m "..." --no-verify
LEFTHOOK=0 git push
```

### CI checks on every PR

- **Vale** (`.github/workflows/pr-vale-check.yml`) — errors block merge
- **Link checker** (`.github/workflows/pr-link-check.yml`) — checks changed pages
- **Codeblock lint** (`.github/workflows/test.yml`) — parse/compile check; JSON/YAML/TOML failures block merge
- **Render regression** (`.github/workflows/pr-render-check.yml`) — checks for whitespace-escaped code blocks
- **Remark** (`.github/workflows/pr-remark-check.yml`) — runs on repo docs (DOCS-\*.md, .github/, .claude/)
- **Render artifacts** — site-wide grep for forbidden HTML patterns

Code block **execution** runs on demand via `workflow_dispatch`, not automatically on PRs.

## Code Block Testing

Code block testing runs shell and Python examples using [pytest-codeblocks](https://github.com/nschloe/pytest-codeblocks/tree/main).

### Setup

1. Install [Docker](https://docs.docker.com/get-docker/).
2. Build the test image:
   ```sh
   docker build -t influxdata/docs-pytest:latest -f Dockerfile.pytest .
   ```
3. Copy `./test/env.test.example` to each product directory as `.env.test` and fill in credentials.
   > \[!Warning]
   > Never commit `.env.test` files. Git ignores `.env*` by default.

### Running tests

```bash
# Run all code block tests
yarn test:codeblocks:all

# Run for a specific product
yarn test:codeblocks:influxdb3_core
yarn test:codeblocks:telegraf
yarn test:codeblocks:v2
```

For InfluxDB 3 Core and Enterprise local setup, see the [influxdb3-test-setup skill](.agents/skills/influxdb3-test-setup/SKILL.md).

### Writing testable code blocks

Use `python` (not `py`) for Python fences — pytest-codeblocks ignores `py`:

```python
print("Hello, world!")
```

To hide a test block from users, wrap it in an HTML comment. pytest-codeblocks still runs it.

For commands requiring TTY interaction (like `influxctl`), wrap in a subshell and redirect output:

```sh
script -c "influxctl user list" /dev/null > /shared/urls.txt
```

See the [pytest-codeblocks README](https://github.com/nschloe/pytest-codeblocks/tree/main) for skip markers and expected-output syntax.

### CI behavior

- **On PRs**: Detection only. The CI workflow identifies which products are affected and posts a summary. It does not block the PR.
- **Manual runs**: Trigger from the Actions UI or:
  ```bash
  gh workflow run "Test Code Blocks" \
    --repo influxdata/docs-v2 \
    -f products=core,telegraf
  ```
- **Live server in CI**: Only `influxdb3_core` runs against a real server. Enterprise requires `INFLUXDB3_ENTERPRISE_LICENSE_BLOB` repo secret. All other products use mock credentials.

## Codeblock Lint (Parse/Compile Check)

Runs on every PR that changes content. No credentials or network access required.

```sh
# Lint specific files
yarn lint-codeblocks content/influxdb3/core/admin/tokens/admin/*.md

# Pretty summary (counts by severity, top files with errors)
yarn lint-codeblocks:pretty content/**/*.md

# Run the linter's own tests
yarn test:lint-codeblocks
```

**Blocking policy:**

| Language                 | Policy on parse failure                    |
| ------------------------ | ------------------------------------------ |
| JSON, YAML, TOML         | `::error::` — fails the PR check           |
| bash, python, javascript | `::warning::` — does not fail the PR check |

SQL, InfluxQL, Go, and other languages are not yet checked.

**Normalization**: The linter handles common docs patterns:

- `{ placeholders="TOKEN_NAME|DURATION" }` fence attributes — tokens get language-safe substitutions before parsing
- Hugo shortcodes inside fences — stripped with a safe replacement

## Link Validation

### Local setup (macOS)

```bash
git clone https://github.com/influxdata/docs-tooling.git
cd docs-tooling/link-checker
cargo build --release
cp target/release/link-checker /usr/local/bin/
```

> \[!Note]
> Pre-built binaries (Linux x86\_64 only) are available from docs-v2 releases. macOS requires building from source.

### Basic usage

```bash
# Map changed markdown to HTML, then check links
link-checker map content/influxdb3/core/get-started/ | xargs link-checker check

# Check only files changed in the last commit
git diff --name-only HEAD~1 HEAD | grep '\.md$' | \
  xargs link-checker map | \
  xargs link-checker check

# Use production config (same as CI)
link-checker check \
  --config .ci/link-checker/production.lycherc.toml \
  public/influxdb3/core/get-started/
```

Local checks resolve relative links to the local filesystem. CI checks resolve them to the production site.

## Style Linting (Vale)

Install locally: `brew install vale` (recommended) or use the Docker fallback via `.ci/vale/vale.sh`.

```bash
# Lint specific files
.ci/vale/vale.sh content/influxdb3/core/**/*.md

# With product config and minimum alert level
.ci/vale/vale.sh \
  --config=content/influxdb3/cloud-dedicated/.vale.ini \
  --minAlertLevel=error \
  content/influxdb3/cloud-dedicated/write-data/**/*.md
```

**Alert levels:**

- **Error** — blocks merge (branding violations, rejected terms, render-breaking patterns)
- **Warning** — style guide rules (informational in CI)
- **Suggestion** — style preferences (informational)

**Adding vocabulary terms:** edit `.ci/vale/styles/config/vocabularies`.

For creating or debugging Vale rules, see the [vale-linting skill](.agents/skills/vale-linting/SKILL.md) and [vale-rule-config skill](.agents/skills/vale-rule-config/SKILL.md).

## E2E Tests (Cypress)

E2E tests validate UI components, rendered HTML, and page behavior.

```bash
# Test a specific content file
node cypress/support/run-e2e-specs.js content/influxdb3/core/_index.md

# Run a specific spec (no content mapping)
node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/content/jsonld-organization.cy.js" \
  --no-mapping

# Test shortcode examples
yarn test:shortcode-examples
```

The test runner manages Hugo automatically on port 1315. You don't need to start Hugo separately.

For writing Cypress tests and debugging failures, see the [cypress-e2e-testing skill](.agents/skills/cypress-e2e-testing/SKILL.md).

## Structured Data (JSON-LD) Validation

Cypress tests in `cypress/e2e/content/jsonld-*.cy.js` verify JSON-LD is emitted on the right pages. They confirm *presence*, not schema correctness.

For schema correctness, validate against [validator.schema.org](https://validator.schema.org) — **not** the Google Rich Results Test. Most JSON-LD types this repo emits (`Organization`, `TechArticle`, `SoftwareApplication`) never appear in the Rich Results Test even when valid.

## PR Preview Pages

Add page URLs to the PR description to deploy a hosted preview automatically.

The preview workflow (`.github/workflows/pr-preview.yml`) deploys only those pages to GitHub Pages. Use it when a reviewer would need a local Hugo build to verify a visual or structural change.

**URL formats the extractor recognizes:**

- `https://docs.influxdata.com/<path>`
- `http://localhost:1313/<path>`
- Bare paths starting with a product namespace (`/influxdb3/...`, `/telegraf/...`)

URLs inside fenced code blocks are ignored. List preview URLs as bare paths or markdown links.

**Convention:** pair each URL with an "Expected" column describing what the reviewer should verify.

Related files:

- `.github/workflows/pr-preview.yml` — the workflow
- `.github/scripts/parse-pr-urls.js` — URL extractor
- `.github/scripts/detect-preview-pages.js` — decides whether preview deploys

## Related Files

| File                       | Purpose                                      |
| -------------------------- | -------------------------------------------- |
| `lefthook.yml`             | Pre-commit and pre-push hook configuration   |
| `test/pytest/pytest.ini`   | pytest-codeblocks discovery options          |
| `cypress.config.js`        | Cypress configuration                        |
| `compose.yaml`             | Docker Compose services for code block tests |
| `Dockerfile.pytest`        | pytest image definition                      |
| `.ci/vale/styles/`         | Vale rule configuration                      |
| `.ci/link-checker/`        | Link checker configuration                   |
| `test/`                    | Test scripts and shared test utilities       |
| `scripts/README.md`        | LLM markdown generation documentation        |
| `test/TEST-PERFORMANCE.md` | Code block test performance optimization     |

## Getting Help

- [docs-v2 issues](https://github.com/influxdata/docs-v2/issues)
- [Good first issues](https://github.com/influxdata/docs-v2/issues?q=is%3Aissue+is%3Aopen+label%3Agood-first-issue)
- [InfluxData CLA](https://www.influxdata.com/legal/cla/) (required for substantial contributions)
