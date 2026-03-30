---
branch: feat-api-uplift
repo: docs-v2
created: 2025-12-02T15:28:32Z
updated: 2026-03-26
status: in-progress
---

# feat-api-uplift

## Overview

Render API reference documentation using Hugo-native templates. OpenAPI specs are processed server-side into static HTML — no client-side rendering.

## Build Pipeline

```
getswagger.sh            → fetch and bundle specs with @redocly/cli
post-process-specs.ts    → apply info/servers overlays + tag configs (rename, reassign, drop) → _build/
generate-openapi-articles.ts → generate Hugo content pages + copy specs to static/openapi/
```

## Product Status

| Product               | URL                                | Status                                               |
| --------------------- | ---------------------------------- | ---------------------------------------------------- |
| InfluxDB 3 Core       | `/influxdb3/core/api/`             | Complete                                             |
| InfluxDB 3 Enterprise | `/influxdb3/enterprise/api/`       | Complete — tags aligned with Core                    |
| Cloud Dedicated       | `/influxdb3/cloud-dedicated/api/`  | Complete — nested Data API / Management API sections |
| Clustered             | `/influxdb3/clustered/api/`        | Complete — nested Data API / Management API sections |
| Cloud Serverless      | `/influxdb3/cloud-serverless/api/` | In progress — TSM cleanup, specDownloadPath fix      |
| InfluxDB Cloud (v2)   | `/influxdb/cloud/api/`             | Needs specDownloadPath fix                           |
| InfluxDB OSS v2       | `/influxdb/v2/api/`                | Complete                                             |
| InfluxDB OSS v1       | `/influxdb/v1/api/`                | Needs specDownloadPath fix                           |
| Enterprise v1         | `/enterprise_influxdb/v1/api/`     | Needs specDownloadPath fix                           |

## Completed

### Infrastructure

- Hugo templates in `layouts/api/` and `layouts/partials/api/` render operations, parameters, schemas, and responses
- Tag-based navigation: operations grouped by tag, no individual operation URLs
- `generate-api-docs.sh` orchestrates the pipeline
- `post-process-specs.ts` applies overlays and tag configs; source specs never mutated
  - `rename` renames tags across spec and all operations
  - `reassign` splits one tag into multiple by API path prefix (Enterprise cache tags)
  - `drop` removes tags and their exclusively-owned operations (Cloud Serverless TSM cleanup — pending)
- `generate-openapi-articles.ts` creates Hugo content pages and copies specs to `static/openapi/`
  - Supports `subSection` for multi-spec products (Data API / Management API)
- Data paths mirror content paths: `data/article_data/{family}/{product}/api/articles.yml`
- Templates derive sidebar data lookup from page URL (3-segment and 4-segment) — no frontmatter indirection needed
- Multi-spec sidebar: nested sub-sections for Cloud Dedicated and Clustered
- Data-driven Cypress tests: `readArticleData` task reads articles.yml for sidebar tag assertions

### Content — Core and Enterprise

- 13 aligned tags: Quick start, Authentication, Headers and parameters, Migrate from InfluxDB v1 or v2, Auth token, Cache distinct values, Cache last value, Database, Processing engine, Query data, Server information, Table, Write data
- Enterprise tags aligned via `rename` (Token → Auth token) and `reassign` (Cache data → split)

### Content — Cloud Dedicated and Clustered

- Nested sections: Data API and Management API under `/api/`
- Per-spec download buttons and all-endpoints pages
- `.api-spec-section` sidebar styling

### Content — v2 and v1 products

- All 4 products (Cloud v2, OSS v2, OSS v1, Enterprise v1) render via Hugo-native templates
- Tags with descriptions and related links

## In Progress

### Cloud Serverless TSM cleanup (agent: code-architect)

- Add `drop: true` feature to `post-process-specs.ts`
- Mark \~25 TSM-era tags for removal in `cloud-serverless/tags.yml`
- Fix specDownloadPath bug for single-spec products with `displayName`
- Update section landing page description for Cloud Serverless terminology

### Cloud Dedicated / Clustered UI review (agent: ui-testing)

- Running Cypress tests for multi-spec sidebar
- Visual review of nested Data API / Management API sections
- Verifying single-spec products unaffected

## Remaining Work

### specDownloadPath fix (4 products)

Root cause: `generateTagPagesFromArticleData()` derives `specDownloadPath` as `/openapi/${staticDirName}.yml` but actual filename is `{staticDirName}-{specSlug}.yml` when `displayName` is set.

- [ ] Fix by passing explicit `specDownloadPath` from call site where `staticSpecPath` is known
- [ ] Affects: Cloud Serverless, Cloud v2, OSS v1, Enterprise v1

### Cloud Serverless

- [ ] Implement `drop: true` in `post-process-specs.ts`
- [ ] Update `cloud-serverless/tags.yml` — mark TSM tags for removal
- [ ] Update section landing page — correct terminology, add Warning callout
- [ ] Regenerate and verify sidebar shows only supported tags

### Code cleanup

- [ ] Remove dead code from `layouts/_default/api.html` (dual download buttons, inline styles)
- [ ] Audit stale spec files in `static/openapi/`

### Testing

- [ ] Run full Cypress suite after all fixes
- [ ] Verify spec download links for all 9 products

## Related Files

- Branch: `feat-api-uplift`
- Design: `docs/plans/2026-03-17-api-rendering-fixes-design.md`
- Scripts: `api-docs/scripts/generate-openapi-articles.ts`, `api-docs/scripts/post-process-specs.ts`
- Templates: `layouts/api/`, `layouts/partials/api/`, `layouts/partials/sidebar/`
- Tests: `cypress/e2e/content/api-reference.cy.js`
- Tag configs: `api-docs/{product}/tags.yml`
- Static specs: `static/openapi/`
- Article data: `data/article_data/`

## Notes

- No individual operation pages — operations accessed via tag pages with `#operation/{id}` hash anchors
- `specDownloadPath` is set on section `_index.md` and inherited by child tag pages via `.Parent`
- Multi-spec products set `specDownloadPath` per sub-section, not on top-level `api/_index.md`
- Use Chrome devtools and Cypress to debug rendering issues
