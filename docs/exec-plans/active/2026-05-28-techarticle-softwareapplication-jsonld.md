# TechArticle + SoftwareApplication JSON-LD on product pages

**Status:** In review — PR [#7272](https://github.com/influxdata/docs-v2/pull/7272)
**Closes:** [#7242](https://github.com/influxdata/docs-v2/issues/7242)
**Parent:** [#7230](https://github.com/influxdata/docs-v2/issues/7230) (AI visibility — Phase 0)

## Goal

Emit schema.org `TechArticle` JSON-LD on every InfluxData product documentation
page and a single `SoftwareApplication` node on each product landing page, so
structured-data-aware retrievers (Google, Bing, Perplexity, Brave) can resolve
product identity, platform, and version without scraping prose.

## Why now

Phase 0 of the AI-visibility epic (#7230). Follows the FAQPage JSON-LD work
(#7220) which established the pattern: a partial under
`layouts/partials/header/` wired into `header.html`. This is the product-wide
structured-data layer on top of that single-page proof of concept.

## Decisions

- **Gating is cascade-based, not per-page frontmatter opt-in.** Eligibility
  resolves from the existing `product` cascade key (via
  `partial "product/get-data.html"`), so no content frontmatter churn. The page
  `Kind` must be `page` or `section`, which structurally excludes `taxonomy`,
  `term` (tags pages), and `home`. A `techarticle: false` opt-out exists for the
  rare exception.
- **`TechArticle` applies to all product prose, including `reference/`.** The
  schema.org definition explicitly lists "specifications" as an example, so
  API/CLI/SQL/config pages are valid `TechArticle` nodes. Register (guide vs.
  spec) is encoded in `articleSection`, not by withholding the type. No
  `proficiencyLevel` — it would require a guessy path→proficiency mapping.
- **`SoftwareApplication` is emitted once per product, on the landing page**, as
  the authoritative node. `TechArticle` references it from both `about` and
  `isPartOf` by **bare `@id`** (`<landing-URL>#software`). An inline
  `{@type: SoftwareApplication, name}` would be parsed as a *separate,
  incomplete* `SoftwareApplication` and fail validation — the `@id` reference is
  deliberate (fixed in `63811c3d6`).
- **The landing page is resolved structurally via `product/landing.html`**, not
  by string-matching `RelPermalink == /<content_path>/` (fixed in `46e801e9a`).
  This keeps `isPartOf`, `articleSection`, and the `SoftwareApplication` gate
  correct for versioned landings (`/telegraf/v1/`, `/influxdb/v2/`) as well as
  bare roots (`/influxdb3/core/`). This superseded the original plan's "skip
  multi-version products" boundary — versioned roots now get a full node.
- **`dateModified` is ISO 8601 with offset** (`2006-01-02T15:04:05Z07:00`), not
  date-only, so consumers get an unambiguous timestamp (fixed in `63811c3d6`).
- **`softwareVersion` resolves per version then falls back to scalar.**
  `latest_patches[version]` first, then `latest_patch`; omitted entirely for
  rolling/SaaS products with no fixed version, rather than emitting a stale or
  empty value.
- **Per-product `schema:` block in `data/products.yml`** (content-as-data,
  consistent with the file) carries `operating_system`, `application_category`
  (default `DatabaseApplication`), and optional `offers`. Absent fields are
  omitted, never emitted empty. `offers` is set only for free/open-source
  products; commercial products omit it rather than fabricate a price.

## Explicitly out of scope

- Richer `SoftwareApplication` fields (ratings, screenshots, `downloadUrl`) —
  the current node is identity + platform + version + price only.
- `proficiencyLevel` / audience modeling on `TechArticle` (see decision above).
- Structured data on non-product pages (blog, marketing, taxonomy) — the
  `product` cascade and `Kind` guards intentionally exclude them.

## How to update

- **Add/adjust per-product metadata:** edit the `schema:` block under the
  product key in `data/products.yml`. No template change needed.
- **Add a new product:** the partials pick it up automatically once the product
  has a `product` cascade key and (optionally) a `schema:` block.
- **Change emitted fields:** edit `layouts/partials/header/techarticle-jsonld.html`
  or `layouts/partials/header/softwareapplication-jsonld.html`. Both are wired in
  `layouts/partials/header.html` after the FAQ JSON-LD include.

## Verification

```bash
# Build and confirm a landing page emits both types with a matching @id,
# a reference page emits TechArticle only, and a tags page emits neither.
npx hugo --quiet --destination public_test
node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/content/jsonld-techarticle.cy.js"
```

Manual: paste rendered JSON-LD from `/influxdb3/core/` (both types) and
`/influxdb3/core/reference/cli/` (TechArticle only) into the
[Google Rich Results Test](https://search.google.com/test/rich-results) and
confirm no errors.
