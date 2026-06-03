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

| Decision                     | Choice                                                                                                                                                                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Direction                    | Rust is the production converter; remove JS conversion entirely                                                                                                                                                                                            |
| Parity bar                   | **Semantic parity** — diff the full corpus, fix all semantic diffs, document accepted cosmetic diffs                                                                                                                                                       |
| Binary delivery              | **Build from source in CI** (lockstep source/binary), plus a guarded local `postinstall`                                                                                                                                                                   |
| Fallback                     | **No silent fallback** — hard-fail loudly if the Rust binary can't load                                                                                                                                                                                    |
| `markdown-converter.cjs`     | **Delete it**; repoint consumers and `package.json` `exports` at the Rust module                                                                                                                                                                           |
| `date`/`lastmod` source      | **Rust extracts from the HTML head** `<meta name="last-modified">` (Hugo `.Lastmod`), same as `canonical`. No new param; API stays `(html, url_path, base_url)`. Keeps HTML parsing in Rust only (JS stays jsdom-free). Omitted if the meta tag is absent. |
| Section bundling ownership   | **Stays in JS** (`build-llm-markdown.js` `combineMarkdown`/`findSections`, untouched). It concatenates generated `.md` files, not HTML. The Rust `convert_section_to_markdown` binding is unused → removed.                                                |
| `pages` semantics            | **Preserve `children.length + 1`** (parent + children), the current active contract. Preserved automatically since section bundling is untouched.                                                                                                          |
| Legacy `html-to-markdown.js` | **Retire it** (and `build:md:legacy` / `build:md:verbose`). It is the only caller of `convertSectionToMarkdown`, not used in CI, and superseded by `build-llm-markdown.js`.                                                                                |
| docs-tooling                 | **Does not consume the converter** — removal is fully safe, no cross-repo coordination needed                                                                                                                                                              |
| Acceptance                   | All markdown e2e + integration tests pass                                                                                                                                                                                                                  |

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
3. Add Hugo-sourced `date`/`lastmod` extracted from the HTML head (intentional
   additive change). Remove `chrono::Utc::now()`; drop the `chrono` dependency
   if it becomes unused.
4. Match the post-#7294 field order.

The build script gains one responsibility: resolve `base_url` (port
`detectBaseUrl` from the deleted `.cjs`) and pass it to the binding, which it
currently does not.

### Converter API contract

The binding signature is unchanged:

```
convert_to_markdown(
  html_content: String,
  url_path: String,
  base_url: String,
) -> Option<String>
```

Inside the converter, Rust extracts two values from the HTML head (it already
DOM-parses the document):

- `canonical` from `<link rel="canonical">` — reflects the build host
  (localhost locally, production in CI), independent of the `url` field.
- `last_modified` from `<meta name="last-modified">`
  (`layouts/partials/header/coveo-meta-data.html`, Hugo `.Lastmod`), emitted as
  both `date` and `lastmod`. Omitted if the meta tag is absent (no build-time
  `now()` fallback).

Keeping both extractions in Rust means the JS build script never parses HTML,
so removing `jsdom` is clean. The caller's only new responsibility is supplying
`base_url`, which the deleted `.cjs` used to resolve internally
(`detectBaseUrl`, ported into the build script).

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

***

# Rust Markdown Converter Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Rust converter the one converter that runs in CI and staging, delete the JS conversion path, and ship the `.md` twins with no semantic regression.

**Architecture:** The active build (`build:md` → `scripts/build-llm-markdown.js`) keeps its two phases — per-page conversion (Phase 1) and JS section bundling (Phase 2, untouched). Phase 1 switches from the JS `.cjs` to the Rust napi module. Rust is built from source in CI and via a local `postinstall`. A diff harness gates parity against the post-#7294 JS baseline; a golden-snapshot test locks the contract going forward.

**Tech Stack:** Rust + napi-rs (`@napi-rs/cli`), Node ESM build scripts, CircleCI (`cimg/node`), Cypress, `node --test`.

***

## Sequencing note

