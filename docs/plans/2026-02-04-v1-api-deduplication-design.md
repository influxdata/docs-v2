# InfluxDB v1 API Consistency Design

**Date:** 2026-02-04
**Goal:** Make InfluxDB v1 API specs consistent with other products by using the same Redocly-based overlay approach.

## Current State

- `api-docs/influxdb/v1/v1/ref.yml` - Complete standalone spec (OSS)
- `api-docs/enterprise_influxdb/v1/v1/ref.yml` - Complete standalone spec (Enterprise)
- Not using Redocly decorators or content overlays
- Not integrated with `getswagger.sh`

## Target State

- Both v1 products use `.config.yml` and `content/` overlays like other products
- Integrated with `getswagger.sh` and Redocly decorator pipeline
- Remove unused tag-groups decorator (not used by RapiDoc)

## Design Decisions

1. **Keep both specs as complete, standalone files** - Accept duplication for simplicity
2. **Use overlays for info and servers only** - Paths stay in each `ref.yml`
3. **Remove tag-groups entirely** - Not used by RapiDoc UI

## Implementation

### 1. Directory Structure

```
api-docs/
  influxdb/
    v1/
      .config.yml                 # Redocly config
      v1/
        content/
          info.yml                # OSS info overlay
          servers.yml             # OSS servers overlay
        ref.yml                   # Complete OSS spec (exists)
  enterprise_influxdb/
    v1/
      .config.yml                 # Redocly config
      v1/
        content/
          info.yml                # Enterprise info overlay
          servers.yml             # Enterprise servers overlay
        ref.yml                   # Complete Enterprise spec (exists)
```

### 2. Redocly Decorator Changes

**Remove (unused with RapiDoc):**

- `openapi/plugins/decorators/tags/set-tag-groups.cjs`
- `tag-groups.yml` loading from `docs-content.cjs`
- `set-tag-groups` references in `docs-plugin.cjs`
- All `content/tag-groups.yml` files across products

**Keep:**

- `set-info.cjs` - merges info.yml overlay
- `set-servers.cjs` - merges servers.yml overlay
- `replace-shortcodes.cjs` - handles doc URL placeholders

### 3. getswagger.sh Changes

Add functions:

```bash
function updateOSSV1 {
  postProcess influxdb/v1/v1/ref.yml 'influxdb/v1/.config.yml' 'v1@1'
}

function updateEnterpriseV1 {
  postProcess enterprise_influxdb/v1/v1/ref.yml 'enterprise_influxdb/v1/.config.yml' 'v1@1'
}
```

## Tasks

1. [x] Create `influxdb/v1/.config.yml`
2. [x] Create `influxdb/v1/v1/content/info.yml`
3. [x] Create `influxdb/v1/v1/content/servers.yml`
4. [x] Create `enterprise_influxdb/v1/.config.yml`
5. [x] Create `enterprise_influxdb/v1/v1/content/info.yml`
6. [x] Create `enterprise_influxdb/v1/v1/content/servers.yml`
7. [x] Remove tag-groups decorator and all tag-groups.yml files
8. [x] Add `updateOSSV1()` and `updateEnterpriseV1()` to getswagger.sh
9. [x] Test: Run getswagger.sh for both v1 products
10. [x] Test: Verify API pages render correctly

## Completed: 2026-02-04

All tasks completed successfully. The v1 products now use the same Redocly overlay pattern as other products.
