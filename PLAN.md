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

| Decision                     | Choice                                                                                                                                                                                                                                         |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Direction                    | Rust is the production converter; remove JS conversion entirely                                                                                                                                                                                |
| Parity bar                   | **Semantic parity** — diff the full corpus, fix all semantic diffs, document accepted cosmetic diffs                                                                                                                                           |
| Binary delivery              | **Build from source in CI** (lockstep source/binary), plus a guarded local `postinstall`                                                                                                                                                       |
| Fallback                     | **No silent fallback** — hard-fail loudly if the Rust binary can't load                                                                                                                                                                        |
| `markdown-converter.cjs`     | **Delete it**; repoint consumers and `package.json` `exports` at the Rust module                                                                                                                                                               |
| `publisher`/`canonical`      | **JS post-step, not the converter.** #7294 added `scripts/lib/provenance.js`; `injectPageProvenance` (per page) and `combineMarkdown` (sections) stamp them after conversion. It is converter-agnostic by design. Rust does **not** emit them. |
| `date`/`lastmod`             | **JS post-step too** — fold into `injectPageProvenance`, sourced from `sitemap-md.xml` `<lastmod>` (per page only). Keeps Rust an exact drop-in; near-zero build cost (one sitemap parse at startup, O(1)/page). Rust does **not** emit them.  |
| Rust converter scope         | **Exact drop-in.** Emits only `title`, `description`, `url`, `estimated_tokens`, `product`, `version` — matching the post-#7294 JS converter field-for-field. API stays `(html, url_path, base_url)`; no HTML-head extraction.                 |
| Section bundling ownership   | **Stays in JS** (`build-llm-markdown.js` `combineMarkdown`/`findSections`, untouched). It concatenates generated `.md` files, not HTML. The Rust `convert_section_to_markdown` binding is unused → removed.                                    |
| `pages` semantics            | **Preserve `children.length + 1`** (parent + children), the current active contract. Preserved automatically since section bundling is untouched.                                                                                              |
| Legacy `html-to-markdown.js` | **Retire it** (and `build:md:legacy` / `build:md:verbose`). It is the only caller of `convertSectionToMarkdown`, not used in CI, and superseded by `build-llm-markdown.js`.                                                                    |
| docs-tooling                 | **Does not consume the converter** — removal is fully safe, no cross-repo coordination needed                                                                                                                                                  |
| Acceptance                   | All markdown e2e + integration tests pass                                                                                                                                                                                                      |

## Current state (verified)

- Runtime consumers of the converter in this repo: `scripts/build-llm-markdown.js`
  (active `build:md`) and `scripts/html-to-markdown.js` (legacy `build:md:legacy`).
  Both `require('./lib/markdown-converter.cjs')`.
- `package.json` `exports: "./markdown-converter"` points at the `.cjs`. No
  external repo consumes it (docs-tooling does not use the converter).
- **`publisher`/`canonical` are added by a JS post-step, not the converter.**
  \#7294 added `scripts/lib/provenance.js`. `build-llm-markdown.js:154` calls
  `injectPageProvenance(markdown, { publisher, canonical })` after conversion
  (`canonical` = sitemap `origin` + `urlPath`); `combineMarkdown` does the same
  for sections. `injectPageProvenance` is documented converter-agnostic. #7294
  also added `test:build-md` (`build-llm-markdown.test.mjs`, `provenance.test.mjs`)
  — part of the acceptance gate; both stay green untouched.
- The post-#7294 JS converter base frontmatter
  (`markdown-converter.cjs:501-513`) emits exactly `title`, `description`,
  `url`, `estimated_tokens`, `product`, `version`. This is the Rust drop-in
  target.
- The Rust `lib.rs` is a **full** reimplementation: it emits frontmatter and
  product detection, not just the HTML→MD body. It currently emits
  `product_version` (not `version`) and build-time `date`/`lastmod` — both must
  change (rename, and remove timestamps) to become a drop-in.
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

## The real parity work: make Rust an exact drop-in

The Rust converter must emit the **same base frontmatter as the post-#7294 JS
converter**, field-for-field, so the JS post-steps (provenance, timestamps)
layer on identically. The converter's only job is the six base fields;
everything else is JS.

| Per-page base field     | Post-#7294 JS               | Current Rust       | Action               |
| ----------------------- | --------------------------- | ------------------ | -------------------- |
| `title`                 | ✓                           | ✓                  | unchanged            |
| `description`           | ✓                           | ✓                  | unchanged            |
| `url`                   | `base_url` + path           | `base_url` + path  | unchanged            |
| `estimated_tokens`      | ✓                           | ✓                  | unchanged            |
| `product`               | ✓ (optional)                | ✓ (optional)       | unchanged            |
| `version`               | `version:`                  | `product_version:` | rename in Rust       |
| `date`/`lastmod`        | added later by JS post-step | build-time `now()` | **remove** from Rust |
| `publisher`/`canonical` | added later by JS post-step | not emitted        | keep not-emitted     |
| conversion engine       | turndown/jsdom              | html2md/scraper    | html2md/scraper      |

Required Rust changes before cutover:

1. Rename frontmatter field `product_version` → `version`.
2. **Remove** `date`/`lastmod` from the Rust frontmatter (the JS post-step owns
   them now). Remove `chrono::Utc::now()`; drop the `chrono` dependency if it
   becomes unused.
3. Match the post-#7294 base field order exactly: `title`, `description`,
   `url`, `estimated_tokens`, `product`, `version`.

