# Hugo-Native API Reference Migration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete migration to Hugo-native API reference rendering for all InfluxDB products, removing RapiDoc and simplifying the codebase.

**Architecture:** The Hugo-native approach renders OpenAPI specs using Hugo templates instead of RapiDoc web components. This provides faster page loads, better SEO, consistent styling, and easier customization. Users access operations only through tag pages (no individual operation URLs).

**Tech Stack:** TypeScript (generation scripts), Hugo templates, SCSS, OpenAPI 3.0 specs

***

## Overview

### Design Principles

- **Consistency:** Unified look and feel across all API reference pages
- **Performance:** Fast page loads, full SEO indexability (no shadow DOM)
- **Simplicity:** No web components, no client-side rendering
- **Tag-based navigation:** Operations grouped by tag, accessed via tag pages only

### URL Structure

- **API index:** `/influxdb3/core/api/`
- **Tag page:** `/influxdb3/core/api/cache-distinct-values/`
- **All endpoints:** `/influxdb3/core/api/all-endpoints/`

**Note:** Individual operation pages (e.g., `/influxdb3/core/api/v1/write/`) are being removed. Operations are accessed only through tag pages.

***

## Migration Tasks

### Task 1: Promote Hugo-native templates to default ✅ COMPLETED

**Priority:** High | **Status:** Completed 2026-02-13

Move Hugo-native templates from POC location to production location.

**Files moved:**

- `layouts/partials/api/hugo-native/tag-renderer.html` → `layouts/partials/api/tag-renderer.html`
- `layouts/partials/api/hugo-native/operation.html` → `layouts/partials/api/operation.html`
- `layouts/partials/api/hugo-native/parameters.html` → `layouts/partials/api/parameters.html`
- `layouts/partials/api/hugo-native/parameter-row.html` → `layouts/partials/api/parameter-row.html`
- `layouts/partials/api/hugo-native/request-body.html` → `layouts/partials/api/request-body.html`
- `layouts/partials/api/hugo-native/schema.html` → `layouts/partials/api/schema.html`
- `layouts/partials/api/hugo-native/responses.html` → `layouts/partials/api/responses.html`

**Completed steps:**

1. ✅ Moved 7 files from `hugo-native/` subdirectory to parent directory
2. ✅ Updated `layouts/api/list.html` to use new locations (removed `hugo-native/` prefix)
3. ✅ Removed `$useHugoNative` conditional logic from `layouts/api/list.html`
4. ✅ Deleted `layouts/partials/api/hugo-native/` directory

**Verification:** Hugo build passes, pages render correctly at `/influxdb3/core/api/`

***

### Task 2: Remove RapiDoc templates and partials ✅ COMPLETED

**Priority:** High | **Status:** Completed 2026-02-13

Delete RapiDoc-specific templates now that Hugo-native is the default.

**Files deleted:**

- `layouts/partials/api/rapidoc.html`
- `layouts/partials/api/rapidoc-tag.html`
- `layouts/partials/api/rapidoc-mini.html`

**Verification:** `grep -r "rapidoc" layouts/` returns no results

***

### Task 3: Remove RapiDoc JavaScript components ✅ COMPLETED

**Priority:** High | **Status:** Completed 2026-02-13

Delete RapiDoc-specific TypeScript components.

**Files deleted:**

- `assets/js/components/api-rapidoc.ts`
- `assets/js/components/rapidoc-mini.ts`

**Files updated:**

- `assets/js/main.js` - Removed RapiDoc component imports and registrations

**Verification:** `yarn build:ts` completes without errors

***

### Task 4: Remove operation page generation ✅ COMPLETED

**Priority:** High | **Status:** Completed 2026-02-13

Update generation scripts to remove dead code and RapiDoc references.

**Files modified:**

- `api-docs/scripts/generate-openapi-articles.ts` - Removed \~200 lines of dead `generatePathPages` function
- `api-docs/scripts/openapi-paths-to-hugo-data/index.ts` - Updated comments to remove RapiDoc references

**Changes:**

