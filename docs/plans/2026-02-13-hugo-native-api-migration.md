# Hugo-Native API Reference Migration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete migration to Hugo-native API reference rendering for all InfluxDB products, replacing RapiDoc where appropriate and ensuring clean automated workflows.

**Architecture:** The Hugo-native approach renders OpenAPI specs using Hugo templates instead of the RapiDoc web component. This provides faster page loads, better SEO, consistent styling, and easier customization. The generation script creates Hugo content pages with frontmatter referencing tag-specific OpenAPI spec files.

**Tech Stack:** TypeScript (generation scripts), Hugo templates, SCSS, OpenAPI 3.0 specs

---

## Overview

### Hugo-Native vs RapiDoc

| Aspect | RapiDoc | Hugo-Native |
|--------|---------|-------------|
| Rendering | Client-side JS web component | Server-side Hugo templates |
| Page load | Slower (JS hydration) | Faster (static HTML) |
| SEO | Limited (shadow DOM) | Full indexability |
| Styling | CSS variables, limited control | Full SCSS integration |
| Try It Out | Built-in | Requires custom implementation |
| Maintenance | External dependency | Internal templates |

### Current Implementation Status

| Product | RapiDoc | Hugo-Native | Notes |
|---------|---------|-------------|-------|
| influxdb3-core | ✅ Working | ✅ Implemented | Ready for testing |
| influxdb3-enterprise | ✅ Working | ⏳ Pending | Needs Hugo-native migration |
| cloud-dedicated | ✅ Working | ⏳ Pending | Uses management API |
| cloud-serverless | ✅ Working | ⏳ Pending | Uses v2 API style |
| clustered | ✅ Working | ⏳ Pending | Uses management API |
| cloud-v2 | ✅ Working | ❓ TBD | Evaluate need |
| oss-v2 | ✅ Working | ❓ TBD | Evaluate need |
| oss-v1 | ✅ Working | ❓ TBD | Evaluate need |

### Key Files

**Hugo-Native Templates:**
- `layouts/partials/api/hugo-native/tag-renderer.html` - Main tag page renderer
- `layouts/partials/api/hugo-native/operation.html` - Individual operation renderer
- `layouts/partials/api/hugo-native/parameters.html` - Parameters section
- `layouts/partials/api/hugo-native/parameter-row.html` - Single parameter row
- `layouts/partials/api/hugo-native/request-body.html` - Request body section
- `layouts/partials/api/hugo-native/schema.html` - JSON schema renderer
- `layouts/partials/api/hugo-native/responses.html` - Response section

**Styles:**
- `assets/styles/layouts/_api-hugo-native.scss` - Hugo-native specific styles

**Generation:**
- `api-docs/scripts/generate-openapi-articles.ts` - Main generation script
- `api-docs/scripts/openapi-paths-to-hugo-data/index.ts` - OpenAPI processing

**Layouts:**
- `layouts/api/list.html` - Tag page layout (supports both RapiDoc and Hugo-native)

### OpenAPI Extension: x-influxdata-related

The `x-influxdata-related` vendor extension defines related documentation links for tags:

```yaml
tags:
  - name: Cache distinct values
    description: |
      The Distinct Value Cache (DVC) lets you cache distinct values...
    x-influxdata-related:
      - title: Manage the Distinct Value Cache
        href: /influxdb3/core/admin/distinct-value-cache/
```

These links render at the bottom of the tag page, consistent with the `related:` frontmatter pattern used elsewhere.

---

## Automated Workflow Issues

During development, several issues were discovered that impact the automated workflow:

### Issue 1: Generation Script Merges Instead of Replacing

**Problem:** When regenerating pages after tag changes (rename, split, remove), the generation script adds new entries but doesn't remove old ones from:
- `data/article_data/influxdb/influxdb3_*/`
- `static/openapi/influxdb3-*/`
- `content/influxdb3/*/api/` (gitignored directories)

**Current Workaround:**
```bash
# Before regenerating, manually clean:
rm -rf data/article_data/influxdb/influxdb3_core/
rm -rf static/openapi/influxdb3-core/
rm -rf content/influxdb3/core/api/
```

**Recommended Fix:** Update the generation script to:
1. Accept a `--clean` flag that removes target directories before generating
2. Track generated files and remove stale entries
3. Use content checksums to detect unchanged files

