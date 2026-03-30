---
branch: feat-api-uplift
repo: docs-v2
created: 2025-12-02T15:28:32Z
updated: 2026-03-29
status: release-ready
---

# feat-api-uplift

## Summary

Replace Redoc-based API reference rendering with Hugo-native templates. All 9 InfluxDB product APIs now render server-side from OpenAPI specs — no client-side JavaScript rendering, no Redoc dependency. The build pipeline processes specs through post-processing (overlays, tag configs) and generates Hugo content pages with tag-based navigation, inline curl samples, spec downloads, and an "Ask AI" integration.

Key changes from the previous Redoc-based system:
- Operations grouped by tag (not individual pages) with `#operation/{id}` deep links
- Declarative tag config via `tags.yml` (rename, reassign, drop) — source specs never mutated
- Data paths mirror content paths — templates derive lookups from page URLs
- Multi-spec products (Cloud Dedicated, Clustered) get nested Data API / Management API sidebar sections
- Cloud Serverless TSM-era endpoints dropped with a callout pointing to the Cloud (TSM) reference
- Data-driven Cypress tests validate sidebar nav against article data files

## Build Pipeline

```
getswagger.sh            → fetch specs from influxdata/openapi, bundle with @redocly/cli (resolve $refs)
post-process-specs.ts    → apply info/servers overlays + tag configs (rename, reassign, drop) → _build/
generate-openapi-articles.ts → generate Hugo content pages + copy specs to static/openapi/
```

@redocly/cli is used only for bundling and linting — not rendering. All rendering is Hugo-native.

## Product Status

| Product               | URL                                | Status   |
| --------------------- | ---------------------------------- | -------- |
| InfluxDB 3 Core       | `/influxdb3/core/api/`             | Complete |
| InfluxDB 3 Enterprise | `/influxdb3/enterprise/api/`       | Complete |
| Cloud Dedicated       | `/influxdb3/cloud-dedicated/api/`  | Complete |
| Clustered             | `/influxdb3/clustered/api/`        | Complete |
| Cloud Serverless      | `/influxdb3/cloud-serverless/api/` | Complete |
| InfluxDB Cloud (v2)   | `/influxdb/cloud/api/`             | Complete |
| InfluxDB OSS v2       | `/influxdb/v2/api/`                | Complete |
| InfluxDB OSS v1       | `/influxdb/v1/api/`                | Complete |
| Enterprise v1         | `/enterprise_influxdb/v1/api/`     | Complete |

## What shipped

### Infrastructure

- Hugo templates in `layouts/api/` render operations, parameters, schemas, responses, and code samples
- `post-process-specs.ts` tag config features:
  - `rename` — rename tags across spec and all operations
  - `reassign` — split one tag into multiple by API path prefix
  - `drop` — remove tags and exclusively-owned operations from the spec
- `generate-openapi-articles.ts` content generation:
  - Tag-based pages with frontmatter from article data
  - `subSection` support for multi-spec products
  - `page.yml` overlay for per-product landing page content
  - Explicit `specDownloadPath` passed from call site (fixes single-spec products with `displayName`)
- Data paths mirror content paths (`data/article_data/{family}/{product}/api/`)
- Templates derive sidebar data lookup from page URL segments (3-segment and 4-segment)
- Response descriptions render markdown via `markdownify`
- HEAD method badge color (`#00897B` teal)

### Per-product

- **Core + Enterprise**: 13 aligned tags. Enterprise uses `rename` (Token → Auth token), `reassign` (Cache data → distinct/last value), and adds Migrate trait tag.
- **Cloud Dedicated + Clustered**: Nested Data API / Management API sidebar sections with per-spec downloads and all-endpoints pages. Enriched traitTag descriptions (quick starts, parameter tables, status codes).
- **Cloud Serverless**: 29 TSM-era tags dropped via `drop: true`. Note callout on landing page directs to Cloud (TSM) reference. Bucket Schemas dropped. Terminology corrected to "databases (buckets), organizations, and tokens."
- **Cloud v2 + OSS v2**: Tag-based rendering with full operation details.
- **OSS v1 + Enterprise v1**: Tag-based rendering from v1 OpenAPI specs.

### Testing

- 25 Cypress e2e tests (all passing):
  - Data-driven sidebar nav (reads tags from `articles.yml`)
  - Data-driven conceptual page content (50+ char threshold)
  - Multi-spec sidebar structure (Cloud Dedicated, Clustered)
  - Tag pages, section pages, all-endpoints pages
- `readArticleData` and `readConceptualTags` Cypress tasks
- Hugo test server uses `--disableFastRender` to avoid Hugo 0.157.0 rebuild panic

## Post-release issues

- [#7008](https://github.com/influxdata/docs-v2/issues/7008) — Extract `#### Related Guides` from operation descriptions into structured `x-related` fields (~190 instances across 5 specs)
- [#7009](https://github.com/influxdata/docs-v2/issues/7009) — Consolidate legacy hand-written v1/Enterprise v1 API pages with the new spec-based reference

## Related Files

- Branch: `feat-api-uplift`
- PR: [#6622](https://github.com/influxdata/docs-v2/pull/6622), [#7006](https://github.com/influxdata/docs-v2/pull/7006)
- Scripts: `api-docs/scripts/generate-openapi-articles.ts`, `api-docs/scripts/post-process-specs.ts`
- Templates: `layouts/api/`, `layouts/partials/api/`, `layouts/partials/sidebar/`
- Tests: `cypress/e2e/content/api-reference.cy.js`, `cypress/support/hugo-server.js`
- Tag configs: `api-docs/{product}/tags.yml`
- Page overlays: `api-docs/{product}/content/page.yml`
- Article data: `data/article_data/`
- Static specs: `static/openapi/`
