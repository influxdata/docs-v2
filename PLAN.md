# Design: Rust becomes the production Markdown converter; JS removed

Status: design approved, ready for implementation planning.
Branch artifact only — CI scrubs `PLAN.md` before merge to `master`.

## Problem

The repo ships two HTML→Markdown converters that generate the `.md` "twins" of
every docs page:

- A JavaScript converter (`scripts/lib/markdown-converter.cjs`, turndown + jsdom).
- A Rust converter (`scripts/rust-markdown-converter/`, html2md + scraper,
  \~10x faster, exposed to Node via napi-rs).

`markdown-converter.cjs` tries to `require()` the compiled Rust module and, on
failure, **silently** falls back to JS with only a `console.log`. The Rust build
outputs (`*.node`, `index.js`) are gitignored, and nothing in CI, the staging
deploy, or `package.json` ever runs `napi build`. So:

- Local clones where someone once ran `napi build` load Rust.
- A fresh worktree, CI (`cimg/node:24.5.0`, no Rust toolchain), and staging all
  silently use JS.

The result: the 10x-faster converter has never run in CI or production. The
silent fallback hid the gap. This design wires Rust in as the one production
converter, deletes the JS conversion path, and guarantees no regression in the
generated Markdown.

## Goal

CI and staging generate the `.md` twins with the Rust converter. The JS
conversion path is deleted. No semantic regressions in output. All e2e and
integration tests pass.

## Constraints and decisions

| Decision                     | Choice                                                                                                                                                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Direction                    | Rust is the production converter; remove JS conversion entirely                                                                                                                                             |
| Parity bar                   | **Semantic parity** — diff the full corpus, fix all semantic diffs, document accepted cosmetic diffs                                                                                                        |
| Binary delivery              | **Build from source in CI** (lockstep source/binary), plus a guarded local `postinstall`                                                                                                                    |
| Fallback                     | **No silent fallback** — hard-fail loudly if the Rust binary can't load                                                                                                                                     |
| `markdown-converter.cjs`     | **Delete it**; repoint consumers and `package.json` `exports` at the Rust module                                                                                                                            |
| `date`/`lastmod` source      | **Caller passes explicit ISO-8601 params**; build script reads them from the page HTML `<meta name="last-modified">` (already emitted by Hugo). Converter stays decoupled from Hugo templates.              |
| Section bundling ownership   | **Stays in JS** (`build-llm-markdown.js` `combineMarkdown`/`findSections`, untouched). It concatenates generated `.md` files, not HTML. The Rust `convert_section_to_markdown` binding is unused → removed. |
| `pages` semantics            | **Preserve `children.length + 1`** (parent + children), the current active contract. Preserved automatically since section bundling is untouched.                                                           |
| Legacy `html-to-markdown.js` | **Retire it** (and `build:md:legacy` / `build:md:verbose`). It is the only caller of `convertSectionToMarkdown`, not used in CI, and superseded by `build-llm-markdown.js`.                                 |
| docs-tooling                 | **Does not consume the converter** — removal is fully safe, no cross-repo coordination needed                                                                                                               |
| Acceptance                   | All markdown e2e + integration tests pass                                                                                                                                                                   |

## Current state (verified)

- Runtime consumers of the converter in this repo: `scripts/build-llm-markdown.js`
  (active `build:md`) and `scripts/html-to-markdown.js` (legacy `build:md:legacy`).
  Both `require('./lib/markdown-converter.cjs')`.
- `package.json` `exports: "./markdown-converter"` points at the `.cjs`. No
  external repo consumes it (docs-tooling does not use the converter).
- The Rust `lib.rs` is a **full** reimplementation: it emits frontmatter and
  product detection, not just the HTML→MD body.
- **Product mappings are already configuration on the Rust side.** `build.rs`
  reads `data/products.yml` at build time (`cargo:rerun-if-changed`) and
  generates the URL→product map. The JS converter hardcodes its own copy
  (`URL_PATTERN_MAP` / `PRODUCT_NAME_MAP`). The dying JS maps are **not** ported.
