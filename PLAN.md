---
branch: feat-api-uplift
repo: docs-v2
created: 2025-12-02T15:28:32Z
status: in-progress
---

# feat-api-uplift

## Overview

Render API reference documentation using Hugo-native templates. OpenAPI specs are processed server-side into static HTML — no client-side rendering.

## Build Pipeline

```
getswagger.sh           → fetch and bundle specs with @redocly/cli
post-process-specs.ts   → apply info/servers overlays + tag configs → _build/
generate-openapi-articles.ts → generate Hugo content pages + static spec downloads
```

## Completed

### Infrastructure

- Hugo templates in `layouts/partials/api/` render operations, parameters, schemas, and responses
- Tag-based navigation: operations grouped by tag, no individual operation URLs
- `generate-api-docs.sh` orchestrates the pipeline
- `post-process-specs.ts` applies overlays and tag configs (source specs are never mutated)
- `generate-openapi-articles.ts` creates Hugo content pages and static spec downloads
- Generation script supports `--clean` (default), `--dry-run`, and `--skip-fetch` flags

### Content

- All 11 product APIs render via Hugo-native templates
- Tags cleaned up with descriptions, `x-related` links, and `externalDocs`
- Inline curl code samples and Ask AI links per operation
- Theme-aware code blocks, font normalization, layout width, TOC border
- Flattened version directories, unified v2 APIs
- Cypress tests updated for static HTML selectors

## In Progress

- Fix menu entries and sidebar for all API reference pages
- Align sidebar data and test selectors with new spec paths

## Related Files

- Branch: `feat-api-uplift`
- Plan: `docs/plans/2026-02-13-hugo-native-api-migration.md`

## Notes

- Use Chrome devtools and Cypress to debug
- No individual operation pages — operations accessed only via tag pages
