# `/influxdb3/` documentation hub landing

**Status:** Merged 2026-05-15 — PR [#7228](https://github.com/influxdata/docs-v2/pull/7228)
**Refs:** [#7219](https://github.com/influxdata/docs-v2/issues/7219) (tracking)
**Parent:** [#7230](https://github.com/influxdata/docs-v2/issues/7230) (AI visibility — Phase 0)

## Goal

Replace the auto-generated `/influxdb3/` section title ("Influxdb3s") with an explicit hub landing: brief intro, v3 children list, and a tip callout pointing to the decision page. PR 3 of 4 in the decision-page rollout.

## Why now

PR #7214 made `/influxdb3/which-influxdb-3/` the canonical decision URL, but the parent `/influxdb3/` section had no real landing — Hugo synthesized "Influxdb3s" from the slug. Cross-link callouts in PR #7229 assume a usable hub exists.

## Decisions

- **Pivoted from "transclude full decision-body into the hub" to "lightweight product directory."** The original design (`PLAN.md` Task 8) had the hub use `source:` to pull the same shared body the canonical page uses, so both URLs rendered the same content. Visual review surfaced a heading-hierarchy ambiguity: the section-intro H2 and the decision-content H2s would be siblings even though one introduced the other. The lightweight directory — intro + children + tip callout — separates "browse products" from "decide which product"; each URL has a single job. See memory `feedback_conventional_design_wins`.
- **Fixed the top-nav product-selector dropdown for versionless hubs.** Surfaced during testing: every product link on `/influxdb3/` pointed back to `/influxdb3/`. Cause: `layouts/partials/topnav/product-selector.html` computes alternates by regex-replacing the current page's `pageRoot` inside `Page.RelPermalink`; on versionless hubs `pageRoot` is `influxdb3/` and matches nothing, so `GetPage` returns the current page. Fix mirrors how `/resources/` and `/platform/` are handled (treat versionless pages as root). Bundled because same review cycle, same template area.
- **Removed the leading `{{< children >}}` from the shared decision-page body.** It was a no-op on the canonical regular page and is no longer needed by the hub (which renders its own children list). Less template magic; less to explain.
- **Renamed "Related" → "Related links" with explicit `#related-links` anchor** on the canonical decision page. Stable anchor for inbound links; carried over from working copy in the same review.

## Explicitly out of scope

- Cross-link callouts and llms.txt entry — [#7229](https://github.com/influxdata/docs-v2/pull/7229)
- Markdown alternates — separate workstream

## How to update

Edit `content/influxdb3/_index.md` for hub prose; the `{{< children >}}` shortcode renders the product list automatically from each v3 product's `_index.md` weight. The decision-page tip callout points to `/influxdb3/which-influxdb-3/`.

## Verification

- `/influxdb3/` renders H1 "InfluxDB 3", 6 product cards (decision page filtered out), tip callout, self-canonical, no FAQPage JSON-LD (gate from PR #7220 confirmed)
- Top-nav product-selector dropdown on `/influxdb3/` now resolves each link to its product's landing URL (was: all linked to `/influxdb3/`)
- Regression-tested across `/influxdb3/which-influxdb-3/`, `/influxdb3/core/`, `/platform/`, `/influxdb/v2/`, `/telegraf/v1/`
- Cypress 15/15 pass on `cypress/e2e/content/which-influxdb-3.cy.js`