The build script gains one responsibility: resolve `base_url` (port
`detectBaseUrl` from the deleted `.cjs`) and pass it to the binding, which it
currently does not (`build-llm-markdown.js:144` calls it with two args).

### Converter API contract

The binding signature is unchanged, and Rust does **no** HTML-head extraction:

```
convert_to_markdown(
  html_content: String,
  url_path: String,
  base_url: String,
) -> Option<String>   // frontmatter: title, description, url,
                      //   estimated_tokens, product?, version?
```

`publisher`, `canonical`, `date`, and `lastmod` are added afterward in JS:

- `injectPageProvenance` (`scripts/lib/provenance.js`) already stamps
  `publisher` and `canonical` (= sitemap `origin` + `urlPath`). It is
  converter-agnostic.
- Extend the same step to also stamp `date`/`lastmod` from `sitemap-md.xml`
  `<lastmod>` (per page). One parse at startup builds a `urlPath → lastmod`
  Map; O(1) per page. Sections keep provenance only (no per-page timestamp).

The caller's only new responsibility is supplying `base_url`, which the deleted
`.cjs` resolved internally (`detectBaseUrl`, ported into the build script).

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

**Frontmatter `version` semantics → [#7299](https://github.com/influxdata/docs-v2/issues/7299).**
The emitted `version` field is the docs edition slug (`core`, `enterprise`, …),
not a software release; the real release (`latest_patch`, e.g. `3.9.3`) is never
surfaced. Clarifying the key (e.g. `edition`) and optionally adding a real
release field is a frontmatter-contract change affecting all twins + consumers,
so it stays out of this migration. **This migration keeps `version: <slug>` for
drop-in parity with the post-#7294 JS baseline.**

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

## Execution status / handoff (read this first)

Branch: `worktree-fix-rust-markdown-conversion`, rebased onto `origin/master`
(includes #7294). Work in this worktree; use relative paths.

**Done and committed:**

- **Task 1 — rebase + baseline.** Rebased onto post-#7294 master. JS baseline
  captured at `.parity-baseline/` (4,684 per-page `index.md`, gitignored, on
  disk in this worktree). It is the pre-migration reference for Task 9/10b — do
  **not** regenerate it after the cutover (Task 7). A fresh *clone* (not this
  worktree) must rebuild it from pre-cutover state before Task 7 using Task 1's
  build+snapshot steps.
- **Task 2 — postinstall Rust build** (`scripts/build-rust-converter.js`,
  chained into `postinstall`), plus the **napi CLI v2 pin** prerequisite
  (commit `064b28d7a`). The Rust module currently builds and loads.

**Environment (verified):** cargo 1.95, hugo 0.157 extended, node 26, yarn 1.22.
The Rust binary is currently built but reflects the *current* `lib.rs`
(`product_version`, build-time timestamps). After any `lib.rs` edit (Task 4/5),
rebuild with `node scripts/build-rust-converter.js`.

**Start here:** Task 3. Suggested order: 3 → 4 → 5 → 6 → 7 → 8 → 8b → 9 → 10 →
10b → 11 → 12. Tasks 3/4/5/6 are deterministic core work; the cutover (7/8/8b)
flips the build to Rust; 9/10/10b/11 verify; 12 documents. **Capture/keep the
baseline before Task 7.**

**Truncation (Task 10b):** tracked by **#6792** (section markdown truncated in
clipboard; example `/influxdb3/enterprise/admin/last-value-cache/`). Diagnosed
during planning: generation is complete (both `index.md` and `index.section.md`
match their source/parts), so #6792 lives in the runtime fetch/clipboard path in
`format-selector.ts` — a UI subsystem **outside this migration's scope**. Task
10b ships a build-time completeness test (pages + sections) and a Cypress
clipboard test that reproduces/locks #6792; the underlying clipboard fix, if
needed, is a separate follow-up under #6792.

## File structure

- Modify: `scripts/rust-markdown-converter/src/lib.rs` — drop-in frontmatter (rename `version`, remove timestamps); remove section binding.
- Create: `scripts/build-rust-converter.js` — postinstall build (cargo-guarded).
- Create: `scripts/lib/base-url.js` — ported `detectBaseUrl` (ESM).
- Modify: `scripts/lib/provenance.js` — add `readSitemapLastmods`; stamp `date`/`lastmod` in `injectPageProvenance`.
- Modify: `scripts/build-llm-markdown.js` — require Rust module, resolve+pass base\_url, build lastmod Map, hard-fail on load, add `--path`/`--limit` targeting (Task 8).
- Delete: `scripts/lib/markdown-converter.cjs`, `scripts/html-to-markdown.js`.
- Modify: `cypress/e2e/content/markdown-content-validation.cy.js`, `cypress/e2e/content/llm-format-selector.cy.js` — generate fixtures via `build:md --path` instead of the deleted legacy script; update `product_version:`→`version:` assertions (Task 8/11).
- Modify: `package.json` — `exports`, `postinstall`, remove deps + legacy scripts.
- Modify: `.circleci/config.yml` — Rust toolchain + `napi build` step.
- Rewrite: `scripts/README.md` — drop legacy `html-to-markdown.js` docs, document Rust + `build-llm-markdown.js` (Task 12).
- Create: `scripts/parity-scan.mjs` — corpus structural + content-loss scan (Task 9).
- Create: `scripts/__tests__/markdown-parity.test.mjs` — golden-snapshot test + fixtures.
- Create: `scripts/__tests__/markdown-completeness.test.mjs` — truncation guard, pages + sections (Task 10b).
- Create: `cypress/e2e/content/section-clipboard-copy.cy.js` — #6792 clipboard guard (Task 10b).
- Modify: `DOCS-TESTING.md` — frontmatter schema + architecture.

***

## Task 1: Rebase onto post-#7294 master and capture the JS baseline ✅ DONE

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

## Task 2: Add a cargo-guarded local build (`postinstall`) ✅ DONE

> **Toolchain prerequisite (found during execution):** the crate is napi v2
> (`napi`/`napi-derive` 2.16), but `scripts/rust-markdown-converter/package.json`
> pinned `@napi-rs/cli@^3.4.1` (v3), which builds the `.node` binary but does
> **not** emit the `index.js` JS wrapper for a v2 crate — so the module can't be
> `require`d. Pin the CLI to `^2.18.4` (and regenerate the subpackage
> `yarn.lock`) so `napi build` emits `index.js`/`index.d.ts`. Done in commit
> `064b28d7a`.

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

## Task 5: Make the Rust per-page frontmatter an exact drop-in

**Files:**

- Modify: `scripts/rust-markdown-converter/src/lib.rs` (the `Frontmatter` struct, `generate_frontmatter`, and `#[cfg(test)] mod tests`)
- Modify: `scripts/rust-markdown-converter/Cargo.toml` (drop `chrono`)

Target field set/order = the post-#7294 JS converter base output (`markdown-converter.cjs:501-513`): `title`, `description`, `url`, `estimated_tokens`, `product`, `version`. Rust emits exactly these — **no** `publisher`/`canonical`/`date`/`lastmod` (those are JS post-steps; see Task 8b). `convert_to_markdown`'s signature is unchanged and does no HTML-head extraction.

- [ ] **Step 1: Write/adjust unit tests for the drop-in frontmatter**

In the `#[cfg(test)] mod tests` block in `lib.rs`, append:

```rust
    #[test]
    fn test_frontmatter_uses_version_not_product_version() {
        let html = r#"<html><head></head><body>
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
    }

    #[test]
    fn test_frontmatter_omits_provenance_and_timestamps() {
        // publisher/canonical/date/lastmod are added later by the JS post-step,
        // never by the converter.
        let html = r#"<html><head>
            <meta name="last-modified" content="2025-01-15T00:00:00Z">
          </head><body>
            <article class="article--content"><h1>X</h1><p>Body.</p></article>
          </body></html>"#;
        let out = convert_to_markdown(
            html.to_string(),
            "/influxdb3/core/x/".to_string(),
            "https://docs.influxdata.com".to_string(),
        )
        .unwrap()
        .unwrap();
        assert!(!out.contains("publisher:"));
        assert!(!out.contains("canonical:"));
        assert!(!out.contains("date:"));
        assert!(!out.contains("lastmod:"));
    }
```

- [ ] **Step 2: Run the tests to confirm they fail**

Run: `cd scripts/rust-markdown-converter && cargo test`
Expected: FAIL — current struct emits `product_version` and build-time `date`/`lastmod`.

- [ ] **Step 3: Update the `Frontmatter` struct to the drop-in field set/order**

Replace the struct with:

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
}
```

- [ ] **Step 4: Simplify `generate_frontmatter` (rename field, drop `chrono`)**

Remove the `chrono::Utc::now()` block and the `date`/`lastmod`/`product_version` fields; build the struct with `version`. The signature is unchanged (5 args), so `convert_to_markdown` needs no edit:

```rust
fn generate_frontmatter(
    title: &str,
    description: &str,
    url_path: &str,
    content_length: usize,
    base_url: &str,
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
    };

    match serde_yaml::to_string(&frontmatter) {
        Ok(yaml) => format!("---\n{}---", yaml),
        Err(_) => "---\n---".to_string(),
    }
}
```

- [ ] **Step 5: Remove the now-unused `chrono` dependency**

Run `grep -n chrono src/lib.rs`. If no matches remain, delete the `chrono = "0.4"` line from `scripts/rust-markdown-converter/Cargo.toml`.

- [ ] **Step 6: Run the tests to confirm they pass**

Run: `cd scripts/rust-markdown-converter && cargo test`
Expected: PASS, including the two new tests and the existing `test_product_detection` / `test_html_to_markdown`.

- [ ] **Step 7: Commit**

```bash
git add scripts/rust-markdown-converter/src/lib.rs scripts/rust-markdown-converter/Cargo.toml
git commit -m "feat(rust): emit drop-in per-page frontmatter (version, no timestamps)"
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