1. ✅ Removed dead `generatePathPages` function (operation page generation was already disabled)
2. ✅ Updated comments from "RapiDoc" to "Hugo-native templates"
3. ✅ Updated "RapiDoc fragment links" to "OpenAPI fragment links"

**Note:** The `useHugoNative` flag was not found in the codebase - operation page generation was already disabled with a comment noting operations are rendered inline on tag pages.

***

### Task 5: Update Cypress tests for Hugo-native ✅ COMPLETED

**Priority:** High | **Status:** Completed 2026-02-13

Simplified Cypress tests now that we use standard HTML instead of shadow DOM.

**Files modified:**

- `cypress/e2e/content/api-reference.cy.js` - Rewrote test file

**Changes:**

1. ✅ Removed entire "RapiDoc Mini component" describe block (\~160 lines of shadow DOM tests)
2. ✅ Added "API tag pages" tests with Hugo-native selectors (`.api-operation`, `.api-method`, `.api-path`)
3. ✅ Added "API section page structure" tests
4. ✅ Added "All endpoints page" tests
5. ✅ Updated "API reference layout" tests to use Hugo-native selectors

**New test structure implemented:**

- `API reference content` - Tests API index pages load with valid links
- `API reference layout` - Tests 3-column layout (sidebar, content, TOC)
- `API tag pages` - Tests operation rendering, method badges, TOC links
- `API section page structure` - Tests tag listing on section pages
- `All endpoints page` - Tests operation cards with links to tag pages

***

### Task 6: Clean up styles ✅ COMPLETED

**Priority:** Medium | **Status:** Completed 2026-02-13

Remove RapiDoc-specific styles, JavaScript, and references from the codebase.

**Files modified:**

- `assets/styles/layouts/_api-layout.scss` - Removed \~40 lines of `rapi-doc::part()` CSS selectors
- `assets/styles/layouts/_api-overrides.scss` - Updated comment header
- `assets/styles/layouts/_api-security-schemes.scss` - Removed \~290 lines of dead auth modal styles
- `assets/js/main.js` - Removed dead `api-auth-input` import and registration
- `assets/js/components/api-toc.ts` - Removed RapiDoc-specific code and updated comments

**Files deleted:**

- `static/css/rapidoc-custom.css` - Unused static CSS file

**Changes:**

1. ✅ Removed `rapi-doc` container styling and `::part()` selectors from `_api-layout.scss`
2. ✅ Removed dead auth modal section from `_api-security-schemes.scss` (was for RapiDoc "Try it" integration)
3. ✅ Removed `api-auth-input` dead import from `main.js` (component file was already deleted)
4. ✅ Removed `setupRapiDocNavigation()` dead function and references from `api-toc.ts`
5. ✅ Updated comments throughout to remove RapiDoc mentions
6. ✅ Rebuilt `api-docs/scripts/dist/` to update compiled JavaScript

**Architecture decision:** Kept operation styles separate from layout styles for cleaner separation of concerns:

- `_api-layout.scss` handles page structure and navigation
- `_api-operations.scss` handles operation/schema component rendering (renamed from `_api-hugo-native.scss`)

***

### Task 7: Fix Generation Script for Clean Regeneration

**Priority:** Medium

Update the generation script to properly clean directories before regenerating.

**Files to modify:**

- `api-docs/scripts/generate-openapi-articles.ts`
- `api-docs/scripts/openapi-paths-to-hugo-data/index.ts`

**Requirements:**

1. Add `--clean` flag to remove target directories before generating
2. Track expected output files and warn about stale entries
3. Clear Hugo resource cache when structural changes detected

***

### Task 8: Apply Cache Data tag split to InfluxDB 3 Enterprise

**Priority:** Medium

Apply the same tag split done for Core.

**Files to modify:**

- `api-docs/influxdb3/enterprise/v3/ref.yml`

**Changes:**

1. Replace "Cache data" tag with "Cache distinct values" and "Cache last value" tags
2. Update operation tag references
3. Update x-tagGroups references
4. Regenerate: `sh api-docs/generate-api-docs.sh`

