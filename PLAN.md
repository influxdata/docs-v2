# PLAN: Carry InfluxData provenance into LLM-native artifacts (#7290)

Follow-up to #7291 (Organization JSON-LD, closed #7243). Parent epic: #7230.

## Problem

\#7291 emits schema.org `Organization` JSON-LD site-wide for **HTML** consumers
(search crawlers, RAG-over-HTML), sourced from `data/influxdata.yml`. But the
**LLM-native** artifacts carry no org identity:

- Per-page Markdown twins (`public/<path>/index.md`, `index.section.md`)
- Per-product `llms-full.txt`
- Root `llms.txt`

These carry only `title, description, url, product, version` — no publisher, no
authoritative-source signal. Verified (2026-06): grep for
`Organization`/`sameAs`/`ld+json` across generated `.md` twins returns nothing,
because the converter serializes only `article.article--content`, so head
JSON-LD never reaches the Markdown. This is a coverage gap for the audience the
epic cares about most.

## Principle

One source of truth — `data/influxdata.yml` (added in #7291) — feeds all three
surfaces. No list is duplicated. HTML JSON-LD and Markdown provenance can't
drift.

## Design

### 1. Per-page Markdown twins — inject *above* the converter

Add two fields to twin frontmatter:

- `publisher: InfluxData` (constant, from `data/influxdata.yml`)
- `canonical: <prod-origin><path>` (production canonical URL)

**Architecture decision — inject at the orchestration layer
(`scripts/build-llm-markdown.js`), not inside the converter.**

Rationale: org identity is build-pipeline metadata, not something an HTML→Markdown
converter should produce. A converter's job is HTML→MD. The orchestrator already
knows the page path and can read `data/influxdata.yml` and the sitemap origin
once. This also sidesteps the converter duality:
`scripts/lib/markdown-converter.cjs` has a Rust fast path
(`scripts/rust-markdown-converter/`, its own `generate_frontmatter`) and a JS
fallback selected at runtime via `USE_RUST`. Injecting above the converter means
provenance is correct regardless of which converter runs, and the Rust converter
(the one that matters) stays pure — no struct changes, no `.node` rebuild.

Details:

- `publisher` is constant ("InfluxData").
- `canonical` = production origin + page path. Origin comes from
  `public/sitemap-md.xml` (same source `build-llms-full-txt.js` already uses), so
  staging builds get staging URLs. Deliberately **not** the twin `url` field,
  which reflects build baseURL (e.g. `localhost:1313` in dev).
- Applies to both `index.md` (phase 1) and `index.section.md` (phase 2).
- Implementation: after the converter returns the page string, parse the YAML
  frontmatter block, add `publisher` + `canonical`, re-serialize. The build
  script already has a frontmatter parser. The converter is untouched.

### 2. `llms-full.txt` — identity block once per corpus header

In `scripts/build-llms-full-txt.js`, extend the corpus header (\~line 171) with a
publisher / url / `sameAs` block, emitted **once** per product corpus
(dedup-correct, mirrors the JSON-LD `@id` dedup). Sourced from
`data/influxdata.yml`. Origin for any absolute URLs reuses the existing
`loadEligibleUrls()` sitemap origin.

### 3. `llms.txt` — one publisher line

In `layouts/index.llmstxt.txt`, add a single publisher / authoritative-source
line to the header, read natively from `site.Data.influxdata`.

## Tests (same PR)

Per the repo rule that every PR with testable code includes a test:

- Unit test for the provenance-injection function: `publisher` + `canonical`
  present; `canonical` uses the sitemap origin, not `localhost`.
- Extend `scripts/__tests__/build-llms-full-txt.test.mjs`: assert the identity
  block appears **exactly once** per corpus, not per page.
- Twin assertion: extend the Markdown validation Cypress spec (or a node test
  reading a built `index.md`) for `publisher` + `canonical`.
- Assert `public/llms.txt` carries the publisher line.
- Update `DOCS-TESTING.md` (LLM-friendly Markdown section) documenting the new
  fields.

## Acceptance criteria (from #7290)

- Twin frontmatter includes `publisher` and a canonical production URL.
- `llms-full.txt` carries an org-identity header block exactly once per corpus.
- `llms.txt` carries a publisher line.
- All values sourced from `data/influxdata.yml` (no duplication of the list).
- Tests assert the twin fields, the single corpus-header block, and the
  `llms.txt` line.
- `DOCS-TESTING.md` updated.

## Out of scope (flagged, not actioned)

- **Dead code:** the Lambda\@Edge on-demand twin generator is dead. `DOCS-TESTING.md`
  still references `deploy/llm-markdown/lambda-edge/markdown-generator/` and
  `scripts/lib/markdown-converter.js` (now `.cjs`); that dir does not exist.
- **Converter duality:** if Rust is the only intended converter, the JS
  `generateFrontmatter()` and the `USE_RUST` fallback in `markdown-converter.cjs`
  are dead/divergent. Separate cleanup.
- HTML JSON-LD (done in #7291). SoftwareApplication `sameAs` (no issue yet).