### Issue 2: Hugo Cache Holds Stale Data

**Problem:** After significant structural changes (tag renames, splits), Hugo's resource cache may hold stale data, causing old navigation items to persist.

**Current Workaround:**
```bash
rm -rf resources/_gen/
```

**Recommended Fix:** Add cache clearing to the generation script when structural changes are detected.

### Issue 3: Gitignored Content Files Lose Configuration

**Problem:** The `useHugoNative: true` flag must be set in generated `_index.md` files, but these files are gitignored. Configuration is lost between regenerations.

**Current Workaround:** Manually edit generated files or modify the generation script config.

**Recommended Fix:**
- Add `useHugoNative` to the product configuration in `generate-openapi-articles.ts`
- Or store rendering preferences in a non-gitignored config file

### Issue 4: Old Tag Directories Persist

**Problem:** When renaming or removing tags, old content directories remain (e.g., `content/influxdb3/core/api/cache-data/` after splitting to `cache-distinct-values/` and `cache-last-value/`).

**Recommended Fix:** The generation script should track expected output directories and remove unexpected ones.

---

## Migration Tasks

### Task 1: Apply Cache Data Tag Split to InfluxDB 3 Enterprise

**Priority:** High
**Estimated Effort:** 30 minutes

The same "Cache data" tag split applied to Core needs to be applied to Enterprise.

**Files to Modify:**
- `api-docs/influxdb3/enterprise/v3/ref.yml`

**Step 1: Update Enterprise OpenAPI spec**

Replace the single "Cache data" tag with two separate tags:

```yaml
tags:
  # ... other tags ...
  - name: Cache distinct values
    description: |
      The Distinct Value Cache (DVC) lets you cache distinct
      values of one or more columns in a table, improving the performance of
      queries that return distinct tag and field values.

      The DVC is an in-memory cache that stores distinct values for specific columns
      in a table. When you create a DVC, you can specify what columns' distinct
      values to cache, the maximum number of distinct value combinations to cache, and
      the maximum age of cached values. A DVC is associated with a table, which can
      have multiple DVCs.
    x-influxdata-related:
      - title: Manage the Distinct Value Cache
        href: /influxdb3/enterprise/admin/distinct-value-cache/
  - name: Cache last value
    description: |
      The Last Value Cache (LVC) lets you cache the most recent
      values for specific fields in a table, improving the performance of queries that
      return the most recent value of a field for specific series or the last N values
      of a field.

      The LVC is an in-memory cache that stores the last N number of values for
      specific fields of series in a table. When you create an LVC, you can specify
      what fields to cache, what tags to use to identify each series, and the
      number of values to cache for each unique series.
      An LVC is associated with a table, which can have multiple LVCs.
    x-influxdata-related:
      - title: Manage the Last Value Cache
        href: /influxdb3/enterprise/admin/last-value-cache/
```

**Step 2: Update operation tags**

Change tag references in paths:

- `/api/v3/configure/distinct_cache` POST → tags: `["Cache distinct values"]`
- `/api/v3/configure/distinct_cache` DELETE → tags: `["Cache distinct values"]`
- `/api/v3/configure/last_cache` POST → tags: `["Cache last value"]`
- `/api/v3/configure/last_cache` DELETE → tags: `["Cache last value"]`

**Step 3: Update x-tagGroups**

Update any `x-tagGroups` references from "Cache data" to the two new tag names.

**Step 4: Clean and regenerate**

```bash
rm -rf data/article_data/influxdb/influxdb3_enterprise/
rm -rf static/openapi/influxdb3-enterprise/
rm -rf content/influxdb3/enterprise/api/
sh api-docs/generate-api-docs.sh
```

**Step 5: Verify in browser**

```bash
npx hugo server
# Visit http://localhost:1313/influxdb3/enterprise/api/
```

**Step 6: Commit**

```bash
git add api-docs/influxdb3/enterprise/v3/ref.yml
git commit -m "refactor(api): split Cache data tag into Cache distinct values and Cache last value for Enterprise"
```

---

### Task 2: Enable Hugo-Native for InfluxDB 3 Enterprise

**Priority:** High
**Estimated Effort:** 1 hour

**Files to Modify:**
- `api-docs/scripts/generate-openapi-articles.ts` (add `useHugoNative: true` to config)

**Step 1: Update generation config**

Add Hugo-native flag to Enterprise product configuration.