Task 1 (rebase) is a hard prerequisite for the parity harness (Task 9) and the
Rust frontmatter task (Task 5), because the baseline field set (`publisher`,
`canonical`, exact order) lives only in post-#7294 master. Tasks 2–4 (build
wiring) and Task 6 (section/legacy removal) are independent of the rebase and
can be done first.

## File structure

- Modify: `scripts/rust-markdown-converter/src/lib.rs` — frontmatter struct + head extraction; remove section binding.
- Create: `scripts/build-rust-converter.js` — postinstall build (cargo-guarded).
- Create: `scripts/lib/base-url.js` — ported `detectBaseUrl` (ESM).
- Modify: `scripts/build-llm-markdown.js` — require Rust module, resolve+pass base\_url, hard-fail on load.
- Delete: `scripts/lib/markdown-converter.cjs`, `scripts/html-to-markdown.js`.
- Modify: `package.json` — `exports`, `postinstall`, remove deps + legacy scripts.
- Modify: `.circleci/config.yml` — Rust toolchain + `napi build` step.
- Create: `scripts/__tests__/markdown-parity.test.mjs` — golden-snapshot test + fixtures.
- Modify: `DOCS-TESTING.md` — frontmatter schema + architecture.

***

## Task 1: Rebase onto post-#7294 master and capture the JS baseline

**Files:** none (git + build artifacts)

- [ ] **Step 1: Rebase the branch onto current master**

```bash
git fetch origin
git rebase origin/master
```

Expected: clean rebase. Resolve conflicts if any (most likely in `package.json` scripts or `DOCS-TESTING.md`).

- [ ] **Step 2: Confirm #7294 frontmatter fields are present in the JS converter**

```bash
grep -nE "publisher|canonical" scripts/lib/markdown-converter.cjs
```

Expected: matches showing how `publisher` (constant) and `canonical` (from the page) are assembled. Note the exact field order in the frontmatter object — this is the contract Rust must mirror.

- [ ] **Step 3: Build the site and the JS baseline `.md`**

```bash
yarn build:ts
npx hugo --quiet --destination public
yarn build:md --public-dir public
```

Expected: `public/**/index.md` files exist (JS-generated).

- [ ] **Step 4: Snapshot the JS baseline for later diffing**

```bash
mkdir -p .parity-baseline
rsync -a --prune-empty-dirs --include='*/' --include='index.md' --exclude='*' public/ .parity-baseline/
echo ".parity-baseline/" >> .gitignore
```

Expected: `.parity-baseline/` mirrors every per-page `index.md`. This is the parity target. Do not commit it.

- [ ] **Step 5: Commit the rebase resolution only**

```bash
git add .gitignore
git commit -m "chore: ignore .parity-baseline snapshot dir"
```

***

## Task 2: Add a cargo-guarded local build (`postinstall`)

**Files:**

- Create: `scripts/build-rust-converter.js`

- Modify: `package.json:68` (postinstall)

- [ ] **Step 1: Write the build script**

Create `scripts/build-rust-converter.js`:

```js
#!/usr/bin/env node
/**
 * Build the Rust markdown converter napi module when a Rust toolchain is
 * present. Skips with a clear message otherwise so `yarn install` never fails
 * on machines without Rust. CI builds it explicitly (see .circleci/config.yml).
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const pkgDir = path.resolve('scripts/rust-markdown-converter');

function has(cmd) {
  try {
    execFileSync(cmd, ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

if (!has('cargo')) {
  console.log(
    'ℹ Skipping Rust converter build: cargo not found. ' +
      'Install Rust (https://rustup.rs) to build it locally, or rely on CI.'
  );
  process.exit(0);
}

console.log('🦀 Building Rust markdown converter...');
execFileSync('yarn', ['install', '--frozen-lockfile'], {
  cwd: pkgDir,
  stdio: 'inherit',
});
execFileSync('yarn', ['build'], { cwd: pkgDir, stdio: 'inherit' });

if (!existsSync(path.join(pkgDir, 'index.js'))) {
  console.error('✗ Rust build did not produce index.js');
  process.exit(1);
}
console.log('✓ Rust markdown converter built');
```

- [ ] **Step 2: Chain it into `postinstall`**

In `package.json`, change line 68:

