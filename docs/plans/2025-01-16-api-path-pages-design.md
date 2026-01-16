# API Path Pages Design

> **Status:** Draft
> **Created:** 2025-01-16

## Problem Statement

The current API documentation generates one page per HTTP operation (e.g., `/api/v3/configure/token/admin/post/`).
This is too granular, causing:

1. **Poor SEO/discoverability** - Users searching for "admin token API" may not find the right page
2. **Suboptimal UX** - Users must click through multiple pages to see all operations for an endpoint
3. **No linkable paths** - Cannot link to `/api/v3/configure/token/admin/` to show all methods
4. **Left nav clutter** - Too many items in the sidebar (secondary concern)

## Solution

Generate pages at the **path level** instead of the operation level.
Each API path gets one page showing all HTTP methods for that endpoint.

### URL Structure

**Current (operation-level):**

```
/influxdb3/core/api/v3/configure/token/admin/post/       → POST only
/influxdb3/core/api/v3/configure/token/admin/regenerate/post/  → POST only  
```

**Proposed (path-level):**

```
/influxdb3/core/api/v3/configure/token/admin/            → All methods (POST)
/influxdb3/core/api/v3/configure/token/admin/regenerate/ → All methods (POST)
```

**Benefits:**

- URLs match developer mental model (by endpoint path)
- Linkable paths for documentation and support
- Better SEO - one canonical page per endpoint
- Fewer generated pages (\~35 vs \~52 for Core)
- Right sidebar shows method-based ToC

### RapiDoc Filtering

RapiDoc supports showing all methods for a path using:

- `match-paths="/api/v3/configure/token/admin"` - the path to filter
- `match-type="includes"` - substring matching to include all methods

This replaces the current approach of `match-paths="post /api/v3/configure/token/admin"` which filters to one method.

Source: [RapiDoc API Documentation](https://rapidocweb.com/api.html)

## Implementation

### Files to Modify

| File                                                | Change                                        |
| --------------------------------------------------- | --------------------------------------------- |
| `api-docs/scripts/src/generate-openapi-articles.ts` | Group operations by path, generate path pages |
| `layouts/api-path/path.html`                        | New layout for path pages (all methods)       |
| `layouts/partials/api/rapidoc-path.html`            | New partial with `match-type="includes"`      |
| `assets/js/components/rapidoc-mini.ts`              | Support `data-match-type` attribute           |
| `layouts/api-operation/operation.html`              | Remove (replaced by path layout)              |

### Page Generation Changes

**Current flow:**

```
OpenAPI spec → articles.yml → Tag pages (/api/auth-token/)
                            → Operation pages (/api/v3/.../post/)
```

**Proposed flow:**

```
OpenAPI spec → articles.yml → Tag pages (/api/auth-token/)
                            → Path pages (/api/v3/configure/token/admin/)
```

Key changes to `generateOperationPages()`:

1. Group operations by path instead of creating one page per operation
2. Remove method from URL - page lives at `/api/v3/.../admin/` not `.../post/`
3. Store all methods in frontmatter for ToC generation

### Frontmatter Structure

```yaml
# /api/v3/configure/token/admin/_index.md
---
title: /api/v3/configure/token/admin
description: API reference for /api/v3/configure/token/admin
type: api-path
layout: path
specFile: /openapi/influxdb3-core/paths/api-v3-configure-token-admin.yaml
matchPaths: /api/v3/configure/token/admin
matchType: includes
tag: Auth token
operations:
  - method: POST
    operationId: PostCreateAdminToken
    summary: Create admin token
---
```

### Template Structure

**`layouts/api-path/path.html`:**

```html
{{ partial "header.html" . }}
{{ partial "topnav.html" . }}

<div class="page-wrapper">
  {{ partial "sidebar.html" . }}

  <div class="content-wrapper api-content">
    <div class="api-main">
      <article class="article article--content api-reference api-path-page">
        <h1>{{ .Params.apiPath }}</h1>
        
        {{ partial "api/rapidoc-path.html" . }}
        
        {{ partial "article/related.html" . }}
      </article>
    </div>

    <aside class="api-toc">
      <h4>METHODS</h4>
      <nav>
        {{ range .Params.operations }}
        <a href="#{{ lower .method }}">
          <span class="api-method api-method--{{ lower .method }}">{{ .method }}</span>
          {{ .summary }}
        </a>
        {{ end }}
      </nav>
    </aside>
  </div>
</div>

{{ partial "footer.html" . }}
```

### TypeScript Changes

Add `match-type` support to `rapidoc-mini.ts`:

```typescript
// In createRapiDocElement()
const matchType = container.dataset.matchType || 'includes';
element.setAttribute('match-type', matchType);
```

## Redirects

### Production URLs (Redoc)

Current production uses Redoc with a single-page API reference.
These URLs need redirects to the new structure:

| From                      | To                     |
| ------------------------- | ---------------------- |
| `/influxdb3/core/api/v3/` | `/influxdb3/core/api/` |
| `/influxdb3/core/api/v1/` | `/influxdb3/core/api/` |
| `/influxdb3/core/api/v2/` | `/influxdb3/core/api/` |

Implement via Hugo aliases in the API section index frontmatter.

### Branch URLs (Not deployed)

The current operation-level URLs (`/api/v3/.../post/`) haven't been deployed to production, so no redirects needed.

## Anchor Links

Users can link to specific methods via anchors:

- `/api/v3/configure/token/admin/#post` - links to POST method

RapiDoc generates anchors automatically.
Verify exact anchor format during implementation.

## Testing

1. Verify RapiDoc shows all methods when using `match-type="includes"`
2. Verify anchor links work for individual methods
3. Verify redirects work from old Redoc URLs
4. Verify left nav has fewer items
5. Run existing Cypress API tests (update subjects as needed)

## Open Questions

1. What anchor format does RapiDoc use? (e.g., `#post` vs `#post-api-v3-configure-token-admin`)
2. Should tag pages link directly to path pages or keep linking to operation anchors?
