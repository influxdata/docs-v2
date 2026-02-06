# API Reference RapiDoc Migration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate all InfluxDB products from Redoc-based API reference to the new RapiDoc-based UI that's already working for influxdb3-core and influxdb3-enterprise.

**Architecture:** The new API reference uses RapiDoc Mini to render OpenAPI specs. The generation script (`api-docs/scripts/generate-openapi-articles.ts`) processes OpenAPI specs and creates Hugo content pages with frontmatter that references spec files. Hugo layouts (`layouts/api/` and `layouts/api-operation/`) render these pages using the RapiDoc component.

**Tech Stack:** TypeScript (generation scripts), Hugo templates, RapiDoc web component, OpenAPI 3.0 specs

***

## Overview

### Products to Migrate

| Product                 | Status  | Spec Location                                               | Target Content Path                       |
| ----------------------- | ------- | ----------------------------------------------------------- | ----------------------------------------- |
| influxdb3-core          | ✅ Done  | `api-docs/influxdb3/core/v3/ref.yml`                        | `content/influxdb3/core/api/`             |
| influxdb3-enterprise    | ✅ Done  | `api-docs/influxdb3/enterprise/v3/ref.yml`                  | `content/influxdb3/enterprise/api/`       |
| cloud-dedicated         | Partial | `api-docs/influxdb3/cloud-dedicated/management/openapi.yml` | `content/influxdb3/cloud-dedicated/api/`  |
| cloud-serverless        | Partial | `api-docs/influxdb3/cloud-serverless/v2/ref.yml`            | `content/influxdb3/cloud-serverless/api/` |
| clustered               | Partial | `api-docs/influxdb3/clustered/management/openapi.yml`       | `content/influxdb3/clustered/api/`        |
| cloud-v2                | Partial | `api-docs/influxdb/cloud/v2/ref.yml`                        | `content/influxdb/cloud/api/`             |
| oss-v2                  | Partial | `api-docs/influxdb/v2/v2/ref.yml`                           | `content/influxdb/v2/api/`                |
| oss-v1                  | Partial | `api-docs/influxdb/v1/v1/ref.yml`                           | `content/influxdb/v1/api/`                |
| enterprise\_influxdb-v1 | Partial | `api-docs/enterprise_influxdb/v1/v1/ref.yml`                | `content/enterprise_influxdb/v1/api/`     |

### Key Files

- **Generation script:** `api-docs/scripts/generate-openapi-articles.ts`
- **Core conversion:** `api-docs/scripts/openapi-paths-to-hugo-data/index.ts`
- **Hugo layouts:** `layouts/api/`, `layouts/api-operation/`
- **RapiDoc component:** `assets/js/components/rapidoc-mini.ts`
- **Styles:** `assets/styles/layouts/_api-layout.scss`

***

**API Tag Page Consolidation Complete**

The API documentation structure has been refactored from individual operation pages to consolidated tag pages:

1. **Before**: Each API operation had its own page (e.g., `/api/v3/configure/distinct_cache/`)
2. **After**: All operations for a tag are rendered inline on the tag page (e.g., `/api/cache-data/#post-/api/v3/configure/distinct_cache`)

**Key implementation details:**

- Server-side TOC generated from frontmatter `operations` array using Hugo templates
- `safeURL` filter prevents Hugo from URL-encoding anchor slashes
- JavaScript `api-toc.ts` detects pre-rendered TOC and preserves it
- RapiDoc's `scrollToPath()` method handles TOC click navigation to shadow DOM elements
- `goto-path` attribute initializes RapiDoc to scroll to operation from URL hash on page load
- `update-route="true"` enables RapiDoc to update URL hash as user navigates

See [API tag pages design](2026-01-21-api-tag-pages-design.md) for link anchor patterns and route information.

## Fix all InfluxDB products

These products already have generated content but may need spec adjustments and testing.

### Task 1.1: Verify API Generation

**Files:**

- Check: `content/influxdb3/cloud-dedicated/api/_index.md`
- Check: `api-docs/influxdb3/cloud-dedicated/management/openapi.yml`
- Verify: `static/openapi/influxdb3-cloud-dedicated/`

**Step 1: Check existing generated content**

```bash
ls -la content/influxdb3/cloud-dedicated/api/
cat content/influxdb3/cloud-dedicated/api/_index.md
```

Expected: Should see `_index.md` and subdirectories for each tag.

**Step 2: Verify OpenAPI spec exists and is valid**

```bash
head -50 api-docs/influxdb3/cloud-dedicated/management/openapi.yml
```

Expected: Valid OpenAPI 3.x spec with `openapi:`, `info:`, `paths:` sections.

**Step 3: Run generation**

```bash
yarn build:api-docs
```

Or for just this product:

```bash
node api-docs/scripts/dist/generate-openapi-articles.js cloud-dedicated
```

**Step 4: Start Hugo and verify pages render**

```bash
npx hugo server --port 1315
```

Visit the product URL--for example: <http://localhost:1315/influxdb3/cloud-dedicated/api/>

Expected: API reference pages render with RapiDoc component showing operations.

**Step 5: Check for console errors**

Open browser DevTools, verify no JavaScript errors related to RapiDoc.

**Step 6: Commit if working**

```bash
git add content/influxdb3/cloud-dedicated/api/
git add static/openapi/influxdb3-cloud-dedicated/
git add data/article-data/influxdb3/cloud-dedicated/
git commit -m "feat(api): generate cloud-dedicated API reference with RapiDoc"
```

### How to generate API reference articles

**Step 1: Rebuild TypeScript**

```bash
cd api-docs/scripts && yarn build
```

Or from root:

```bash
tsc --project api-docs/scripts/tsconfig.json
```

**Step 2: Test compilation succeeded**

```bash
node api-docs/scripts/dist/generate-openapi-articles.js --help
```

**Step 3: Commit the config change**

```bash
git add api-docs/scripts/generate-openapi-articles.ts
git commit -m "feat(api): enable cloud-v2 product config for RapiDoc migration"
```

***

## Verification Checklist

Before considering migration complete:

- [ ] All product API pages render without errors
- [ ] RapiDoc "Try It Out" works for each product
- [ ] Mobile responsive layout works correctly
- [ ] Navigation menus updated
- [ ] Old URLs redirect to new locations
- [ ] E2E tests pass
- [ ] No console errors in browser DevTools
- [ ] Links validation passes

***

## Rollback Plan

If issues are found:

1. Revert the product config changes in `generate-openapi-articles.ts`
2. Remove generated content directories
3. Restore original navigation files from git history

```bash
git checkout HEAD~N -- content/influxdb/cloud/reference/api/
git checkout HEAD~N -- api-docs/scripts/generate-openapi-articles.ts
```

***

## Notes

- The `useTagBasedGeneration` option creates pages organized by OpenAPI tags (used for influxdb3 products)
- The path-based generation creates pages organized by API paths (used for v2 products)
- The `skipParentMenu` option prevents duplicate menu entries when existing reference pages have menus
