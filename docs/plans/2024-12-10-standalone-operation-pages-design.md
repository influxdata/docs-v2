# Standalone API Operation Pages Design

## Overview

Create individual pages for each API operation with path-based URLs, rendered using RapiDoc Mini with existing tag-level OpenAPI specs.

## Goals

- **SEO/discoverability**: Each operation indexable with its own URL and metadata
- **Deep linking**: Reliable bookmarkable/shareable URLs for specific operations
- **Navigation UX**: Sidebar links navigate to actual pages (not hash fragments)
- **Content customization**: Foundation for adding operation-specific guides and examples

## URL Structure

Path-based URLs with HTTP method as the final segment:

| Operation          | API Path                            | Page URL                             |
| ------------------ | ----------------------------------- | ------------------------------------ |
| PostV1Write        | `POST /write`                       | `/api/write/post/`                   |
| PostV2Write        | `POST /api/v2/write`                | `/api/v2/write/post/`                |
| PostWriteLP        | `POST /api/v3/write_lp`             | `/api/v3/write_lp/post/`             |
| GetV1ExecuteQuery  | `GET /query`                        | `/api/query/get/`                    |
| PostExecuteV1Query | `POST /query`                       | `/api/query/post/`                   |
| GetExecuteQuerySQL | `GET /api/v3/query_sql`             | `/api/v3/query_sql/get/`             |
| GetDatabases       | `GET /api/v3/configure/database`    | `/api/v3/configure/database/get/`    |
| DeleteDatabase     | `DELETE /api/v3/configure/database` | `/api/v3/configure/database/delete/` |

## Architecture

### Existing Components (unchanged)

- **Tag pages**: `/api/write-data/`, `/api/query-data/` etc. remain as landing pages
- **Tag-level specs**: `static/openapi/influxdb-{product}/tags/tags/ref-{tag}.yaml` (\~30-50KB each)
- **Sidebar structure**: Tag-based groups with operation summaries as link text

### New Components

1. **Operation page content files**: Generated at path-based locations
2. **Operation page template**: Hugo layout using RapiDoc Mini
3. **Updated sidebar links**: Point to path-based URLs instead of hash fragments

## Content File Structure

Generated operation pages at `content/influxdb3/{product}/api/{path}/{method}/_index.md`:

```yaml
---
title: Write line protocol (v1-compatible)
description: Write data using InfluxDB v1-compatible line protocol endpoint
type: api-operation
layout: operation
# RapiDoc Mini configuration
specFile: /openapi/influxdb-influxdb3_core/tags/tags/ref-write-data.yaml
matchPaths: post /write
# Operation metadata
operationId: PostV1Write
method: POST
apiPath: /write
tag: Write data
compatVersion: v1
# Links
related:
  - /influxdb3/core/write-data/http-api/compatibility-apis/
---
```

## Hugo Template

New layout `layouts/api-operation/operation.html`:

```html
{{ define "main" }}
<article class="api-operation-page">
  <header>
    <h1>{{ .Title }}</h1>
    <div class="api-operation-meta">
      <span class="api-method api-method--{{ lower .Params.method }}">{{ .Params.method }}</span>
      <code class="api-path">{{ .Params.apiPath }}</code>
      {{ with .Params.compatVersion }}
      <span class="api-compat-badge api-compat-badge--{{ . }}">{{ . }}</span>
      {{ end }}
    </div>
  </header>

  <rapi-doc-mini
    spec-url="{{ .Params.specFile }}"
    match-paths="{{ .Params.matchPaths }}"
    theme="light"
    bg-color="transparent"
    paths-expanded="true"
    schema-expand-level="1">
  </rapi-doc-mini>

  {{ with .Params.related }}
  <aside class="related-content">
    <h2>Related documentation</h2>
    <ul>
      {{ range . }}
      <li><a href="{{ . }}">{{ . }}</a></li>
      {{ end }}
    </ul>
  </aside>
  {{ end }}
</article>
{{ end }}
```

## Sidebar Navigation Changes

Update `layouts/partials/sidebar/api-menu-items.html` to generate path-based URLs:

**Before:**

```go
{{ $fragment := printf "#operation/%s" .operationId }}
{{ $fullUrl := printf "%s%s" $tagPageUrl $fragment }}
```

**After:**

```go
{{ $apiPath := .path }}
{{ $method := lower .method }}
{{ $pathSlug := $apiPath | replaceRE "^/" "" }}
{{ $operationUrl := printf "/%s/%s/api/%s/%s/" $product $version $pathSlug $method | relURL }}
```

## Generator Changes

Update `api-docs/scripts/openapi-paths-to-hugo-data/index.ts`:

1. Add new function `generateOperationPages()` that creates content files for each operation
2. Include operation metadata: specFile path, matchPaths filter, tag association
3. Call from `generateHugoDataByTag()` after generating tag-based articles

## File Generation Summary

For InfluxDB 3 Core (\~43 operations), this creates:

- \~43 new content files at `content/influxdb3/core/api/{path}/{method}/_index.md`
- No new spec files (reuses existing tag-level specs)

## Data Flow

```
OpenAPI Spec
    ↓
Generator extracts operations
    ↓
Creates content files with frontmatter (specFile, matchPaths, metadata)
    ↓
Hugo builds pages using api-operation/operation.html template
    ↓
RapiDoc Mini loads tag-level spec, filters to single operation client-side
```

## Testing Plan

1. Generate operation pages for Core product
2. Verify URLs resolve correctly
3. Verify RapiDoc Mini renders single operation
4. Verify sidebar links navigate to operation pages
5. Test deep linking (direct URL access)
6. Check page titles and meta descriptions for SEO

## Future Improvements

- Generate operation-level specs for smaller payloads (if performance issues arise)
- Add custom content sections per operation
- Implement operation search/filtering on tag pages

## Migration Notes

When migrating other product specs from Redoc to RapiDoc:

1. **Remove `x-tagGroups`**: This is a Redoc-specific extension for sidebar navigation grouping. RapiDoc doesn't use it. The Hugo sidebar uses `data/api_nav_groups.yml` instead.

2. **Ensure tag consistency**: The sidebar navigation (`api_nav_groups.yml`) must match the tag names in the spec's `tags` section exactly.

3. **Single-tag operations**: Operations should ideally have a single tag to avoid duplicate rendering. If an operation has multiple tags, the generator restricts it to the primary tag in tag-specific specs.
