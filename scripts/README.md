# Documentation Build Scripts

## build-llm-markdown.js

Generates LLM-friendly Markdown twins (`index.md`) and section bundles
(`index.section.md`) from the Hugo-built HTML in `public/`. Run after `npx hugo`.

```bash
# Generate all twins (run after a Hugo build)
yarn build:md --public-dir public

# Only pages changed since a base branch (PR/incremental builds)
yarn build:md --public-dir public --only-changed --base-branch origin/master

# Target a path subtree (used by tests/local spot-checks)
yarn build:md --public-dir public --path influxdb3/core/get-started

# Cap the number of pages (after path filtering)
yarn build:md --public-dir public --path influxdb3/enterprise --limit 1
```

### Architecture

The build splits into two phases:

- **Phase 1 — per-page conversion (Rust).** `convertToMarkdown(html, urlPath,
  baseUrl)` from the Rust napi module (`scripts/rust-markdown-converter/`,
  html2md + scraper) converts each page's `article.article--content` to Markdown
  and emits the base frontmatter. The build hard-fails if the Rust module isn't
  built (no silent JS fallback). Build it with
  `node scripts/build-rust-converter.js` (runs automatically on `postinstall`
  when `cargo` is present; CI builds it explicitly).
- **Phase 2 — section bundles (JS).** `combineMarkdown` concatenates the
  already-generated per-page `.md` into `index.section.md` (parent + children),
  emitting section frontmatter (`type: section`, `pages`, `child_pages`).

After conversion, a JS provenance post-step (`scripts/lib/provenance.js`) stamps
`publisher`, `canonical`, and per-page `date`/`lastmod` (from
`public/sitemap-md.xml`). These are deliberately not emitted by the converter,
which keeps it an exact drop-in.

### Frontmatter

The converter emits exactly these base fields:

```yaml
---
title: Get started with InfluxDB 3 Core
description: ...
url: https://docs.influxdata.com/influxdb3/core/get-started/
estimated_tokens: 1353
product: InfluxDB 3 Core
version: core
---
```

`version` is the docs edition slug (`core`, `enterprise`, `v2`, …), not a
software release (see docs-v2 #7299). The provenance post-step then adds
`publisher`, `canonical`, `date`, and `lastmod`. The body h1 (page title) is
omitted — the title is in frontmatter, matching the API-reference twins.

Product detection is configuration: `scripts/rust-markdown-converter/build.rs`
reads `data/products.yml` at build time and bakes the URL→product map.

### Outputs

- Location: `public/**/index.md` and `public/**/index.section.md`
- Git status: ignored (the whole `public/` directory is gitignored)
- Deployment: generated at build time, like the API docs

### CI

CircleCI builds the Rust converter (cached rustup toolchain) before `build:md`.
On `master` it runs the full build; on PRs it runs `--only-changed`.

### Tests

```bash
yarn test:build-md             # build-llm-markdown + provenance unit tests
yarn test:markdown-parity      # golden-snapshot of converter output
yarn test:markdown-completeness# pages/sections not truncated vs source
node scripts/parity-scan.mjs public .parity-baseline  # corpus parity scan
cd scripts/rust-markdown-converter && cargo test       # converter unit tests
```

### See Also

- [DOCS-TESTING.md](../DOCS-TESTING.md) — LLM-friendly Markdown generation
- [api-docs/README.md](../api-docs/README.md) — API reference generation
- [package.json](../package.json) — build commands