```json
"postinstall": "node scripts/setup-local-bin.js && node scripts/build-rust-converter.js",
```

- [ ] **Step 3: Run it on a machine with cargo**

Run: `node scripts/build-rust-converter.js`
Expected: `✓ Rust markdown converter built`, and `scripts/rust-markdown-converter/index.js` + a `*.node` file exist.

- [ ] **Step 4: Verify the no-cargo path degrades gracefully**

Run: `PATH=/usr/bin node scripts/build-rust-converter.js` (a PATH without cargo)
Expected: prints the "Skipping Rust converter build" message and exits 0.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-rust-converter.js package.json
git commit -m "build: build Rust converter on postinstall when cargo is present"
```

***

## Task 3: Build Rust in CI before `build:md`

**Files:**

- Modify: `.circleci/config.yml` (build job, before the "Generate LLM-friendly Markdown" step at \~line 47)

- [ ] **Step 1: Add a Rust toolchain + build step**

In `.circleci/config.yml`, in the `build` job `steps:`, insert immediately before the `- run: name: Hugo Build` step:

```yaml
      - restore_cache:
          keys:
            - rust-{{ checksum "scripts/rust-markdown-converter/Cargo.toml" }}
            - rust-
      - run:
          name: Install Rust toolchain
          command: |
            curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
              | sh -s -- -y --profile minimal --default-toolchain stable
            echo 'source "$HOME/.cargo/env"' >> "$BASH_ENV"
      - run:
          name: Build Rust markdown converter
          command: |
            source "$HOME/.cargo/env"
            node scripts/build-rust-converter.js
      - save_cache:
          key: rust-{{ checksum "scripts/rust-markdown-converter/Cargo.toml" }}
          paths:
            - /home/circleci/.cargo
            - /home/circleci/.rustup
            - scripts/rust-markdown-converter/target
```

- [ ] **Step 2: Validate the CircleCI config**

Run: `npx --yes @circleci/circleci-config-validate .circleci/config.yml` (or `circleci config validate` if the CLI is installed)
Expected: config is valid. If neither validator is available, at minimum run `npx yaml-lint .circleci/config.yml` to confirm YAML parses.

- [ ] **Step 3: Commit**

```bash
git add .circleci/config.yml
git commit -m "ci: build Rust markdown converter before generating Markdown"
```

***

## Task 4: Remove the unused Rust section binding

**Files:**

- Modify: `scripts/rust-markdown-converter/src/lib.rs:606-669`

- [ ] **Step 1: Delete `convert_section_to_markdown` and `ChildPageInput`**

In `scripts/rust-markdown-converter/src/lib.rs`, remove the entire block from the doc comment above `ChildPageInput` (line \~606) through the end of `convert_section_to_markdown` (line \~669), including the `#[napi(object)] pub struct ChildPageInput { ... }` and both `#[napi]` items. Leave `convert_to_markdown` (above) and `detect_product_from_path` (below) intact.

- [ ] **Step 2: Build to confirm nothing else referenced it**

Run: `cd scripts/rust-markdown-converter && cargo build --release`
Expected: compiles with no errors (no remaining references to `ChildPageInput`).

- [ ] **Step 3: Commit**

```bash
git add scripts/rust-markdown-converter/src/lib.rs
git commit -m "refactor(rust): remove unused convert_section_to_markdown binding"
```

***

## Task 5: Bring the Rust per-page frontmatter to the post-#7294 contract

**Files:**

- Modify: `scripts/rust-markdown-converter/src/lib.rs` (the `Frontmatter` struct \~517-529, `generate_frontmatter` \~531-576, `convert_to_markdown` \~591-604, and `#[cfg(test)] mod tests`)

