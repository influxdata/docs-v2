---
branch: feat-api-uplift
repo: docs-v2
created: 2025-12-02T15:28:32Z
status: in-progress
---

# feat-api-uplift

## Overview

Replace the current API reference documentation implementation (RapiDoc web components) with Hugo-native templates.

## Phase 1: Core Infrastructure (completed)

### Build process

- `yarn build:api` parses OpenAPI specs into Hugo data
- Generates Hugo pages with frontmatter for Algolia search integration
- Static JSON chunks for faster page loads

### OpenAPI tag cleanup

- Removed unused tags from OpenAPI specs
- Updated tags to be consistent and descriptive

### Hugo-native POC

- Implemented Hugo-native templates in `layouts/partials/api/hugo-native/`
- Tested with InfluxDB 3 Core product

## Phase 2: Migration to Hugo-Native (in progress)

**Plan**: @plans/2026-02-13-hugo-native-api-migration.md

### Task Order

1. ✅ **Promote Hugo-native templates** - Move from POC to production
2. ✅ **Remove RapiDoc templates** - Delete templates and partials
3. ✅ **Remove RapiDoc JavaScript** - Delete components
4. ✅ **Remove operation pages** - Delete individual operation page generation
5. ✅ **Update Cypress tests** - Simplify tests for static HTML
6. ✅ **Clean up styles** - Remove RapiDoc CSS and dead auth modal code
7. **Fix generation script cleanup** - Add `--clean` flag (planned)
8. **Apply Cache Data tag split** - Enterprise spec update (planned)
9. **Migrate remaining products** - Apply to all InfluxDB products (planned)

## Related Files

- Branch: `feat-api-uplift`
- Plan: `plans/2026-02-13-hugo-native-api-migration.md`

## Notes

- Use Chrome devtools and Cypress to debug
- No individual operation pages - operations accessed only via tag pages
