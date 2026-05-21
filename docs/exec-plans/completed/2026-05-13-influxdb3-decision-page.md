# "Which InfluxDB 3 should I use?" decision page (page only)

**Status:** Merged 2026-05-15 — PR [#7214](https://github.com/influxdata/docs-v2/pull/7214)
**Refs:** [#7219](https://github.com/influxdata/docs-v2/issues/7219) (tracking)
**Parent:** [#7230](https://github.com/influxdata/docs-v2/issues/7230) (AI visibility — Phase 0)

## Goal

Ship the canonical decision page at `/influxdb3/which-influxdb-3/` — the single URL that answers "which InfluxDB 3 product fits my workload?" Renders 7 FAQ Q\&As with deep-linkable anchors, a decision table, per-product sections, and migration links. PR 1 of 4 in the Phase 0 decision-page rollout.

## Why now

Phase 0 of the AI visibility epic (#7230) requires a canonical landing for the "which v3?" question. The v3 product family (Core, Enterprise, Cloud Dedicated, Cloud Serverless, Clustered) has grown beyond what users can disambiguate from product index pages alone; LLM-aware tooling needs a citable URL to point at.

## Decisions

- **FAQ content in a Hugo data file** (`data/faqs/which-influxdb-3.yml`), not embedded markdown. One source feeds the rendering shortcode now and the JSON-LD partial in PR #7220 — no drift possible.
- **`{{< faq >}}` emits semantic `<h2 id="…">` + `<div class="faq-answer">`**, not `<dl>` or `<details>`. Deep-linkable anchors per question, harvestable by Google's FAQ rich result and by LLM extractors.
- **No `menu:` frontmatter.** The page is cross-cutting; existing product menus are product-scoped, and sidebar placement under any one product would imply false ownership. Discovery comes via direct URL + llms.txt + per-product callouts in PR #7229.
- **`faq_data` + `faq_canonical: true` frontmatter scheme.** Prepared ahead so PR #7220's JSON-LD partial can gate emission per page — single content source, multiple consumers, decision lives on the page.
- **Title-template fix bundled.** Two-segment `/influxdb3/<page>/` URLs previously emitted `<title><nil> Documentation</title>` because `data/products.yml` has no bare `influxdb3` key (only namespaced `influxdb3_*`). Added the case + a question-shaped page title for SEO and LLM extraction. Same review context, same partial.
- **PR-stacked rollout (1 of 4).** Reviewers see one concern per PR instead of a 990-line drop. Each PR's behavior verifiable end-to-end before the next stacks on.

## Explicitly out of scope

- FAQPage JSON-LD ([#7220](https://github.com/influxdata/docs-v2/pull/7220))
- `/influxdb3/` hub landing ([#7228](https://github.com/influxdata/docs-v2/pull/7228))
- Cross-link callouts, llms.txt, platform FAQ pointer ([#7229](https://github.com/influxdata/docs-v2/pull/7229))

## How to update

Edit `data/faqs/which-influxdb-3.yml` to add or change FAQ Q\&As. The shortcode regenerates HTML on every Hugo build; the JSON-LD partial (PR #7220) regenerates structured data from the same file. Decision-page prose lives in `content/shared/influxdb3/which-influxdb-3.md`.

## Verification

- `node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/which-influxdb-3.cy.js" --no-mapping` → 8/8 pass: H1, 7 FAQ Q\&As as semantic HTML with stable anchors, decision table, migration links, self-canonical, no raw markdown leakage
- `npx hugo --quiet && grep -c "What's the difference between InfluxDB 1" public/influxdb3/which-influxdb-3/index.html` → ≥ 1