Target field set and order (from the post-#7294 sample): `title`, `description`, `url`, `estimated_tokens`, `product`, `version`, `publisher`, `canonical`, then the additive `date`, `lastmod`. **Verify the exact order against the rebased `markdown-converter.cjs` (Task 1, Step 2)** and match it; the diff harness (Task 9) is the final arbiter.

- [ ] **Step 1: Write failing unit tests for the new frontmatter**

Append to the `#[cfg(test)] mod tests` block in `lib.rs`:

```rust
    #[test]
    fn test_frontmatter_uses_version_and_publisher() {
        let html = r#"<html><head>
            <link rel="canonical" href="https://docs.influxdata.com/influxdb3/core/get-started/">
            <meta name="last-modified" content="2025-01-15T00:00:00Z">
          </head><body>
            <article class="article--content"><h1>Get started</h1><p>Body.</p></article>
          </body></html>"#;
        let out = convert_to_markdown(
            html.to_string(),
            "/influxdb3/core/get-started/".to_string(),
            "https://docs.influxdata.com".to_string(),
        )
        .unwrap()
        .unwrap();
        assert!(out.contains("\nversion: core\n"));
        assert!(!out.contains("product_version:"));
        assert!(out.contains("\npublisher: InfluxData\n"));
        assert!(out.contains("canonical: https://docs.influxdata.com/influxdb3/core/get-started/"));
        assert!(out.contains("date: 2025-01-15T00:00:00Z"));
        assert!(out.contains("lastmod: 2025-01-15T00:00:00Z"));
    }

    #[test]
    fn test_frontmatter_omits_timestamps_without_meta() {
        let html = r#"<html><head></head><body>
            <article class="article--content"><h1>No meta</h1><p>Body.</p></article>
          </body></html>"#;
        let out = convert_to_markdown(
            html.to_string(),
            "/influxdb3/core/x/".to_string(),
            "https://docs.influxdata.com".to_string(),
        )
        .unwrap()
        .unwrap();
        assert!(!out.contains("date:"));
        assert!(!out.contains("lastmod:"));
    }
```

- [ ] **Step 2: Run the tests to confirm they fail**

Run: `cd scripts/rust-markdown-converter && cargo test`
Expected: FAIL — current struct emits `product_version`, no `publisher`/`canonical`, and build-time timestamps.

- [ ] **Step 3: Add a head-extraction helper**

In `lib.rs`, add the helper below near the other parsing helpers. `scraper` is
already a dependency used by `extract_article_content`; reuse the existing
`use scraper::...` import rather than adding a duplicate. Confirm `Html` and
`Selector` are in scope (`grep -n "use scraper" src/lib.rs`) and extend that
line if needed instead of adding a new `use`.

```rust
/// Extract `<link rel="canonical">` href and `<meta name="last-modified">`
/// content from the document head. Returns (canonical, last_modified).
fn extract_head_metadata(html: &str) -> (Option<String>, Option<String>) {
    let doc = Html::parse_document(html);
    let canonical = Selector::parse(r#"link[rel="canonical"]"#)
        .ok()
        .and_then(|sel| doc.select(&sel).next())
        .and_then(|el| el.value().attr("href").map(str::to_string));
    let last_modified = Selector::parse(r#"meta[name="last-modified"]"#)
        .ok()
        .and_then(|sel| doc.select(&sel).next())
        .and_then(|el| el.value().attr("content").map(str::to_string))
        .filter(|s| !s.trim().is_empty());
    (canonical, last_modified)
}
```

- [ ] **Step 4: Update the `Frontmatter` struct to the target field set/order**

Replace the struct (\~517-529) with:

```rust
#[derive(Debug, Serialize)]
struct Frontmatter {
    title: String,
    description: String,
    url: String,
    estimated_tokens: usize,
    #[serde(skip_serializing_if = "Option::is_none")]
    product: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    version: Option<String>,
    publisher: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    canonical: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    lastmod: Option<String>,
}
```

- [ ] **Step 5: Update `generate_frontmatter` to accept head metadata and drop `chrono`**

Change the signature and body of `generate_frontmatter` to take `canonical` and `last_modified`, remove the `chrono::Utc::now()` block, and build the struct:

```rust
fn generate_frontmatter(
    title: &str,
    description: &str,
    url_path: &str,
    content_length: usize,
    base_url: &str,
    canonical: Option<String>,
    last_modified: Option<String>,
) -> String {
    let product = detect_product(url_path);

    let description = description
        .chars()
        .filter(|c| !c.is_control() || *c == '\n')
        .collect::<String>()
        .split_whitespace()
        .collect::<Vec<_>>()
        .join(" ")
        .chars()
        .take(500)
        .collect::<String>();

    let estimated_tokens = (content_length + 3) / 4;
    let full_url = format!("{}{}", base_url, url_path);

    let frontmatter = Frontmatter {
        title: title.to_string(),
        description,
        url: full_url,
        estimated_tokens,
        product: product.as_ref().map(|p| p.name.clone()),
        version: product.as_ref().map(|p| p.version.clone()),
        publisher: "InfluxData".to_string(),
        canonical,
        date: last_modified.clone(),
        lastmod: last_modified,
    };

    match serde_yaml::to_string(&frontmatter) {
        Ok(yaml) => format!("---\n{}---", yaml),
        Err(_) => "---\n---".to_string(),
    }
}
```

- [ ] **Step 6: Thread head metadata through `convert_to_markdown`**

Update `convert_to_markdown` to extract head metadata from the full HTML and pass it down:

```rust
#[napi]
pub fn convert_to_markdown(html_content: String, url_path: String, base_url: String) -> Result<Option<String>> {
    match extract_article_content(&html_content) {
        Some((title, description, content)) => {
            let markdown = html_to_markdown(&content, true);
            let (canonical, last_modified) = extract_head_metadata(&html_content);
            let frontmatter = generate_frontmatter(
                &title, &description, &url_path, markdown.len(), &base_url,
                canonical, last_modified,
            );
            Ok(Some(format!("{}\n\n{}\n", frontmatter, markdown)))
        }
        None => Ok(None),
    }
}
```

- [ ] **Step 7: Remove the now-unused `chrono` dependency**

In `scripts/rust-markdown-converter/Cargo.toml`, delete the `chrono = "0.4"` line. (If `cargo build` later reports `chrono` still used elsewhere, keep it; grep first: `grep -n chrono src/lib.rs`.)

- [ ] **Step 8: Run the tests to confirm they pass**

Run: `cd scripts/rust-markdown-converter && cargo test`
Expected: PASS, including the two new tests and the existing `test_product_detection` / `test_html_to_markdown`.

- [ ] **Step 9: Commit**

```bash
git add scripts/rust-markdown-converter/src/lib.rs scripts/rust-markdown-converter/Cargo.toml
git commit -m "feat(rust): match post-#7294 per-page frontmatter (version, publisher, canonical, Hugo timestamps)"
```

***

## Task 6: Port `detectBaseUrl` into the build script

**Files:**

- Create: `scripts/lib/base-url.js`

- [ ] **Step 1: Write the helper (ported verbatim from the `.cjs`)**

Create `scripts/lib/base-url.js`:

```js
/**
 * Detect the base URL for the current build environment.
 * Ported from the removed markdown-converter.cjs so the build script can pass
 * base_url to the Rust converter (which no longer resolves it internally).
 * @returns {string}
 */
export function detectBaseUrl() {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  if (
    process.env.HUGO_ENV === 'development' ||
    process.env.NODE_ENV === 'development'
  ) {
    return 'http://localhost:1313';
  }
  if (
    process.env.HUGO_ENV === 'staging' ||
    process.env.DEPLOY_ENV === 'staging'
  ) {
    return process.env.STAGING_URL || 'https://test2.docs.influxdata.com';
  }
  return 'https://docs.influxdata.com';
}
```

- [ ] **Step 2: Sanity-check the env mapping**

Run: `node -e "import('./scripts/lib/base-url.js').then(m=>{process.env.HUGO_ENV='staging';console.log(m.detectBaseUrl())})"`
Expected: `https://test2.docs.influxdata.com`

- [ ] **Step 3: Commit**

```bash
git add scripts/lib/base-url.js
git commit -m "refactor: extract detectBaseUrl helper for the build script"
```

***

## Task 7: Cut `build-llm-markdown.js` over to the Rust module

**Files:**

- Modify: `scripts/build-llm-markdown.js:22` and `:62-134`

- [ ] **Step 1: Replace the converter import and add a hard-fail load guard**

In `scripts/build-llm-markdown.js`, replace line 22:

```js
const { convertToMarkdown } = require('./lib/markdown-converter.cjs');
```

with:

```js
let convertToMarkdown;
try {
  ({ convertToMarkdown } = require('./rust-markdown-converter'));
} catch (err) {
  console.error(
    '✗ Rust markdown converter is not built.\n' +
      '  Build it with: node scripts/build-rust-converter.js\n' +
      `  (load error: ${err.message})`
  );
  process.exit(1);
}
```

Add the base-url import near the other imports (top of file, ESM):

```js
import { detectBaseUrl } from './lib/base-url.js';
```

- [ ] **Step 2: Resolve base\_url once and pass it to the converter**

In `buildPageMarkdown`, compute the base URL once after `const startTime = Date.now();` (around line 66):

```js
  const baseUrl = detectBaseUrl();
```

Then change the call at line 134 from:

```js
        const markdown = await convertToMarkdown(html, urlPath);
```

to:

```js
        const markdown = await convertToMarkdown(html, urlPath, baseUrl);
```

- [ ] **Step 3: Smoke-test conversion on a small subset**

Run:

```bash
npx hugo --quiet --destination public
yarn build:md --public-dir public --only-changed --base-branch HEAD~1
head -20 public/influxdb3/core/get-started/index.md
```

Expected: frontmatter shows `version:`, `publisher: InfluxData`, `canonical:`, and `date`/`lastmod`. No `product_version`. Process exits 0 (converter loaded).

- [ ] **Step 4: Commit**

```bash
git add scripts/build-llm-markdown.js
git commit -m "feat: generate per-page Markdown with the Rust converter"
```

***

## Task 8: Delete the JS converter, retire the legacy script, drop deps

**Files:**

- Delete: `scripts/lib/markdown-converter.cjs`, `scripts/html-to-markdown.js`

- Modify: `package.json` (`exports`, scripts, deps)

- [ ] **Step 1: Delete the JS converter and the legacy CLI**

```bash
git rm scripts/lib/markdown-converter.cjs scripts/html-to-markdown.js
```

- [ ] **Step 2: Repoint `exports` and remove legacy/dep entries in `package.json`**

- Change `exports` (line 8):
  ```json
  "./markdown-converter": "./scripts/rust-markdown-converter/index.js",
  ```

- Remove the `build:md:legacy` and `build:md:verbose` script lines.

- Remove `turndown`, `@types/turndown`, and `jsdom` from `dependencies`.

- [ ] **Step 3: Confirm nothing else imports the removed modules**

Run:

```bash
grep -rnE "markdown-converter\.cjs|html-to-markdown|require\('turndown'\)|from 'turndown'|jsdom" scripts/ deploy/ | grep -v node_modules
```

Expected: no matches (the only remaining `markdown-converter` references are `dist/`/docs, not code imports). If a match appears, fix that consumer before continuing.

- [ ] **Step 4: Reinstall and verify the active build still runs**

Run:

```bash
yarn install
yarn build:md --public-dir public --only-changed --base-branch HEAD~1
```

Expected: install succeeds without `turndown`/`jsdom`; `build:md` exits 0.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove JS markdown converter, legacy CLI, and turndown/jsdom deps"
```

***

## Task 9: Migration parity gate (per-page diff harness)

**Files:**

- Create: `scripts/parity-diff.mjs` (one-time migration tool, kept in-tree for re-runs)

- [ ] **Step 1: Write the diff harness**

Create `scripts/parity-diff.mjs`:

```js
#!/usr/bin/env node
/**
 * Compare the JS baseline (.parity-baseline/) against current Rust-generated
 * per-page Markdown (public/). Reports per-file diffs and a summary so each can
 * be classified semantic vs cosmetic. Exit 1 if any file differs.
 *
 * Usage: node scripts/parity-diff.mjs [baselineDir] [currentDir]
 */
import { glob } from 'glob';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseDir = process.argv[2] || '.parity-baseline';
const curDir = process.argv[3] || 'public';

const files = await glob(`${baseDir}/**/index.md`);
let differing = 0;
for (const baseFile of files) {
  const rel = path.relative(baseDir, baseFile);
  const curFile = path.join(curDir, rel);
  let cur;
  try {
    cur = await fs.readFile(curFile, 'utf-8');
  } catch {
    console.log(`MISSING  ${rel}`);
    differing++;
    continue;
  }
  const base = await fs.readFile(baseFile, 'utf-8');
  if (base !== cur) {
    differing++;
    console.log(`DIFF     ${rel}`);
  }
}
console.log(
  `\n${differing} of ${files.length} pages differ between baseline and Rust output.`
);
// Diagnostic, not a gate: every page is expected to differ by the added
// date/lastmod lines. The reviewer classifies the DIFFs (Step 3); the real
// gates are the golden test (Task 10) and the acceptance suite (Task 11).
```

Note: this harness flags a page whenever the bytes differ, so the intentional
`date`/`lastmod` additions make nearly every page show `DIFF`. That is expected
— use the per-file diff in Step 3 to confirm the *only* differences are those
additions plus accepted cosmetic engine differences.

- [ ] **Step 2: Regenerate with Rust and run the harness**

```bash
npx hugo --quiet --destination public
yarn build:md --public-dir public
node scripts/parity-diff.mjs | tee parity-report.txt
```

Expected: a list of `DIFF` lines and a count. Most diffs should be the intentional additions (`date`/`lastmod`) plus cosmetic engine differences.

- [ ] **Step 3: Classify and reconcile**

For a representative sample across products (Core, Cloud Dedicated, Telegraf, v1, Flux), open each `DIFF` page and compare `.parity-baseline/<path>` to `public/<path>`:

- **Semantic** (lost content, broken/changed code fence, malformed YAML frontmatter, dropped or altered link target) → fix in `lib.rs` (`html_to_markdown`, callout/table handling, or strip-list) and re-run Steps 2–3.
- **Cosmetic** (whitespace, list-marker spacing, escaping, the expected `date`/`lastmod` additions) → record in `parity-report.txt` under an "Accepted cosmetic diffs" heading.

Repeat until zero semantic diffs remain.

- [ ] **Step 4: Record the accepted-diffs summary in the PR**

Paste the "Accepted cosmetic diffs" list into the PR description. Do not commit `parity-report.txt` or `.parity-baseline/` (gitignored).

- [ ] **Step 5: Commit any Rust fixes made during reconciliation**

```bash
git add scripts/parity-diff.mjs scripts/rust-markdown-converter/src/lib.rs
git commit -m "test: add per-page parity diff harness and reconcile semantic diffs"
```

***

## Task 10: Golden-snapshot regression test

**Files:**

- Create: `scripts/__tests__/fixtures/get-started.html`, `scripts/__tests__/fixtures/get-started.expected.md`

- Create: `scripts/__tests__/markdown-parity.test.mjs`

- [ ] **Step 1: Capture a real page as the fixture input**

```bash
mkdir -p scripts/__tests__/fixtures
cp public/influxdb3/core/get-started/index.html scripts/__tests__/fixtures/get-started.html
```

- [ ] **Step 2: Generate the expected output and eyeball it**

```bash
node -e "const {convertToMarkdown}=require('./scripts/rust-markdown-converter'); const fs=require('fs'); fs.writeFileSync('scripts/__tests__/fixtures/get-started.expected.md', convertToMarkdown(fs.readFileSync('scripts/__tests__/fixtures/get-started.html','utf-8'), '/influxdb3/core/get-started/', 'https://docs.influxdata.com'));"
head -15 scripts/__tests__/fixtures/get-started.expected.md
```

Expected: valid frontmatter with the full field set; sane body. Confirm by eye before locking it as the golden file.

- [ ] **Step 3: Write the golden test**

Create `scripts/__tests__/markdown-parity.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { convertToMarkdown } = require('../rust-markdown-converter');

const FIXTURE = new URL('./fixtures/get-started.html', import.meta.url);
const EXPECTED = new URL('./fixtures/get-started.expected.md', import.meta.url);

test('Rust converter output matches the golden snapshot', () => {
  const html = readFileSync(FIXTURE, 'utf-8');
  const out = convertToMarkdown(
    html,
    '/influxdb3/core/get-started/',
    'https://docs.influxdata.com'
  );
  assert.equal(out, readFileSync(EXPECTED, 'utf-8'));
});

test('frontmatter uses the post-#7294 contract', () => {
  const html = readFileSync(FIXTURE, 'utf-8');
  const out = convertToMarkdown(
    html,
    '/influxdb3/core/get-started/',
    'https://docs.influxdata.com'
  );
  assert.match(out, /\nversion: core\n/);
  assert.match(out, /\npublisher: InfluxData\n/);
  assert.doesNotMatch(out, /product_version:/);
});
```

- [ ] **Step 4: Add a test script and run it**

In `package.json` scripts, add:

```json
"test:markdown-parity": "node --test scripts/__tests__/markdown-parity.test.mjs",
```

Run: `yarn test:markdown-parity`
Expected: both tests PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/__tests__/fixtures scripts/__tests__/markdown-parity.test.mjs package.json
git commit -m "test: lock the Rust converter frontmatter/body with a golden snapshot"
```

***

## Task 11: Run the full acceptance suite

**Files:** none (verification)

- [ ] **Step 1: Full build with Rust**

```bash
yarn build:ts
npx hugo --quiet --destination public
yarn build:md --public-dir public
yarn build:llms-full --public-dir public
```

Expected: all succeed; `public/**/index.md`, `index.section.md`, and `llms-full.txt` present.

- [ ] **Step 2: Coherence + corpus tests**

```bash
yarn check:md-coherence --public-dir public
yarn test:build-llms-full
yarn test:corpus-paths
```

Expected: all PASS.

- [ ] **Step 3: Cypress markdown validation**

```bash
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/markdown-content-validation.cy.js"
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/markdown-autodiscovery.cy.js"
```

Expected: both specs PASS (no raw shortcodes, valid frontmatter, callouts/tables/links intact, autodiscovery coherent).

- [ ] **Step 4: Markdown-parity + Rust unit tests**

```bash
yarn test:markdown-parity
cd scripts/rust-markdown-converter && cargo test && cd -
```

Expected: all PASS.

- [ ] **Step 5: If anything fails, fix at the source and re-run**

Any Cypress failure about frontmatter or stripped UI is a Rust converter fix (`lib.rs`), then re-run Steps 1–4. Do not weaken the tests to pass.

***

## Task 12: Update documentation

**Files:**

- Modify: `DOCS-TESTING.md` (frontmatter schema + architecture sections)

- [ ] **Step 1: Update the architecture diagram and "Related Files"**

In `DOCS-TESTING.md`, replace references to `scripts/lib/markdown-converter.js`/`.cjs` as the conversion engine with `scripts/rust-markdown-converter/` (Rust + napi). State that `build-llm-markdown.js` Phase 1 calls the Rust module and Phase 2 (`combineMarkdown`) builds section bundles in JS. Remove the legacy `html-to-markdown.js` / `build:md:legacy` mentions.

- [ ] **Step 2: Align the documented frontmatter schema to the Rust contract**

Update the frontmatter example fields to the actual emitted set/order: `title`, `description`, `url`, `estimated_tokens`, `product`, `version`, `publisher`, `canonical`, `date`, `lastmod`, and for sections `type`, `pages` (= parent + children), `child_pages`.

- [ ] **Step 3: Lint the docs change**

Run: `.ci/vale/vale.sh DOCS-TESTING.md`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add DOCS-TESTING.md
git commit -m "docs: document the Rust converter and its frontmatter contract"
```

***

## Spec coverage map

| Spec section                      | Task(s)                     |
| --------------------------------- | --------------------------- |
| Wire Rust into CI (§1)            | 2, 3                        |
| No silent fallback (§2)           | 7 (load guard)              |
| Delete JS + legacy + deps (§3)    | 4, 8                        |
| Pin frontmatter contract (§4)     | 5, 10, 12                   |
| Golden-snapshot test (§5)         | 10                          |
| Migration parity gate (§6)        | 1, 9                        |
| Acceptance gate (§7)              | 11                          |
| date/lastmod from Hugo, base\_url | 5, 6, 7                     |
| Section bundling stays in JS      | (untouched; verified in 11) |