## Task 8: Delete the JS converter, retire the legacy script, drop deps ✅ DONE

> **Plan gap found during execution:** Task 8's original consumer grep scoped
> only `scripts/ deploy/` and declared `html-to-markdown.js` safe to delete. But
> the **Cypress acceptance specs invoke it in `before()` to generate fixtures**
> — `markdown-content-validation.cy.js` (5×) and `llm-format-selector.cy.js`
> (2×) call `node scripts/html-to-markdown.js --path <p> [--limit N]`. Deleting
> it would have broken the Task 11 acceptance gate. Fix (chosen with the user,
> option A): give the surviving generator the `--path`/`--limit` targeting the
> legacy script provided, migrate the specs onto it, **then** delete. The specs
> now exercise the real Rust path.

**Files:**

- Delete: `scripts/lib/markdown-converter.cjs`, `scripts/html-to-markdown.js`

- Modify: `package.json` (`exports`, scripts, deps), `scripts/build-llm-markdown.js`
  (add `--path`/`--limit`), `cypress/e2e/content/markdown-content-validation.cy.js`,
  `cypress/e2e/content/llm-format-selector.cy.js`

- [x] **Step 1: Add `--path`/`--limit` targeting to `build-llm-markdown.js`**

`parseArgs` gains `--path <site-relative-path>` and `--limit <n>`;
`buildPageMarkdown` filters the `index.html` glob to the path subtree and caps
the count (path filter first, then limit). This is the per-path generation the
Cypress specs used the legacy script for. (Phase 2 section bundling still scans
the whole `public/`, which is fine — the targeted page's children were just
generated.)