- `turndown`, `@types/turndown`, and `jsdom` are used only by the JS conversion
  path (the `jsdom` mention in `build-llm-markdown.js` is a comment). All
  removable.
- The abandoned Lambda\@Edge markdown-generator references have already been
  removed from `.gitignore`, `DOCS-TESTING.md`, and `scripts/html-to-markdown.js`.
  The live `DocsOriginRequestRewriteLambda` (`deploy/edge.js`,
  `deploy/docs-website.yml`) is a separate URL-rewrite function and stays.

## Two converters, two scopes (clarified)

The active CI path (`build:md` → `scripts/build-llm-markdown.js`) splits work:

- **Per-page conversion (Phase 1):** calls `convertToMarkdown(html, urlPath)` —
  the only converter binding the active path uses. This is what Rust replaces.
- **Section bundles (Phase 2):** `combineMarkdown` reads the already-generated
  per-page `.md` files and concatenates them into `index.section.md`, emitting
  section frontmatter (`type: section`, `pages: children + 1`, `child_pages`,
  summed `estimated_tokens`). This is pure JS string/IO work over `.md` files,
  not HTML. **It stays in JS, untouched.**

So the Rust `convert_section_to_markdown` binding is never used by the active
path — it is reachable only from the legacy `html-to-markdown.js`, which is
retired. The migration's parity scope is therefore **per-page conversion only**;
section frontmatter is preserved by construction.

## The real parity work: fix the existing per-page frontmatter drift

The per-page JS and Rust converters have already silently diverged. Before Rust
becomes canonical, fix the drift:

Parity baseline = **post-#7294 master output** (rebase before implementing).
The diff harness compares against actual current output, so the live field set
is captured automatically — it does not hardcode a field list. The sourcing of
each field below must be read from the post-#7294 JS at implementation time.

| Per-page field    | Post-#7294 JS                                                      | Current Rust                | Action                                                                                                                       |
| ----------------- | ------------------------------------------------------------------ | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `version`         | `version:`                                                         | `product_version:`          | rename in Rust                                                                                                               |
| `publisher`       | `InfluxData` (constant)                                            | missing                     | add (constant)                                                                                                               |
| `canonical`       | from page `<link rel="canonical">` (localhost locally, prod in CI) | missing                     | add; extract from HTML, do **not** compute from `base_url`                                                                   |
| `url`             | from `base_url` + path                                             | from `base_url` + path      | unchanged                                                                                                                    |
| `date`/`lastmod`  | **omitted**                                                        | build-time `now()` (churns) | add from Hugo `.Lastmod` via `<meta name="last-modified">` (intentional additive change; harness expects them on every page) |
| HTML strip-list   | \~12 selectors, 2 lists                                            | \~20 selectors              | reconcile (no content loss)                                                                                                  |
| conversion engine | turndown/jsdom                                                     | html2md/scraper             | html2md/scraper                                                                                                              |

Required Rust changes before cutover:

