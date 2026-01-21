# API Tag Pages Design

## Overview

Consolidate API documentation onto tag pages, where each tag page displays all operations for that tag using RapiDoc. This replaces the previous path-based page structure.

## Goals

1. Keep tag-based navigation in the left sidebar
2. Remove operations as children of tags in the left sidebar
3. Each tag page displays all RapiDoc renderings for operations in that tag
4. "On this page" TOC links to Overview and each operation
5. No frame/internal scrolling - page scrolls naturally as one document
6. Consistent styling with existing implementation
7. Clear visual separation between operations

## URL Structure

- **Tag page:** `/influxdb3/core/api/cache-data/`
- **Operation anchor:** `/influxdb3/core/api/cache-data/#post-/api/v3/configure/distinct_cache`

## RapiDoc Anchor Reference

| Feature | Format/Value |
|---------|--------------|
| Anchor format | `#{method}-{path}` (e.g., `#post-/api/v3/configure/distinct_cache`) |
| `goto-path` attribute | Navigate to operation on load: `goto-path="post-/api/v3/configure/distinct_cache"` |
| `scrollToPath(path)` method | Programmatic navigation |
| `update-route` (default: true) | Updates URL hash as user scrolls |
| `route-prefix` (default: #) | Hash prefix for routes |
| Built-in anchors | `#overview`, `#servers`, `#auth`, `#operations-top` |

## Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header / Top Nav                                            │
├──────────┬─────────────────────────────────────┬────────────┤
│          │                                     │            │
│  Left    │  Main Content                       │  On This   │
│  Sidebar │                                     │  Page TOC  │
│  (nav)   │  ┌─────────────────────────────┐   │            │
│          │  │ <h1>Cache data</h1>         │   │  Overview  │
│          │  │ <p>Tag description...</p>   │   │  POST ...  │
│          │  └─────────────────────────────┘   │  DELETE .. │
│          │                                     │  POST ...  │
│          │  ┌─────────────────────────────┐   │  DELETE .. │
│          │  │ RapiDoc (full height,       │   │            │
│          │  │ no internal scroll)         │   │            │
│          │  │                             │   │            │
│          │  │ - POST distinct_cache       │   │            │
│          │  │ - DELETE distinct_cache     │   │            │
│          │  │ - POST last_cache           │   │            │
│          │  │ - DELETE last_cache         │   │            │
│          │  │                             │   │            │
│          │  └─────────────────────────────┘   │            │
│          │                                     │            │
├──────────┴─────────────────────────────────────┴────────────┤
│ Footer                                                      │
└─────────────────────────────────────────────────────────────┘
```

## RapiDoc Configuration

- `render-style="read"` - Linear document flow (no internal scrolling)
- `spec-url` - Tag-specific spec (e.g., `/openapi/influxdb3-core/tags/tags/influxdb3-core-cache-data.yaml`)
- `update-route="true"` - URL updates as user navigates (default)
- No fixed height on container - expands to fit content

## "On This Page" TOC

Generated server-side from frontmatter `operations` array:

```yaml
operations:
  - operationId: PostConfigureDistinctCache
    method: POST
    path: /api/v3/configure/distinct_cache
    summary: Create distinct cache
  - operationId: DeleteConfigureDistinctCache
    method: DELETE
    path: /api/v3/configure/distinct_cache
    summary: Delete distinct cache
```

TOC output:
```
ON THIS PAGE
- Overview
- POST /api/v3/configure/distinct_cache
- DELETE /api/v3/configure/distinct_cache
- POST /api/v3/configure/last_cache
- DELETE /api/v3/configure/last_cache
```

Links use `#{method}-{path}` format matching RapiDoc anchors.

## Hash Navigation

1. On page load, JS reads `window.location.hash`
2. If hash present, set RapiDoc's `goto-path` attribute (without the `#`)
3. RapiDoc's default `update-route=true` updates URL as user scrolls
4. Native URL sharing works

## Files to Modify

### Layouts
- `layouts/api/list.html` - Embed RapiDoc instead of operation cards grid
- `layouts/partials/api/rapidoc-tag.html` - New partial for tag-level RapiDoc

### JavaScript
- `assets/js/components/rapidoc-mini.ts` - Add hash-based `goto-path` initialization

### Remove/Deprecate
- `layouts/api-path/path.html` - Path page layout
- `layouts/partials/api/rapidoc-path.html` - Path partial
- Generated path pages in `content/influxdb3/*/api/v*/`

### Keep
- Tag-specific spec files (`static/openapi/influxdb3-core/tags/tags/`)
- Generation script for tag pages and article data
- All endpoints page

### Generation Script
- Remove `generatePathPages()` function
- Keep tag page generation
- Ensure frontmatter `operations` array is complete for TOC

## Development Scope

Focus on `influxdb3/core` first, then migrate other products.

## Testing

- Verify tag pages load with all operations rendered
- Test hash navigation (direct URL, TOC clicks, browser back/forward)
- Verify no internal scrolling - page flows naturally
- Check visual separation between operations
- Test "On this page" TOC links