- [x] **Step 2: Migrate the Cypress fixture generation off the legacy script**

In both specs, replace every
`node scripts/html-to-markdown.js --path …` with
`node scripts/build-llm-markdown.js --public-dir public --path …` (path + any
`--limit` preserved verbatim). 7 invocations total.

- [x] **Step 3: Delete the JS converter and the legacy CLI**

```bash
git rm scripts/lib/markdown-converter.cjs scripts/html-to-markdown.js
```

- [x] **Step 4: Repoint `exports` and remove legacy/dep entries in `package.json`**

- `exports./markdown-converter` → `./scripts/rust-markdown-converter/index.js`

- Remove the `build:md:legacy` and `build:md:verbose` script lines.

- Remove `turndown`, `@types/turndown`, and `jsdom` from `dependencies`.

- [x] **Step 5: Confirm nothing else imports the removed modules (grep MUST include `cypress/`)**

```bash
grep -rnE "markdown-converter\.cjs|html-to-markdown|turndown|jsdom" \
  scripts deploy cypress | grep -v node_modules | grep -vE "\.md:|README"
```

Expected: only the intentional doc comment in `scripts/lib/base-url.js`. Note:
`scripts/README.md` still documents the deleted `html-to-markdown.js` end to end
— its rewrite is folded into **Task 12** (docs).

- [x] **Step 6: Reinstall and verify the active build still runs**

```bash
CYPRESS_INSTALL_BINARY=0 yarn install
node scripts/build-llm-markdown.js --public-dir public --path influxdb3/core/get-started
```

Expected: install succeeds without `turndown`/`jsdom` and rebuilds Rust;
targeted `build:md` exits 0.

- [x] **Step 7: Commit (stage explicit paths — `git add -A` grabs the worktree
  `.cache` symlink, which `.gitignore`'s `.cache/` rule does not match; add
  `/.cache` to `.gitignore`)**

```bash
git add scripts package.json cypress yarn.lock .gitignore
git commit -m "chore: remove JS markdown converter and legacy CLI; add build:md --path/--limit"
```

***

## Task 8b: Stamp `date`/`lastmod` in the JS provenance step

The Rust converter no longer emits timestamps. Add them as a JS post-step,
folded into the existing provenance injection so there is no extra pass over
each `.md`. Per page only; sections keep provenance (publisher/canonical) alone.

**Files:**

- Modify: `scripts/lib/provenance.js` (add `readSitemapLastmods`, extend `injectPageProvenance`)

- Modify: `scripts/build-llm-markdown.js` (build the lastmod Map once, pass per page)

- Test: `scripts/__tests__/provenance.test.mjs`

- [ ] **Step 1: Write failing tests for sitemap lastmod parsing + stamping**

Append to `scripts/__tests__/provenance.test.mjs` (it already imports `injectPageProvenance` and the fs/tmp helpers):

```js
import { readSitemapLastmods } from '../lib/provenance.js';

test('readSitemapLastmods maps urlPath to lastmod from sitemap-md.xml', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'prov-'));
  try {
    writeFileSync(
      join(dir, 'sitemap-md.xml'),
      '<urlset><url><loc>https://docs.influxdata.com/influxdb3/core/index.md</loc>' +
        '<lastmod>2025-01-15T00:00:00Z</lastmod></url></urlset>'
    );
    const map = await readSitemapLastmods(dir);
    assert.equal(map.get('/influxdb3/core/'), '2025-01-15T00:00:00Z');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('injectPageProvenance stamps date/lastmod when lastmod is provided', () => {
  const md = '---\ntitle: X\nurl: https://docs.influxdata.com/x/\n---\n\nBody.\n';
  const out = injectPageProvenance(md, {
    publisher: 'InfluxData',
    canonical: 'https://docs.influxdata.com/x/',
    lastmod: '2025-01-15T00:00:00Z',
  });
  const fm = out.match(/^---\n([\s\S]+?)\n---/)[1];
  assert.match(fm, /date: 2025-01-15T00:00:00Z/);
  assert.match(fm, /lastmod: 2025-01-15T00:00:00Z/);
});

test('injectPageProvenance omits timestamps when lastmod is absent', () => {
  const md = '---\ntitle: X\nurl: https://docs.influxdata.com/x/\n---\n\nBody.\n';
  const out = injectPageProvenance(md, {
    publisher: 'InfluxData',
    canonical: 'https://docs.influxdata.com/x/',
  });
  assert.doesNotMatch(out, /date:/);
  assert.doesNotMatch(out, /lastmod:/);
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

Run: `node --test scripts/__tests__/provenance.test.mjs`
Expected: FAIL — `readSitemapLastmods` is not exported and `injectPageProvenance` ignores `lastmod`.

- [ ] **Step 3: Add `readSitemapLastmods` to `scripts/lib/provenance.js`**

```js
/**
 * Build a urlPath -> lastmod map from sitemap-md.xml. Keys are site-relative
 * paths (e.g. "/influxdb3/core/"), matching the build script's urlPath.
 * @param {string} publicDir
 * @returns {Promise<Map<string,string>>}
 */