***

### Task 9: Migrate remaining products to Hugo-native

**Priority:** Medium

After the infrastructure is in place, migrate remaining products.

**Products:**

- [ ] cloud-dedicated (management API)
- [ ] cloud-serverless
- [ ] clustered (management API)
- [ ] cloud-v2
- [ ] oss-v2
- [ ] oss-v1

**For each product:**

1. Review tag structure in OpenAPI spec
2. Add `x-influxdata-related` links where appropriate
3. Clean and regenerate
4. Verify all tag pages render correctly

***

## Key Files Reference

**Hugo-Native Templates (after migration):**

- `layouts/partials/api/tag-renderer.html` - Main tag page renderer
- `layouts/partials/api/operation.html` - Individual operation renderer
- `layouts/partials/api/parameters.html` - Parameters section
- `layouts/partials/api/parameter-row.html` - Single parameter row
- `layouts/partials/api/request-body.html` - Request body section
- `layouts/partials/api/schema.html` - JSON schema renderer
- `layouts/partials/api/responses.html` - Response section

**Layouts:**

- `layouts/api/list.html` - Tag page layout (Hugo-native only)
- `layouts/api/section.html` - API section page layout
- `layouts/api/all-endpoints.html` - All endpoints page layout

**Styles:**

- `assets/styles/layouts/_api-layout.scss` - Consolidated API styles

**Generation:**

- `api-docs/scripts/generate-openapi-articles.ts` - Main generation script
- `api-docs/scripts/openapi-paths-to-hugo-data/index.ts` - OpenAPI processing

***

## Verification Checklist

Before considering migration complete for each product:

- [ ] All tag pages render without errors
- [ ] Operation details (parameters, request body, responses) display correctly
- [ ] Schema references resolve and render
- [ ] `x-influxdata-related` links appear at page bottom
- [ ] Navigation shows correct tag structure
- [ ] Mobile responsive layout works
- [ ] No console errors in browser DevTools
- [ ] "On this page" TOC links work correctly
- [ ] Cypress tests pass
- [ ] No RapiDoc references remain in codebase

## Files to Delete (Summary)

**Already deleted (Tasks 1-3):**

- ✅ `layouts/partials/api/rapidoc.html`
- ✅ `layouts/partials/api/rapidoc-tag.html`
- ✅ `layouts/partials/api/rapidoc-mini.html`
- ✅ `layouts/partials/api/hugo-native/` (entire directory - 7 files moved to parent)
- ✅ `assets/js/components/api-rapidoc.ts`
- ✅ `assets/js/components/rapidoc-mini.ts`

**Still to review (Task 6):**

- `assets/styles/layouts/_api-overrides.scss` (if RapiDoc-only)

***

## Migration Findings

### Completed Work Summary (Tasks 1-5)

**Infrastructure changes:**

- Hugo-native templates are now the default (no feature flag required)
- All RapiDoc code removed from layouts and JavaScript
- Generation scripts cleaned up (\~200 lines of dead code removed)
- Cypress tests simplified (no more shadow DOM piercing)

**Key discoveries:**

1. The `useHugoNative` flag did not exist in the codebase - operation page generation was already disabled
2. The `generatePathPages` function was dead code that could be safely removed
3. RapiDoc Mini tests were \~160 lines that are no longer needed
4. Hugo build and TypeScript compilation both pass after all changes

**Verification status:**

- ✅ Hugo build: `npx hugo --quiet` passes
- ✅ TypeScript: `yarn build:ts` passes
- ⏳ Cypress tests: Need to run `yarn test:e2e` to verify new tests pass
- ⏳ Visual review: Need to check pages render correctly in browser

### Remaining Work (Tasks 6-9)

1. **Task 6 (styles)**: Review and consolidate SCSS files
2. **Task 7 (clean regeneration)**: Add `--clean` flag to generation scripts
3. **Task 8 (Enterprise tags)**: Split Cache Data tag in Enterprise spec
4. **Task 9 (product migration)**: Apply to remaining 6 products
