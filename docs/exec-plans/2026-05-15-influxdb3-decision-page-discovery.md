# Discovery surfaces for the InfluxDB 3 decision page

**Status:** Merged 2026-05-15 — PR [#7229](https://github.com/influxdata/docs-v2/pull/7229)
**Refs:** [#7219](https://github.com/influxdata/docs-v2/issues/7219) (tracking)
**Parent:** [#7230](https://github.com/influxdata/docs-v2/issues/7230) (AI visibility — Phase 0)

## Goal

Make the canonical decision page discoverable from the surfaces users (and LLMs) actually land on first: each v3 product index, `llms.txt`, and the cross-product platform FAQ. PR 4 of 4 — closes out the Phase 0 rollout.

## Why now

Without inbound links, the decision page is orphaned. Users hitting `/influxdb3/core/` or `/influxdb3/cloud-serverless/` to evaluate a product won't find it on their own, and LLM-aware tooling won't surface it without an llms.txt entry.

## Decisions

- **Per-product tip callouts are tailored, not generic.** Cloud Serverless's callout specifically notes its different API surface vs. Enterprise — the most common confusion the decision page exists to resolve. A single generic "see the decision guide" line would have wasted the inbound-link impression.
- **Core and Enterprise share one callout via `content/shared/influxdb3/_index.md`** (their existing shared `_index.md` source). Editing the two per-product files separately would have been redundant and drift-prone — the shared source already exists for exactly this reason.
- **`llms.txt` gets a new top-level `## Choosing InfluxDB` section above `## InfluxDB 3`.** LLM-aware tooling treats top-level entries as navigational landmarks; nesting under "InfluxDB 3" would have buried the decision page beside individual product entries when its job is to point *between* them.
- **Platform FAQ uses a stable `#which-version-of-influxdb-should-i-use` anchor.** Citable from outside docs (support articles, forum posts) without depending on the H2 text staying constant.

## Explicitly out of scope

- In-product sidebar nav entries — the decision page is intentionally cross-cutting (see PR #7214 exec-plan); product-scoped menus would imply false ownership
- Marketing-site outbound link — landed inside the shared body in PR #7214's "Related links" section
- Markdown alternates / `llms-full.txt` per-page entries — separate workstream (#7211)

## How to update

| Surface                                           | File                                                       |
| ------------------------------------------------- | ---------------------------------------------------------- |
| Core + Enterprise callout                         | `content/shared/influxdb3/_index.md`                       |
| Cloud Dedicated / Serverless / Clustered callouts | each product's `content/influxdb3/<product>/_index.md`     |
| llms.txt section                                  | `layouts/index.llmstxt.txt` (`## Choosing InfluxDB` block) |
| Platform FAQ Q\&A                                 | `content/platform/faq.md`                                  |

## Verification

- `public/llms.txt` shows `## Choosing InfluxDB` immediately above `## InfluxDB 3`
- Each of `core/`, `enterprise/`, `cloud-dedicated/`, `cloud-serverless/`, `clustered/` index pages renders exactly one `/influxdb3/which-influxdb-3/` link
- `/platform/faq/` has the `#which-version-of-influxdb-should-i-use` H2 and a link list entry at the top
- Cypress 15/15 pass (9 canonical-page + 6 cross-link assertions)