export async function readSitemapLastmods(publicDir = 'public') {
  const map = new Map();
  try {
    const xml = await fs.readFile(
      path.join(publicDir, 'sitemap-md.xml'),
      'utf-8'
    );
    const re = /<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g;
    let m;
    while ((m = re.exec(xml)) !== null) {
      const urlPath = new URL(m[1]).pathname.replace(/index\.md$/, '');
      map.set(urlPath, m[2]);
    }
  } catch {
    /* no sitemap -> empty map -> timestamps omitted */
  }
  return map;
}
```

- [ ] **Step 4: Extend `injectPageProvenance` to stamp `date`/`lastmod`**

Update its destructured arg and body (omit timestamps when `lastmod` is falsy):

```js
export function injectPageProvenance(markdown, { publisher, canonical, lastmod }) {
  const match = markdown.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n+([\s\S]+)$/);
  if (!match) return markdown;
  let fm;
  try {
    fm = yaml.load(match[1]);
  } catch {
    return markdown;
  }
  if (!fm || typeof fm !== 'object') return markdown;
  fm.publisher = publisher;
  fm.canonical = canonical;
  if (lastmod) {
    fm.date = lastmod;
    fm.lastmod = lastmod;
  }
  const body = match[2];
  const serialized = yaml.dump(fm, { lineWidth: -1, noRefs: true }).trim();
  return `---\n${serialized}\n---\n\n${body}`;
}
```

- [ ] **Step 5: Build the map once and pass `lastmod` per page in `build-llm-markdown.js`**

Add the import (\~line 52), build the map in the provenance setup (\~line 491), and pass the per-page value at the call site (\~line 154):

```js
// imports (~line 52)
import {
  loadOrgIdentity,
  readSitemapOrigin,
  readSitemapLastmods,
  injectPageProvenance,
} from './lib/provenance.js';

// provenance setup (~line 491)
const [org, origin, lastmods] = await Promise.all([
  loadOrgIdentity(),
  readSitemapOrigin(cliOptions.publicDir),
  readSitemapLastmods(cliOptions.publicDir),
]);
const provenance = { publisher: org.name, origin, lastmods };

// call site in buildPageMarkdown (~line 154)
const output = provenance
  ? injectPageProvenance(markdown, {
      publisher: provenance.publisher,
      canonical: `${provenance.origin}${urlPath}`,
      lastmod: provenance.lastmods.get(urlPath),
    })
  : markdown;
```

`provenance` is already threaded into `buildPageMarkdown` via `options`, so `lastmods` rides along. `combineMarkdown` (sections) is unchanged.

- [ ] **Step 6: Run the tests to confirm they pass**

Run: `node --test scripts/__tests__/provenance.test.mjs scripts/__tests__/build-llm-markdown.test.mjs`
Expected: PASS (new timestamp tests + the existing #7294 provenance/section tests).

- [ ] **Step 7: Commit**

```bash
git add scripts/lib/provenance.js scripts/build-llm-markdown.js scripts/__tests__/provenance.test.mjs
git commit -m "feat: stamp date/lastmod from sitemap in the provenance step"
```

***

## Task 9: Migration parity gate (fixture diff + structural scan)

> **Semantic diffs already found during cutover (Task 7), vs the
> `.parity-baseline/` JS output — these are the concrete `lib.rs` fixes Task 9
> must land before the scan/fixtures can pass:**
>
> 1. **h1 is stripped but must be kept.** `convert_to_markdown` calls
>    `html_to_markdown(&content, true)` (remove h1). The JS baseline keeps the
>    body `# Heading` (≈83% of sampled pages), and
>    `markdown-content-validation.cy.js:240` asserts `/^# /m`. Change the
>    single-page call to keep the h1 (the section path already passes `false`).
> 2. **`for AI` widget text leaks on \~2,690/4,684 pages.** The format-selector
>    ("Copy page for AI" / "Copy section for AI") is only partially stripped —
>    the `Copy page`/`Copy section` prefix goes but `for AI` remains. Extend the
>    Rust strip-list to drop the whole `format-selector` element. Baseline: 0.
> 3. **Support sections leak.** The Rust output keeps the "Find support …" Tip
>    callout + Discord/Customer-portal block; the JS baseline strips it and
>    `markdown-content-validation.cy.js:599-604` asserts its absence. Add the
>    support block to the strip-list.
>
> After fixing, re-run `yarn build:md` and the scan/fixtures below. These are
> also why Task 11's Cypress run currently fails; see Task 11's note on the
> `product_version:` → `version:` assertion updates (a contract change, not a
> converter bug — update the test, don't weaken it).

Do **not** byte-diff all \~4,700 pages — that is dominated by the intentional
`date`/`lastmod` additions plus cosmetic whitespace, and engine regressions are
classes of bugs that a curated sample exercises just as well. Instead:

1. a **feature-coverage fixture set** — diff a dozen real pages chosen to
   exercise every structural feature (the actual semantic check);
2. a **cheap corpus-wide structural scan** — an O(n) pass that flags only
   objective breakage (empty body, missing frontmatter, leftover raw HTML,
   unbalanced code fences) and gross content loss vs the baseline (body-length
   ratio). Surfaces a short outlier list, no human per-page diffing.

Corpus-wide content validation is already covered by Cypress (Task 11) and exact
output is locked by the golden snapshot (Task 10). The `.parity-baseline/`
snapshot from Task 1 is the reference for both checks.

**Files:**

- Create: `scripts/parity-scan.mjs` (kept in-tree for re-runs)

- [ ] **Step 1: Write the structural + content-loss scan**

Create `scripts/parity-scan.mjs`:

````js
#!/usr/bin/env node
/**
 * Corpus-wide parity scan: flags OBJECTIVE breakage in Rust-generated per-page
 * Markdown, and gross content loss vs the JS baseline. Not a byte-diff — it
 * surfaces a short outlier list to inspect by hand. Exit 1 if any page is
 * flagged so CI/the runner notices.
 *
 * Usage: node scripts/parity-scan.mjs [currentDir] [baselineDir]
 */
import { glob } from 'glob';
import fs from 'node:fs/promises';
import path from 'node:path';

const curDir = process.argv[2] || 'public';
const baseDir = process.argv[3] || '.parity-baseline';

function splitFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
  return m ? { fm: m[1], body: m[2] } : null;
}

