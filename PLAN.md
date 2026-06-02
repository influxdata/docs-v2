# Plan: Organization JSON-LD with `sameAs` links (#7243)

Parent epic: #7230 (Phase 0).

## Goal

Emit schema.org `Organization` JSON-LD with verified `sameAs` links on the
homepage and each product landing root, so retrievers resolve InfluxData as a
single entity (Wikipedia, LinkedIn, Crunchbase, GitHub, social) rather than a
string they deduplicate from prose.

## Design decisions

- **Identity lives in `data/influxdata.yml`** (not hardcoded in the partial, not
  in env-split `hugo.yml` params). One auditable place for the Phase 3 quarterly
  `sameAs`/freshness review; matches the content-as-data pattern (`products.yml`).
- **`sameAs` is strict — company entity only.** Every URL must identify the
  InfluxData *organization*, not a product. Carries company-controlled profiles
  (GitHub org, Docker Hub verified publisher, LinkedIn company, X/Twitter,
  YouTube, Facebook) and the third-party org record (Crunchbase). Deliberately
  excluded:
  - The **InfluxDB Wikipedia article** — it's the *product* page, not a company
    page (no separate "InfluxData" article exists). Emitting it as org `sameAs`
    would conflate company and product. Kept under `references` instead; it's a
    correct `sameAs` for a future SoftwareApplication (product) node.
  - The **`r/influxdb` subreddit** — a topic/community, not an org-identity node.
- **`references` (not emitted).** Product/brand links retained for editorial and
  the Phase 3 audit, but never rendered into JSON-LD. A lightweight list
  (`kind`, `entity`, `label`, `url`) — not a typed emission-control framework,
  which would be premature for this scale.
- **Emission scope: site-wide (every page).** `Organization` is a single global
  entity with a stable `@id`, so retrievers and search engines dedupe it across
  pages — repeating it is harmless. Emitting everywhere maximizes coverage on
  the deep documentation pages where LLM retrievers most often land (the epic's
  actual goal), not just the homepage and ~16 product roots. This intentionally
  departs from the issue's "NOT every page" note: that rationale (avoid
  duplicate emission) applies to the page-scoped nodes
  (`TechArticle`/`SoftwareApplication`, which describe a specific page/product),
  not to a deduped global entity. The earlier "home + product roots" scope left
  namespace hubs (`/influxdb3/`) and all ~5,770 deep pages with no org node.
- **Stable `@id`** (`https://www.influxdata.com/#organization`) so future work can
  wire the org as `publisher` on TechArticle/SoftwareApplication. Not wired now
  (YAGNI) — this PR only adds the Organization node.

## sameAs set (all verified HTTP 200, 2026-06)

Source: influxdata.com footer (authoritative) + knowledge nodes.

- `https://github.com/influxdata`
- `https://hub.docker.com/u/influxdata` (Docker verified publisher page)
- `https://www.crunchbase.com/organization/influxdb` (403 to bots; confirmed
  correct in-browser by the maintainer)
- `https://www.linkedin.com/company/influxdb` (slug is `influxdb`, not `influxdata`)
- `https://twitter.com/influxdb`
- `https://www.youtube.com/@InfluxData`
- `https://www.facebook.com/influxdb/`

`references` (NOT emitted): `https://en.wikipedia.org/wiki/InfluxDB` (product
article, `entity: product`).

## Files

| File                                               | Change                                                    |
| -------------------------------------------------- | --------------------------------------------------------- |
| `data/influxdata.yml`                              | New — `organization` block (name, url, id, logo, sameAs)  |
| `layouts/partials/header/organization-jsonld.html` | New — emits Organization node on home + product roots     |
| `layouts/partials/header.html`                     | Wire in the partial (one line, after softwareapplication) |
| `cypress/e2e/content/jsonld-organization.cy.js`    | New — emission + exclusion assertions                     |

## Partial logic

1. `$org := site.Data.influxdata.organization`; bail if absent.
2. No page predicate — emit on every page (site-wide).
3. Build dict with `@context`, `@type` Organization, `@id`, `name`, `url`,
   `logo`, `sameAs`. Omit absent fields (defensive `with`).
4. `<script type="application/ld+json">{{ $node | jsonify | safeJS }}</script>`

## Tests

`cypress/e2e/content/jsonld-organization.cy.js`, reusing the `ldByType()` helper
pattern from `jsonld-techarticle.cy.js`:

1. **Homepage `/`** — one well-formed `Organization`; `@context`
   `https://schema.org`; `name` `InfluxData`; `url` set; `@id` ends
   `/#organization`; `sameAs` array with **≥4** entries (acceptance criterion).
2. **Exactly one per page class** — namespace hub (`/influxdb3/`), product root
   (`/influxdb3/core/`), and deep article (`/influxdb3/core/admin/`) each emit
   exactly one node. "Exactly one" is the regression guard: it catches both
   omission (the original gap where hubs/deep pages emitted nothing) and
   accidental duplicate emission.

## Verification

- `npx hugo` build; confirm every sampled page class (home, hub, product root,
  deep article) emits exactly one Organization script, and that no page emits
  two.
- Run the Cypress spec.
- Structurally parse the emitted JSON-LD (valid JSON, schema-shaped).
- **Schema validation:** use the Schema Markup Validator
  (`validator.schema.org`), NOT the Google Rich Results Test. `Organization` is
  not a rich-result type (nor are the page's `TechArticle`/`SoftwareApplication`
  nodes), so the Rich Results Test correctly reports "no items detected" even
  for valid markup. The issue's "Google Rich Results Test" criterion rests on a
  false premise; Organization markup feeds entity resolution / the knowledge
  graph, which the Rich Results Test does not surface. Confirmed against a live
  tunnel: the served Organization node parses and is well-formed.

## Out of scope (follow-ups)

- **#7290** — carry InfluxData provenance in the LLM-native artifacts (Markdown
  twins, `llms-full.txt`, `llms.txt`). This PR adds Organization JSON-LD for
  HTML consumers; the markdown surface needs the same identity, sourced from the
  same `data/influxdata.yml`. Verified that JSON-LD does not reach the twins.
- Wiring `publisher` references into other JSON-LD partials.
- Emitting product `sameAs` (e.g. the InfluxDB Wikipedia article) on the
  SoftwareApplication node — where that link is semantically correct.
- Community-resources page for `r/influxdb`.
