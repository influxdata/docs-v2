# FAQPage JSON-LD for the InfluxDB 3 decision page

**Status:** Merged 2026-05-15 — PR [#7220](https://github.com/influxdata/docs-v2/pull/7220)
**Refs:** [#7219](https://github.com/influxdata/docs-v2/issues/7219) (tracking)
**Parent:** [#7230](https://github.com/influxdata/docs-v2/issues/7230) (AI visibility — Phase 0)

## Goal

Emit schema.org `FAQPage` JSON-LD on `/influxdb3/which-influxdb-3/` so the page is eligible for Google's FAQ rich result and so LLM-aware tooling can consume structured Q\&A data. PR 2 of 4 in the decision-page rollout.

## Why now

PR #7214 shipped the rendered FAQ HTML; structured data is the second half of the AI/SEO value. Landing it as a separate PR isolates the JSON-LD shape and the gate logic for independent review.

## Decisions

- **Partial reads the same `data/faqs/<key>.yml` file the `{{< faq >}}` shortcode consumes.** Single source of truth; HTML and structured data can't drift.
- **Gated on `faq_data` AND `faq_canonical: true`** (both required). Pages that transclude the same shared FAQ body — like the `/influxdb3/` hub coming in PR #7228 — won't double-emit. Canonical equity stays on the slug URL.
- **`safeJS` wrapper around `jsonify`.** Go's `html/template` applies JS-context escaping inside `<script>` tags that re-JSON-encodes string output — without `safeJS`, `jsonify`'s output emits as `"{...}"` (a JSON-encoded string of the JSON document) and Google's validator rejects it. Documented inline so future edits don't regress.
- **Cypress asserts plain-text answers**, parsing the `<script>` and walking `mainEntity[*].acceptedAnswer.text`. Guards against `markdownify` leaking HTML tags into the structured-data string.
- **Wired in `<head>` immediately after the canonical link partial.** Same partial neighborhood as other head metadata; keeps SEO/structured-data emission visible in one place.

## Explicitly out of scope

- Hub-landing JSON-LD behavior — verified in PR #7228
- Markdown alternates / `llms-full.txt` — separate workstream (#7211)
- Generalizing the partial to other structured-data types (HowTo, Article, etc.) — premature until a second use case

## How to update

Add an FAQ data file at `data/faqs/<key>.yml`, then set `faq_data: <key>` and `faq_canonical: true` on the canonical page's frontmatter. The partial does the rest. Transcluding pages omit `faq_canonical:` to suppress JSON-LD.

## Verification

- [Google Rich Results Test](https://search.google.com/test/rich-results) on `/influxdb3/which-influxdb-3/` → 1 FAQ rich result, 7 questions, 0 errors, 0 warnings
- Cypress assertion: parses `<script type="application/ld+json">`, confirms FAQPage shape, 7 Question entities, non-empty plain-text answers (no leaked HTML)
- Gate check: `grep -c 'application/ld+json' public/influxdb3/core/index.html` → 0 (no emission on transcluding/non-canonical pages)