const files = await glob(`${curDir}/**/index.md`, {
  ignore: ['**/node_modules/**'],
});
const flags = [];
for (const file of files) {
  const rel = path.relative(curDir, file);
  const md = await fs.readFile(file, 'utf-8');
  const parts = splitFrontmatter(md);
  if (!parts) {
    flags.push(`NO_FRONTMATTER  ${rel}`);
    continue;
  }
  const { fm, body } = parts;
  if (!/\btitle:/.test(fm) || !/\burl:/.test(fm)) {
    flags.push(`MISSING_FIELD   ${rel}`);
  }
  if (body.trim().length === 0) {
    flags.push(`EMPTY_BODY      ${rel}`);
  }
  // NOTE: unbalanced-fence and raw-HTML-at-line-start were tried and rejected
  // as noisy — docs legitimately contain literal ``` (grammar/spec pages) and
  // HTML examples in code blocks, producing false positives. CONTENT_LOSS below
  // is the high-signal, low-noise truncation/regression detector.
  // Gross content loss vs baseline body length.
  try {
    const base = await fs.readFile(path.join(baseDir, rel), 'utf-8');
    const baseParts = splitFrontmatter(base);
    if (baseParts) {
      const b = baseParts.body.trim().length;
      const c = body.trim().length;
      if (b > 200 && c < b * 0.5) {
        flags.push(`CONTENT_LOSS    ${rel} (rust ${c} vs js ${b} chars)`);
      }
    }
  } catch {
    /* page not in baseline (new) — skip ratio check */
  }
}

for (const f of flags) console.log(f);
console.log(`\n${flags.length} flag(s) across ${files.length} pages.`);
process.exit(flags.length === 0 ? 0 : 1);
````

- [ ] **Step 2: Regenerate the corpus with Rust and run the scan**

```bash
npx hugo --quiet --destination public
yarn build:md --public-dir public
node scripts/parity-scan.mjs public .parity-baseline | tee parity-report.txt
```

Expected: ideally `0 flag(s)`. Any flag is a short, concrete list to inspect — fix the cause in `lib.rs` (`html_to_markdown`, callout/table/code handling, or the strip-list) and re-run. `CONTENT_LOSS` and `RAW_HTML` are the high-signal ones.

- [ ] **Step 3: Diff the feature-coverage fixture set**

Pick \~12 real pages from `public/` that, together, exercise: fenced code blocks with language identifiers, GFM tables, all five GitHub callout types (`note`/`warning`/`important`/`tip`/`caution`), tabbed content, nested + ordered lists, inline links, and a reference page dense with these. Spread across 2–3 products (e.g. influxdb3/core, telegraf, influxdb/v2). Verify each page actually contains the feature before choosing it (`grep` the baseline `.md`).

For each, compare baseline vs Rust and confirm the only differences are the expected `date`/`lastmod` additions plus cosmetic whitespace/escaping:

```bash
# example — repeat per fixture page
diff <(sed '/^date:/d;/^lastmod:/d' .parity-baseline/influxdb3/core/get-started/index.md) \
     <(sed '/^date:/d;/^lastmod:/d' public/influxdb3/core/get-started/index.md)
```

Any **semantic** difference (lost content, broken/changed code fence, malformed table, dropped/altered link, missing callout) → fix in `lib.rs` and re-run Steps 2–3. Stop when the fixture set shows only cosmetic diffs and the scan is clean.

- [ ] **Step 4: Record accepted cosmetic diffs**

List the accepted cosmetic difference categories (e.g. "list marker `*`→`-`", "trailing-space normalization") in the PR description. Do not commit `parity-report.txt` or `.parity-baseline/` (gitignored).

- [ ] **Step 5: Commit the scan tool + any Rust fixes**