1. Rename frontmatter field `product_version` → `version`.
2. Add `publisher` (constant `InfluxData`) and `canonical` (extracted from the
   page's `<link rel="canonical">`, not computed from `base_url`). Match the
   exact sourcing in the post-#7294 JS.
3. Add Hugo-sourced `date`/`lastmod` via the caller contract below (intentional
   additive change). Remove `chrono::Utc::now()`; drop the `chrono` dependency
   if it becomes unused.
4. Match the post-#7294 field order.

### Converter API contract

`convert_to_markdown` gains explicit timestamp parameters so output is
deterministic and the converter does not parse Hugo-specific markup:

```
convert_to_markdown(
  html_content: String,
  url_path: String,
  base_url: String,
  last_modified: String,   // ISO-8601; emitted as both `date` and `lastmod`
) -> Option<String>
```

`build-llm-markdown.js` sources `last_modified` from the page HTML it already
loads, reading the existing `<meta name="last-modified">`
(`layouts/partials/header/coveo-meta-data.html`). No Hugo template change is
required. If the meta tag is absent for a page, the converter omits the
timestamps rather than stamping build time.

`canonical` is likewise extracted from the page HTML (`<link rel="canonical">`)
inside the converter — not passed in and not derived from `base_url`. This
preserves the post-#7294 behavior where `canonical` reflects the build host
(localhost locally, production in CI) independently of the `url` field.

The `convert_section_to_markdown` binding is removed.

## Design

### 1. Wire Rust into CI (build from source, lockstep)

- Add a step to the CircleCI `build` job: install a cached rustup toolchain
  (cache `~/.cargo`, `~/.rustup`, and `scripts/rust-markdown-converter/target/`)
  and run `napi build --release` in `scripts/rust-markdown-converter/`
  (target `x86_64-unknown-linux-gnu`) **before** `build:md`.
- Add a guarded `postinstall` that builds the binary locally when `cargo` is
  present; when absent, print install instructions rather than failing
  `yarn install`.
- Build outputs stay gitignored (binaries never committed).

### 2. Remove the silent fallback

Replace `catch { console.log('using JS') }` with a loud hard-fail that explains
how to build the binary. A converter that silently degrades is the root cause
this work exists.

### 3. Delete the JS converter and the legacy entrypoint

- Delete `scripts/lib/markdown-converter.cjs`.
- Repoint `build-llm-markdown.js` and `package.json` `exports` directly at the
  Rust napi module.
- Retire the legacy `scripts/html-to-markdown.js` and its npm scripts
  (`build:md:legacy`, `build:md:verbose`). It is the only `convertSectionToMarkdown`
  caller, is not used in CI, and is superseded by `build-llm-markdown.js`.
- Remove the unused Rust `convert_section_to_markdown` binding.
- Remove `turndown`, `@types/turndown`, `jsdom` from `package.json`.

### 4. Pin the frontmatter contract as one definition

Product mappings already have one source (`data/products.yml` via `build.rs`) —
keep that model. Make the Rust frontmatter struct the single source for the
frontmatter field set, and align `DOCS-TESTING.md` to it. This converts an
implicit, drift-prone contract (duplicated across JS code, Rust, and doc prose)
into one enforced definition.

### 5. Golden-snapshot regression test

Once JS is gone, parity can no longer be JS-vs-Rust. Add a golden-snapshot test:
a small fixture corpus of representative HTML pages with checked-in expected
`.md`, run via `cargo test` and a Node integration test. Locks the frontmatter
and conversion contract so it cannot silently drift again, and satisfies the
"every PR with testable code ships a test" rule.

### 6. Migration parity gate (one-time)

Prerequisite: **rebase the branch onto post-#7294 master** so the baseline
includes the current frontmatter contract (`publisher`, `canonical`).

Scope: **per-page `index.md`** output (section bundles are unchanged JS, so
they need only the coherence check, not a converter diff). A harness that:

1. Captures post-#7294 JS per-page output as a baseline over the built `public/`
   corpus.
2. Generates Rust per-page output over the same corpus.
3. Diffs every page, classifying each diff:
   - **Semantic** (lost content, broken code fence, malformed frontmatter,
     dropped/altered link) → must fix in Rust.
   - **Cosmetic** (whitespace, escaping) → accept and record.
4. Passes at zero semantic diffs. Accepted cosmetic diffs are documented in the
   PR.

### 7. Acceptance gate

The reimplementation is done only when all pass:

- `cypress/e2e/content/markdown-content-validation.cy.js`
- `cypress/e2e/content/markdown-autodiscovery.cy.js`
- `scripts/__tests__/build-llms-full-txt.test.mjs`
- `scripts/__tests__/corpus-paths.test.mjs`
- `yarn check:md-coherence`
- the new golden-snapshot test (`cargo test` + Node integration)

## Out of scope (follow-up issue)

The CLI (`scripts/docs-cli/lib/product-resolver.js`) and TypeScript
(`assets/js/utils/product-mappings.ts`) also hardcode the URL→product map.
Unifying all three onto `data/products.yml` is a real content-as-data cleanup,
but it is a different feature area from "Rust converter in CI." File it as a
separate issue rather than expanding this migration's scope.
