# Design: TechArticle + SoftwareApplication JSON-LD (#7242)

Parent: #7230 (Phase 0 — AI visibility for InfluxDB documentation)

## Goal

Emit schema.org `TechArticle` and `SoftwareApplication` JSON-LD on product
documentation pages so structured-data-aware retrievers (Google, Bing,
Perplexity, Brave) can resolve product identity, applicable platform, and
version without scraping prose.

Follows the pattern established by the FAQPage JSON-LD work (#7220):
a partial under `layouts/partials/header/` wired into `header.html`.

## Key decisions

- **Gating is path/cascade-based, not per-page frontmatter opt-in.** Eligibility
  is resolved from the existing `product` cascade key, so no content frontmatter
  churn. A `techarticle: false` opt-out exists for the rare exception.
- **`TechArticle` applies to all product prose, including `reference/`.** The
  schema.org `TechArticle` definition explicitly lists "specifications" as an
  example, so API/CLI/SQL/config reference pages are valid `TechArticle` nodes.
  Register (guide vs. spec) is encoded in `articleSection`, not by withholding
  the type. No `proficiencyLevel` (avoids a guessy path→proficiency mapping).
- **`SoftwareApplication` is emitted once per product**, on the product landing
  page only, as the authoritative node that `TechArticle.isPartOf` references.

## 1. Gating & file structure

Two new partials under `layouts/partials/header/`, included in `header.html`
immediately after the existing `faq-jsonld.html` include:

- `techarticle-jsonld.html` — emits `TechArticle`
- `softwareapplication-jsonld.html` — emits `SoftwareApplication`

Both resolve the product with the existing
`partial "product/get-data.html" .` (reads the `product` cascade key set in
each product section's `_index.md`). No path parsing.

**`TechArticle` emits when ALL of:**

- `product/get-data.html` returns a non-empty product (page is inside a product
  section)
- `.Kind` is `page` or `section` — structurally excludes `taxonomy` and `term`
  (the `tags` pages), plus `home`
- frontmatter does not set `techarticle: false`

**`SoftwareApplication` emits only on the product landing page** — the section
root where `.RelPermalink` equals `/{{ content_path }}/`.

## 2. Emitted fields

### `TechArticle` (every qualifying page)

| Field               | Source                                                                                                         |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `@type`             | `"TechArticle"`                                                                                                |
| `headline` / `name` | `.Title`                                                                                                       |
| `description`       | `.Description` (fallback `.Summary`)                                                                           |
| `mainEntityOfPage`  | absolute page URL (`.Permalink`)                                                                               |
| `articleSection`    | top-level section under the product, title-cased (e.g. `Reference`, `Get started`, `Administer`, `Write data`) |
| `about`             | `{ "@type": "SoftwareApplication", "name": <product.name> }`                                                   |
| `isPartOf`          | `{ "@type": "SoftwareApplication", "@id": "<landing-URL>#software" }`                                          |
| `dateModified`      | `.Lastmod`                                                                                                     |
| `inLanguage`        | `"en"`                                                                                                         |

### `SoftwareApplication` (landing page only)

| Field                 | Source                                             |
| --------------------- | -------------------------------------------------- |
| `@type` / `@id`       | `"SoftwareApplication"` / `<landing-URL>#software` |
| `name`                | `product.name`                                     |
| `applicationCategory` | `"DatabaseApplication"`                            |
| `operatingSystem`     | new `product.schema.operating_system`              |
| `softwareVersion`     | `product.latest_patch` (existing)                  |
| `offers`              | new `product.schema.offers` (omit if absent)       |
| `url`                 | landing page `.Permalink`                          |

## 3. New data: `schema:` block in `data/products.yml`

`products.yml` has `name` and `latest_patch` but not OS or pricing. Add a
per-product `schema:` block (content-as-data, consistent with the file) for
**all products** in `products.yml`:

```yaml
influxdb3_core:
  # ...existing...
  schema:
    operating_system: "Linux, macOS, Windows, Docker"
    offers:
      price: "0"
      price_currency: "USD"
```

The partial reads `product.schema.*` with safe fallbacks: omit `offers` /
`operatingSystem` when absent rather than emit empty values. Products without a
`schema` block still get `TechArticle`.

## 4. Validation & testing

- **Build safety**: both partials use `with`/`default` guards so a missing field
  never errors the build (matches `faq-jsonld.html`). `safeJS` on `jsonify`
  output, same as the FAQ partial.
- **Google Rich Results Test**: manually validate one landing page (both types)
  and one deep `reference/` page (TechArticle only) before merge.
- **Cypress** (`cypress/e2e/content/`, mirroring `which-influxdb-3.cy.js`):
  assert a product landing page emits both `@type: TechArticle` and
  `@type: SoftwareApplication` with non-empty `name`/`url`, and that a `tags`
  page emits neither.
- **PR preview**: list the landing page + one reference page + one tags page in
  the PR body with an "Expected JSON-LD" column.

## Acceptance criteria (from #7242)

- [ ] New partial(s) under `layouts/partials/header/` emit `TechArticle` per page
  (`name`, `headline`, `mainEntityOfPage`, `about`, `articleSection`,
  `isPartOf`) and `SoftwareApplication` on product landing pages (`name`,
  `applicationCategory`, `operatingSystem`, `softwareVersion`, `offers`,
  `url`)
- [ ] Wired into `header.html` after the FAQ JSON-LD include
- [ ] Gated without per-page frontmatter churn (cascade-based default + opt-out)
- [ ] Validated with Google Rich Results Test
- [ ] Cypress assertion for both types on a product page