```bash
git add scripts/parity-scan.mjs scripts/rust-markdown-converter/src/lib.rs
git commit -m "test: add corpus parity scan and reconcile semantic diffs"
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

Expected: frontmatter with exactly the six base fields (`title`, `description`, `url`, `estimated_tokens`, `product`, `version`) and a sane body. No `publisher`/`canonical`/`date`/`lastmod` — those are added later by the JS post-step, not the converter. Confirm by eye before locking it as the golden file.

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

test('converter emits the drop-in base frontmatter only', () => {
  const html = readFileSync(FIXTURE, 'utf-8');
  const out = convertToMarkdown(
    html,
    '/influxdb3/core/get-started/',
    'https://docs.influxdata.com'
  );
  assert.match(out, /\nversion: core\n/);
  assert.doesNotMatch(out, /product_version:/);
  // provenance + timestamps are JS post-steps, not the converter:
  assert.doesNotMatch(out, /publisher:/);
  assert.doesNotMatch(out, /canonical:/);
  assert.doesNotMatch(out, /date:/);
  assert.doesNotMatch(out, /lastmod:/);
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

## Task 10b: Truncation regression test

Tracking issue: **influxdata/docs-v2#6792 — "Section markdown truncated in
clipboard."** The reported example is the section page
`/influxdb3/enterprise/admin/last-value-cache/` ("Copy section for AI").

**Diagnosis from planning (verified against the current build):**

- The generated `index.md` files are complete (no gross content loss vs source
  HTML).
- The generated `index.section.md` is **also complete** — the LVC section body
  (19,402 chars) equals the sum of its parent + four child bodies (19,373). So
  the truncation is **not in generation**.
- The clipboard path is `assets/js/components/format-selector.ts`:
  `handleCopySection` → `fetch(index.section.md)` → `clipboard.writeText`. The
  code does no slicing, so #6792 is in the **fetch/clipboard runtime path**
  (e.g. how `.section.md` is served, or a clipboard limit) — a UI subsystem
  **separate from the Rust converter migration**, which does not touch section
  generation or `format-selector.ts`.

So this task ships two complementary guards: a **build-time completeness test**
(pages *and* sections — guards generation, and the html2md large-page risk) and
a **Cypress clipboard test** on the real #6792 page (guards the runtime path).
The Cypress test is what actually reproduces/locks #6792; fixing the underlying
clipboard/serving bug, if the test fails, is a follow-up outside this migration.

**Files:**

- Create: `scripts/__tests__/markdown-completeness.test.mjs`

- Modify: `package.json` (add `test:markdown-completeness`)

- [ ] **Step 1: Write the completeness test**

Create `scripts/__tests__/markdown-completeness.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const PUBLIC = process.env.PUBLIC_DIR || 'public';

async function* walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name === 'index.md') yield p;
  }
}

