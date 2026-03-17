# Hugo-Native API Reference Migration Plan

**Goal:** Render all InfluxDB API reference pages using Hugo-native templates. OpenAPI specs are processed server-side into static HTML — no client-side rendering or shadow DOM.

**Why Hugo-native over Redoc/RapiDoc:** We evaluated client-side rendering approaches (Redoc UI, RapiDoc web components) but chose against them — we were working against their constraints rather than with them. Hugo-native templates give us full control over layout, SEO indexability, consistent styling, and faster page loads.

**Tech Stack:** TypeScript (generation scripts), Hugo templates, SCSS, OpenAPI 3.0 specs

***

## Overview

### Design Principles

- **Consistency:** Unified look and feel across all API reference pages
- **Performance:** Fast page loads, full SEO indexability (server-rendered HTML)
- **Simplicity:** No web components, no client-side rendering
- **Tag-based navigation:** Operations grouped by tag, accessed via tag pages only

### URL Structure

- **API index:** `/influxdb3/core/api/`
- **Tag page:** `/influxdb3/core/api/cache-distinct-values/`
- **All endpoints:** `/influxdb3/core/api/all-endpoints/`

Operations are accessed only through tag pages (no individual operation URLs).

***

## Build Pipeline

```
getswagger.sh              → fetch and bundle specs with @redocly/cli
post-process-specs.ts      → apply info/servers overlays + tag configs → _build/
generate-openapi-articles.ts → generate Hugo content pages + static spec downloads
```

Source specs are never mutated — overlays are applied to `_build/`.

***

## Completed Tasks

### 1. Hugo-native templates ✅

Implemented Hugo templates in `layouts/partials/api/` that render operations, parameters, schemas, and responses from OpenAPI data.

### 2. Cypress tests ✅

Rewrote tests for standard HTML selectors (`.api-operation`, `.api-method`, `.api-path`). Tests cover tag pages, section pages, all-endpoints page, and 3-column layout.

### 3. Generation script cleanup ✅

Added `--clean` (default), `--dry-run`, and `--skip-fetch` flags to `generate-openapi-articles.ts`. Clean step prevents stale files when tags are renamed or removed.

### 4. Inline code samples ✅

curl examples and Ask AI links per operation.

### 5. Styling ✅

Theme-aware code blocks, font normalization, layout width, TOC border. Operation and layout styles kept separate for clean separation of concerns.

### 6. Build script simplification ✅

Flattened version directories (e.g., `influxdb3/core/v3/ref.yml` → `influxdb3/core/influxdb3-core-openapi.yaml`). Unified v2 APIs. Rewrote `generate-api-docs.sh` as a clear pipeline.

### 7. Full product migration ✅

All 11 product APIs render via Hugo-native templates:

- influxdb3: core, enterprise, cloud-dedicated (data + management), cloud-serverless, clustered (data + management)
- influxdb: cloud (v2), v2 (OSS), v1 (OSS)
- enterprise\_influxdb: v1

Each product has `tags.yml` with descriptions, `x-related` links, and `externalDocs`.

***

## Key Files Reference

**Templates:**

- `layouts/partials/api/tag-renderer.html` - Main tag page renderer
- `layouts/partials/api/operation.html` - Individual operation renderer
- `layouts/partials/api/parameters.html` - Parameters section
- `layouts/partials/api/parameter-row.html` - Single parameter row
- `layouts/partials/api/request-body.html` - Request body section
- `layouts/partials/api/schema.html` - JSON schema renderer
- `layouts/partials/api/responses.html` - Response section

**Layouts:**

- `layouts/api/list.html` - Tag page layout
- `layouts/api/section.html` - API section page layout
- `layouts/api/all-endpoints.html` - All endpoints page layout

**Styles:**

- `assets/styles/layouts/_api-layout.scss` - Page structure and navigation
- `assets/styles/layouts/_api-operations.scss` - Operation/schema rendering

**Generation:**

- `api-docs/generate-api-docs.sh` - Pipeline orchestrator
- `api-docs/scripts/post-process-specs.ts` - Info/servers overlays + tag configs → `_build/`
- `api-docs/scripts/generate-openapi-articles.ts` - Hugo content pages + static spec downloads
- `api-docs/scripts/openapi-paths-to-hugo-data/index.ts` - OpenAPI → Hugo data transform

***

## Verification Checklist

Before considering migration complete for each product:

- [ ] All tag pages render without errors
- [ ] Operation details (parameters, request body, responses) display correctly
- [ ] Schema references resolve and render
- [ ] `x-related` links appear at page bottom
- [ ] Navigation shows correct tag structure
- [ ] Mobile responsive layout works
- [ ] No console errors in browser DevTools
- [ ] "On this page" TOC links work correctly
- [ ] Cypress tests pass