**Step 2: Clean and regenerate**

```bash
rm -rf data/article_data/influxdb/influxdb3_enterprise/
rm -rf static/openapi/influxdb3-enterprise/
rm -rf content/influxdb3/enterprise/api/
sh api-docs/generate-api-docs.sh
```

**Step 3: Verify rendering**

- Check that pages render with Hugo-native templates (no RapiDoc shadow DOM)
- Verify operation parameters, request bodies, and responses render correctly
- Check "Related guides" links appear at page bottom

---

### Task 3: Fix Generation Script for Clean Regeneration

**Priority:** High
**Estimated Effort:** 2-4 hours

**Files to Modify:**
- `api-docs/scripts/generate-openapi-articles.ts`
- `api-docs/scripts/openapi-paths-to-hugo-data/index.ts`

**Requirements:**
1. Add `--clean` flag to remove target directories before generating
2. Track expected output files and warn about/remove stale entries
3. Clear Hugo resource cache when structural changes detected
4. Add `useHugoNative` to product configuration (not generated content)

---

### Task 4: Migrate Cloud Dedicated to Hugo-Native

**Priority:** Medium
**Estimated Effort:** 2 hours

**Files:**
- `api-docs/influxdb3/cloud-dedicated/management/openapi.yml`
- `api-docs/scripts/generate-openapi-articles.ts`

**Steps:**
1. Review tag structure in Cloud Dedicated spec
2. Add `x-influxdata-related` links where appropriate
3. Update generation config with `useHugoNative: true`
4. Clean and regenerate
5. Test all tag pages render correctly

---

### Task 5: Migrate Cloud Serverless to Hugo-Native

**Priority:** Medium
**Estimated Effort:** 2 hours

**Files:**
- `api-docs/influxdb3/cloud-serverless/v2/ref.yml`
- `api-docs/scripts/generate-openapi-articles.ts`

**Steps:**
1. Review tag structure in Cloud Serverless spec
2. Add `x-influxdata-related` links where appropriate
3. Update generation config with `useHugoNative: true`
4. Clean and regenerate
5. Test all tag pages render correctly

---

### Task 6: Migrate Clustered to Hugo-Native

**Priority:** Medium
**Estimated Effort:** 2 hours

**Files:**
- `api-docs/influxdb3/clustered/management/openapi.yml`
- `api-docs/scripts/generate-openapi-articles.ts`

**Steps:**
1. Review tag structure in Clustered spec
2. Add `x-influxdata-related` links where appropriate
3. Update generation config with `useHugoNative: true`
4. Clean and regenerate
5. Test all tag pages render correctly

---

### Task 7: Evaluate v2/v1 Products for Hugo-Native

**Priority:** Low
**Estimated Effort:** 1 hour (evaluation)

Evaluate whether InfluxDB v2 and v1 API references would benefit from Hugo-native rendering:

**Considerations:**
- v2/v1 APIs are more complex with more operations
- RapiDoc "Try It Out" feature may be more valuable for these APIs
- Migration effort vs. benefit analysis

**Decision criteria:**
- [ ] Page load performance comparison
- [ ] SEO requirements
- [ ] "Try It Out" usage analytics
- [ ] Maintenance burden

---

## Verification Checklist

Before considering Hugo-native migration complete for each product:

- [ ] All tag pages render without errors
- [ ] Operation details (parameters, request body, responses) display correctly
- [ ] Schema references resolve and render
- [ ] `x-influxdata-related` links appear at page bottom
- [ ] Navigation shows correct tag structure
- [ ] Mobile responsive layout works
- [ ] No console errors in browser DevTools
- [ ] "On this page" TOC links work correctly
- [ ] Links validation passes

---

## Rollback Plan

If issues are found with Hugo-native rendering:

1. Remove `useHugoNative` flag from product config
2. Regenerate content (RapiDoc will be used by default)
3. Verify RapiDoc rendering works

```bash
# Example rollback
rm -rf content/influxdb3/core/api/
sh api-docs/generate-api-docs.sh
```

---

## Notes

- Hugo-native templates are in `layouts/partials/api/hugo-native/`
- The `useHugoNative` flag controls which renderer is used in `layouts/api/list.html`
- Both RapiDoc and Hugo-native can coexist - different products can use different renderers
- The `x-influxdata-related` extension works with both renderers