function htmlArticleText(html) {
  const m = html.match(
    /<article[^>]*article--content[^>]*>([\s\S]*?)<\/article>/i
  );
  return (m ? m[1] : '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mdBody(md) {
  const m = md.match(/^---\n[\s\S]+?\n---\n([\s\S]*)$/);
  return (m ? m[1] : md).trim();
}

test('generated .md pages are not truncated vs their source HTML', async () => {
  const truncated = [];
  let checked = 0;
  for await (const mdPath of walk(PUBLIC)) {
    const htmlPath = mdPath.replace(/index\.md$/, 'index.html');
    let html;
    try {
      html = await fs.readFile(htmlPath, 'utf-8');
    } catch {
      continue;
    }
    const text = htmlArticleText(html);
    if (text.length < 3000) continue; // only meaningful for substantial pages
    const body = mdBody(await fs.readFile(mdPath, 'utf-8'));
    checked++;
    // The .md body should retain most of the article's visible text. 0.5 is a
    // conservative floor (the baseline build had 0 pages below it); tighten
    // once a real truncated example sets the bar.
    if (body.length < text.length * 0.5) {
      truncated.push(
        `${path.relative(PUBLIC, mdPath)} (md ${body.length} vs html ${text.length})`
      );
    }
  }
  assert.ok(checked > 0, 'no pages checked — build public/ first');
  assert.equal(
    truncated.length,
    0,
    `Truncated pages:\n${truncated.join('\n')}`
  );
});

test('section bundles contain their child pages (not truncated)', async () => {
  // A section's body should be roughly the sum of its parent + child page
  // bodies. Far less means combineMarkdown dropped children. Guards #6792 at
  // the generation layer (the runtime clipboard path is covered by Cypress).
  const short = [];
  let checked = 0;
  async function* walkSections(dir) {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules') continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) yield* walkSections(p);
      else if (e.name === 'index.section.md') yield p;
    }
  }
  for await (const secPath of walkSections(PUBLIC)) {
    const dir = path.dirname(secPath);
    const parts = [path.join(dir, 'index.md')];
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      if (e.isDirectory()) parts.push(path.join(dir, e.name, 'index.md'));
    }
    let sum = 0;
    for (const p of parts) {
      try {
        sum += mdBody(await fs.readFile(p, 'utf-8')).length;
      } catch {
        /* missing child md — skip */
      }
    }
    if (sum < 3000) continue;
    const secBody = mdBody(await fs.readFile(secPath, 'utf-8'));
    checked++;
    if (secBody.length < sum * 0.6) {
      short.push(
        `${path.relative(PUBLIC, secPath)} (section ${secBody.length} vs parts ${sum})`
      );
    }
  }
  assert.ok(checked > 0, 'no section bundles checked — build public/ first');
  assert.equal(short.length, 0, `Truncated sections:\n${short.join('\n')}`);
});
```

- [ ] **Step 2: Run it against the current build**

Run: `PUBLIC_DIR=public node --test scripts/__tests__/markdown-completeness.test.mjs`
Expected: PASS (the baseline build had 0 pages under the 0.5 ratio). A failure means real truncation — inspect the listed pages; the cause is either the converter (fix `lib.rs`) or the source content.

- [ ] **Step 3: Wire into package.json**

Add to scripts: `"test:markdown-completeness": "node --test scripts/__tests__/markdown-completeness.test.mjs",`

- [ ] **Step 4: Cypress clipboard guard for #6792 (section copy)**

This reproduces/locks the actual reported bug. On the #6792 example section page
`/influxdb3/enterprise/admin/last-value-cache/`, the "Copy section for AI"
option (`[data-option="copy-section"]`) fetches `index.section.md` and writes it
to the clipboard. Add a Cypress test that:

1. visits the page (Hugo server running);
2. grants clipboard permission and stubs/reads `navigator.clipboard.writeText`;
3. opens the format selector, clicks `[data-option="copy-section"]`;
4. fetches `/influxdb3/enterprise/admin/last-value-cache/index.section.md`
   directly and asserts the clipboard text **equals** the fetched file (same
   length and content) — i.e. not truncated.

Put it under `cypress/e2e/content/` next to the other content specs. If the test
**fails** (clipboard shorter than the file), that confirms #6792 is in the
runtime fetch/clipboard path; fixing it (e.g. how `.section.md` is served, or a
`writeText` size issue) is a follow-up tracked by #6792, separate from this
migration. If it **passes**, #6792 is already resolved by the current build and
the test prevents regression.

- [ ] **Step 5: Commit**

```bash
git add scripts/__tests__/markdown-completeness.test.mjs package.json
git commit -m "test: guard against truncated markdown twins"
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
yarn test:build-md
```

Expected: all PASS. `test:build-md` runs the #7294 provenance/section tests plus the new `date`/`lastmod` stamping tests (Task 8b).

- [ ] **Step 3: Cypress markdown validation**

> **Test-contract updates required (do these, they are not "weakening to
> pass"):** `markdown-content-validation.cy.js` predates #7294 and this
> migration. Two assertions encode the OLD contract and must be updated to the
> shipped one:
>
> - `:121` and `:433` assert `product_version:` — the converter now emits
>   `version:` (matches the post-#7294 JS baseline). Update both to `version:`.
> - `:130-131` assert `date:`/`lastmod:` — now added by the JS provenance
>   post-step (Task 8b), so they pass once 8b is in. Keep them.
>
> Everything else in this spec (h1 present `:240`, no `Copy page` `:209/588`, no
> support section `:599-604`) is a **real Rust converter requirement** — satisfy
> it by fixing `lib.rs` (Task 9), not by editing the test.

```bash
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/markdown-content-validation.cy.js"
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/markdown-autodiscovery.cy.js"
```

Expected: both specs PASS (no raw shortcodes, valid frontmatter, callouts/tables/links intact, autodiscovery coherent).

- [ ] **Step 4: Markdown-parity + Rust unit tests**

```bash
yarn test:markdown-parity
PUBLIC_DIR=public yarn test:markdown-completeness
cd scripts/rust-markdown-converter && cargo test && cd -
```

Expected: all PASS. `test:markdown-completeness` guards against truncated twins
(Task 10b).

- [ ] **Step 5: If anything fails, fix at the source and re-run**

Any Cypress failure about frontmatter or stripped UI is a Rust converter fix (`lib.rs`), then re-run Steps 1–4. Do not weaken the tests to pass.

***

## Task 12: Update documentation

**Files:**

- Modify: `DOCS-TESTING.md` (frontmatter schema + architecture sections)

- Rewrite: `scripts/README.md` — currently documents only the deleted
  `html-to-markdown.js` (purpose, turndown config, `--path`/`--limit`/`--verbose`
  usage). Replace with the current architecture: `build-llm-markdown.js`
  (Phase 1 = Rust per-page conversion, Phase 2 = JS section bundling), the Rust
  napi converter, and the surviving `--path`/`--limit` flags. Remove all
  turndown/legacy references.

- [ ] **Step 1: Update the architecture diagram and "Related Files"**

In `DOCS-TESTING.md`, replace references to `scripts/lib/markdown-converter.js`/`.cjs` as the conversion engine with `scripts/rust-markdown-converter/` (Rust + napi). State that `build-llm-markdown.js` Phase 1 calls the Rust module and Phase 2 (`combineMarkdown`) builds section bundles in JS. Remove the legacy `html-to-markdown.js` / `build:md:legacy` mentions.

- [ ] **Step 2: Align the documented frontmatter schema to the Rust contract**

Update the frontmatter example fields to the actual shipped set/order: the converter emits `title`, `description`, `url`, `estimated_tokens`, `product`, `version`; the JS provenance post-step then adds `publisher`, `canonical`, `date`, `lastmod`. For sections: `type`, `pages` (= parent + children), `child_pages`, plus provenance. Note which fields come from the converter vs. the post-step.

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

| Spec section                         | Task(s)                     |
| ------------------------------------ | --------------------------- |
| Wire Rust into CI (§1)               | 2, 3                        |
| No silent fallback (§2)              | 7 (load guard)              |
| Delete JS + legacy + deps (§3)       | 4, 8                        |
| Pin frontmatter contract (§4)        | 5, 10, 12                   |
| Golden-snapshot test (§5)            | 10                          |
| Migration parity gate (§6)           | 1, 9                        |
| Truncation regression test           | 10b                         |
| Acceptance gate (§7)                 | 11                          |
| Rust = exact drop-in (6 base fields) | 5, 10                       |
| publisher/canonical (JS post-step)   | (untouched #7294; in 8b/11) |
| date/lastmod (JS post-step, sitemap) | 8b                          |
| base\_url resolution                 | 6, 7                        |
| Section bundling stays in JS         | (untouched; verified in 11) |
