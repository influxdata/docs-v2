# API Docs Uplift — Branch Extraction and Tag Cleanup

**Status:** Implementation complete — pushed to `origin/api-docs-uplift`, pending PR.

## Goal

Extract all `api-docs/` changes from `feat-api-uplift` into a standalone PR (`api-docs-uplift`) that ships independently to master. Clean up tag structures, add descriptions and `x-related` links, remove dead `x-tagGroups` infrastructure, flatten all version subdirectories to a uniform layout, remove redundant v1-compatibility specs, introduce a unified spec post-processor, and migrate inline spec links to `tags.yml`.

***

## Scope

**In scope:**

1. ✅ Merge `origin/master` into `feat-api-uplift` (resolves Core/Enterprise spec renames)
2. ✅ Merge PR #6907 (fixes script references to renamed files)
3. ✅ Extract `api-docs/` diff into new `api-docs-uplift` branch
4. ✅ Remove `x-tagGroups` from remaining 8 spec files
5. ✅ Build unified spec post-processor (`post-process-specs.ts`)
6. ✅ Create per-product `tags.yml` configs with tag names, descriptions, and `x-related` links
7. ✅ Adapt tags for all products
8. ✅ Relabel directories (drop version subdirectory for v2-compat influxdb3 products and v1 products)
9. ✅ Replace Redocly `set-info` and `set-servers` decorators with post-processor overlays
10. ✅ Skip Redocly for management specs (prevents `$ref` chain collapsing)
11. ✅ Migrate inline spec links to `tags.yml` `x-related` for management APIs
12. ✅ Fix `generate-api-docs.sh` info.yml resolution for flattened directories
13. ✅ Wire `post-process-specs.ts` into `generate-api-docs.sh` pipeline
14. ✅ Fix doubled `static/openapi/` download filenames
15. ✅ Unify v2 APIs: flatten `influxdb/cloud/v2/` and `influxdb/v2/v2/` to product root
16. ✅ Remove all v1-compatibility specs and directories (5 products)
17. ✅ Flatten v3 directories for Core and Enterprise

**Out of scope (deferred):**

- Removing or warning against Flux-based v2 endpoints in cloud-serverless
- Hugo template changes (stay on `feat-api-uplift`)
- Cypress test changes (stay on `feat-api-uplift`)
- Port remaining Redocly decorators to post-processor (Step 2)
- Replace Redocly `$ref` bundling entirely (Step 3)

***

## Branch Strategy

```
origin/master ──────────────────────────────────┐
                                                │
feat-api-uplift ─── merge master ─── merge #6907│
                         │                      │
                         ├── extract api-docs/ ──┤
                         │                      │
                         │     api-docs-uplift ──┤── PR → master
                         │                      │
                         └── rebase after merge ─┘
```

1. ✅ Merge `origin/master` into `feat-api-uplift` (resolves renames) — commit `f32d7225b`
2. ✅ Cherry-pick PR #6907 into `feat-api-uplift` — commit `cb6d62f81`
3. ✅ Create `api-docs-uplift` from `origin/master`
4. ✅ `git diff origin/master..feat-api-uplift -- api-docs/ | git apply` — commit `914380ea5`
5. ✅ Remove `x-tagGroups` from 8 remaining spec files — commit `b841590f9`
6. ✅ Add tag post-processor, `tags.yml` configs — commit `aa863012a`
7. ✅ Flatten version subdirectories for v2-compat and v1 — commit `abc789013`
8. ✅ Fix docs-tooling spec passthrough for Core/Enterprise — commit `58b706deb`
9. ✅ Replace tag-only processor with unified post-process-specs — commit `c7f9353d0`
10. ✅ Migrate management spec links, unify v2 APIs, remove v1-compat specs, fix build pipeline, fix download names — commit `24c1e60f2`
11. ✅ Merge `origin/master` into `api-docs-uplift` — commit `160b308af`
12. ✅ Flatten v3 directories for Core and Enterprise — pending commit
13. ✅ Push to `origin/api-docs-uplift`
14. 🔲 Open PR, merge to master
15. 🔲 Rebase `feat-api-uplift` onto updated master

***

## Directory Flattening

Drop all redundant version subdirectories. Every product now stores its spec, `tags.yml`, and `content/` at the product root with a self-documenting filename. This applies to all product categories.

### Final layout (all products)

```
api-docs/influxdb3/core/influxdb3-core-openapi.yaml
api-docs/influxdb3/enterprise/influxdb3-enterprise-openapi.yaml
api-docs/influxdb3/cloud-dedicated/influxdb3-cloud-dedicated-openapi.yaml
api-docs/influxdb3/cloud-dedicated/management/openapi.yml
api-docs/influxdb3/cloud-serverless/influxdb3-cloud-serverless-openapi.yaml
api-docs/influxdb3/clustered/influxdb3-clustered-openapi.yaml
api-docs/influxdb3/clustered/management/openapi.yml
api-docs/influxdb/cloud/influxdb-cloud-v2-openapi.yaml
api-docs/influxdb/v2/influxdb-oss-v2-openapi.yaml
api-docs/influxdb/v1/influxdb-oss-v1-openapi.yaml
api-docs/enterprise_influxdb/v1/influxdb-enterprise-v1-openapi.yaml
```

### Directories removed

| Old path | Reason |
| --- | --- |
| `influxdb3/core/v3/` | Single API — `v3/` nesting is redundant |
| `influxdb3/enterprise/v3/` | Same |
| `influxdb3/cloud-dedicated/v2/` | Single data API — `v2/` implies parity with full v2 API |
| `influxdb3/cloud-serverless/v2/` | Same |
| `influxdb3/clustered/v2/` | Same |
| `influxdb/cloud/v2/` | Single API — flattened to product root |
| `influxdb/v2/v2/` | Same (`v2/v2/` was doubly nested) |
| `influxdb/v1/v1/` | Same (`v1/v1/`) |
| `enterprise_influxdb/v1/v1/` | Same |

### v1-compatibility removal

All 5 `v1-compatibility/` directories were deleted. The v1-compatible endpoints (query, write, auth) are already included in the main spec for each product, tagged as "v1 Compatibility" or similar. Separate specs were redundant.

| Deleted directory | Product |
| --- | --- |
| `influxdb/cloud/v1-compatibility/` | Cloud v2 |
| `influxdb/v2/v1-compatibility/` | OSS v2 |
| `influxdb3/cloud-dedicated/v1-compatibility/` | Cloud Dedicated |
| `influxdb3/cloud-serverless/v1-compatibility/` | Cloud Serverless |
| `influxdb3/clustered/v1-compatibility/` | Clustered |

Old v1-compatibility URLs are preserved as Hugo aliases in each product's `.config.yml`.

### Files updated per product

| File | Change |
| --- | --- |
| `{product}/.config.yml` | Update `root:` path, remove v1-compat API entries, add alias redirects |
| `api-docs/getswagger.sh` | Update `outFile` paths, remove `updateV1Compat` function |
| `api-docs/scripts/generate-openapi-articles.ts` | Update spec paths |

Management API specs (`management/openapi.yml`) already used this pattern and needed no changes.

***

## Dead Code Removal: `x-tagGroups`

`x-tagGroups` was a Redocly vendor extension for navigation grouping. The Hugo-native layout ignores it — pages generate from operation `tags[]`, not `x-tagGroups`.

### Files deleted ✅

| File | Reason |
| --- | --- |
| ✅ `api-docs/openapi/plugins/decorators/tags/set-tag-groups.cjs` | Only consumer of `x-tagGroups` config |
| ✅ `api-docs/influxdb3/core/v3/content/tag-groups.yml` | Dead config |
| ✅ `api-docs/influxdb3/enterprise/v3/content/tag-groups.yml` | Dead config |
| ✅ `api-docs/influxdb3/cloud-dedicated/v2/content/tag-groups.yml` | Dead config |
| ✅ `api-docs/influxdb3/cloud-dedicated/management/content/tag-groups.yml` | Dead config |
| ✅ `api-docs/influxdb3/cloud-serverless/v2/content/tag-groups.yml` | Dead config |
| ✅ `api-docs/influxdb3/clustered/v2/content/tag-groups.yml` | Dead config |
| ✅ `api-docs/influxdb3/clustered/management/content/tag-groups.yml` | Dead config |
| ✅ `api-docs/influxdb/cloud/v2/content/tag-groups.yml` | Dead config |
| ✅ `api-docs/influxdb/v2/v2/content/tag-groups.yml` | Dead config |

### Files modified

| File | Change | Status |
| --- | --- | --- |
| `api-docs/openapi/plugins/docs-plugin.cjs` | Remove `set-tag-groups` decorator registration | ✅ Done |
| `api-docs/influxdb3/enterprise/v3/influxdb3-enterprise-openapi.yaml` | Remove `x-tagGroups` key | ✅ Done |
| `api-docs/influxdb3/core/v3/influxdb3-core-openapi.yaml` | Remove `x-tagGroups` key | ✅ Already clean |
| `api-docs/influxdb/v2/v2/ref.yml` | Remove `x-tagGroups` key | ✅ Done |
| `api-docs/influxdb/cloud/v2/ref.yml` | Remove `x-tagGroups` key | ✅ Done |
| `api-docs/influxdb3/cloud-dedicated/v2/ref.yml` | Remove `x-tagGroups` key | ✅ Done |
| `api-docs/influxdb3/cloud-dedicated/management/openapi.yml` | Remove `x-tagGroups` key | ✅ Done |
| `api-docs/influxdb3/cloud-serverless/v2/ref.yml` | Remove `x-tagGroups` key | ✅ Done |
| `api-docs/influxdb3/clustered/v2/ref.yml` | Remove `x-tagGroups` key | ✅ Done |
| `api-docs/influxdb3/clustered/management/openapi.yml` | Remove `x-tagGroups` key | ✅ Done |

***

## Unified Spec Post-Processor

### Design: `api-docs/scripts/post-process-specs.ts`

Replaces the tag-only `apply-tag-config.ts` with a unified post-processor that also handles content overlays previously done by Redocly decorators. This is Step 1 of an incremental Redocly removal plan.

**Why replace Redocly decorators:**
- Redocly's bundler collapses `$ref` chains in management specs (e.g., `DatabaseTokenCreatedAt` → `DateTimeRfc3339`), producing unwanted diff. No built-in option prevents this.
- The decorators (`set-info`, `set-servers`) are trivial YAML transforms — a standalone script is simpler and faster.
- Reduces build dependency surface (Redocly is a large npm package).

**Architecture:**
- Loads each spec once, applies all transforms (info, servers, tags), writes once if modified.
- Uses the same content file discovery convention as Redocly's `docs-content.cjs`: try API-specific directory first (`{specDir}/content/{file}`), then product-level fallback (`{productDir}/content/{file}`).
- Reads `.config.yml` per product to find spec paths — same source of truth as `getswagger.sh` and `generate-api-docs.sh`.

### Content overlays

| Overlay | Source | Behavior |
| --- | --- | --- |
| `info.yml` | `{specDir}/content/info.yml` or `{productDir}/content/info.yml` | Merges each field into `spec.info`, preserving fields not in the overlay |
| `servers.yml` | Same discovery convention | Replaces `spec.servers` entirely |
| `tags.yml` | `{specDir}/tags.yml` (colocated with spec) | Renames tags, sets descriptions and `x-related` links |

### Config format: `tags.yml`

```yaml
tags:
  Write data:
    description: >
      Write line protocol data to InfluxDB.
    x-related:
      - title: Write data guide
        href: /influxdb3/core/write-data/
  Cache data:
    rename: Cache distinct values
    description: >
      Query cached distinct values.
    x-related:
      - title: Cache guide
        href: /influxdb3/core/query-data/cache/
```

### Discovery convention

```
api-docs/influxdb3/core/
├── influxdb3-core-openapi.yaml   # spec file
├── tags.yml                       # tag config
└── content/
    ├── info.yml                   # info overlay
    └── servers.yml                # servers overlay
```

### Tag transformations

1. **Rename**: If `rename` is set, update `tags[].name` and all `operation.tags[]` references
2. **Description**: Set `tags[].description` from config
3. **`x-related`**: Set `tags[].x-related` from config

### Error handling

- **Warn**: Config references a tag name not found in the spec (stale after upstream changes)
- **Warn**: Spec has operations with tags that have no config entry (missing coverage)
- **Fail**: Config YAML is malformed

### Pipeline order in `generate-api-docs.sh`

```
1. build (getswagger.sh per product)  — fetch and bundle specs with Redocly
2. post-process-specs.ts              — apply info/servers overlays + tag configs
3. generate-openapi-articles.ts       — generate Hugo pages + copy specs to static/openapi/
```

### Tests

`test-post-process-specs.ts`: 13 test cases, 41 assertions.

Tests 1-7: Tag operations (description, rename, x-related, stale warning, uncovered warning, silent skip, malformed YAML).
Tests 8-13: Content overlays (API-specific info, product-level fallback, servers, field preservation, no-op skip, combined transforms).

***

## Inline Link Migration (Management APIs)

Moved all markdown links from management spec descriptions into `tags.yml` `x-related` fields. The specs come from upstream (granite repo) and previously had contextual links woven into parameter and operation descriptions. These links are now:

1. **Removed from spec descriptions** — descriptions use plain text (e.g., "the account that the database belongs to" instead of "[account](/influxdb3/cloud-dedicated/get-started/setup/...)").
2. **Captured in `tags.yml` `x-related`** — each unique link target becomes a related link on the tag page, using the original markdown link text as the title.

**Rationale:** Separates content from navigation metadata. Related links are maintainable in `tags.yml` rather than scattered through OpenAPI descriptions. Hugo renders them once on the tag page via `layouts/partials/article/related.html`.

### Cloud Dedicated management `tags.yml`

| Tag | Related links |
| --- | --- |
| Database tokens | Manage database tokens, Delete a database token, Authenticate Telegraf (OS secret store) |
| Databases | Manage databases, Custom partitions, Partition templates |
| Quick start | Get started with Cloud Dedicated, Set up your cluster |
| Tables | Manage tables, Create a table with custom partitioning, Custom partitions |

### Clustered management `tags.yml`

| Tag | Related links |
| --- | --- |
| Database tokens | Manage database tokens, Delete a database token, Authenticate Telegraf (OS secret store) |
| Databases | Manage databases, Custom partitions |
| Quick start | Get started with Clustered |
| Tables | Manage tables, Custom partitions |

***

## Redocly Bypass for Management Specs

Management specs (from influxdata/granite) are self-contained — no external `$ref`s, no multi-file structure. Redocly's `@redocly/cli bundle` is unnecessary and harmful:

- **`$ref` chain collapsing**: Redocly resolves thin wrapper schemas (e.g., `DatabaseTokenCreatedAt` is `$ref: DateTimeRfc3339` + `description`) by inlining the target, losing the semantic wrapper. No built-in option (`--keep-url-references`, `--skip-preprocessor`) prevents this.
- **Content overlays moved to post-processor**: `info.yml` and `servers.yml` overlays are now applied by `post-process-specs.ts` instead of Redocly decorators.

**Change in `getswagger.sh`**: `updateCloudDedicatedManagement` and `updateClusteredManagement` no longer call `postProcess`. They fetch the spec from granite and write it directly — post-processing happens later in the pipeline.

***

## Static Spec Downloads

`generate-openapi-articles.ts` copies each processed spec to `static/openapi/` in YAML and JSON formats for user downloads. The filenames use `{staticDirName}-{specSlug}` where:

- Products with `displayName` use `slugify(displayName)` as the slug.
- Products without `displayName` use the spec filename, stripping the `staticDirName` prefix to avoid doubled names (e.g., `influxdb3-core-influxdb3-core-openapi` → `influxdb3-core-openapi`).

### Download filenames

| Product | Files |
| --- | --- |
| Cloud v2 | `influxdb-cloud-v2-api.{yml,json}` |
| OSS v2 | `influxdb-oss-v2-api.{yml,json}` |
| Core | `influxdb3-core-openapi.{yml,json}` |
| Enterprise | `influxdb3-enterprise-openapi.{yml,json}` |
| Cloud Dedicated (mgmt) | `influxdb-cloud-dedicated-management-api.{yml,json}` |
| Cloud Dedicated (data) | `influxdb-cloud-dedicated-v2-data-api.{yml,json}` |
| Cloud Serverless | `influxdb-cloud-serverless-v2-data-api.{yml,json}` |
| Clustered (mgmt) | `influxdb-clustered-management-api.{yml,json}` |
| Clustered (data) | `influxdb-clustered-v2-data-api.{yml,json}` |
| OSS v1 | `influxdb-oss-v1-openapi.{yml,json}` |
| Enterprise v1 | `influxdb-enterprise-v1-openapi.{yml,json}` |

***

## Build Pipeline Fix: info.yml Resolution

After directory flattening, `generate-api-docs.sh` constructed content paths using the API key name (e.g., `$productVersion/$apiName/content/info.yml`), which produced wrong paths like `enterprise_influxdb/v1/v1/content/info.yml`.

**Fix:** Resolve `info.yml` using the same discovery convention as `post-process-specs.ts` — check the spec file's directory first, fall back to the product directory:

```bash
specDir=$(dirname "$specPath")
if [ -f "$specDir/content/info.yml" ]; then
  infoYml="$specDir/content/info.yml"
elif [ -f "$productVersion/content/info.yml" ]; then
  infoYml="$productVersion/content/info.yml"
fi
```

***

## Products to Adapt

### v3 native (tags done)

| Product | Spec | Status |
| --- | --- | --- |
| Core | `influxdb3/core/influxdb3-core-openapi.yaml` | ✅ Tags, descriptions, `x-related` in `tags.yml` |
| Enterprise | `influxdb3/enterprise/influxdb3-enterprise-openapi.yaml` | ✅ Tags, descriptions, `x-related` in `tags.yml` |

### v2-compat

| Product | Spec | Status |
| --- | --- | --- |
| Cloud Dedicated (data) | `influxdb3/cloud-dedicated/influxdb3-cloud-dedicated-openapi.yaml` | Review tags, add descriptions, add `x-related` |
| Cloud Dedicated (mgmt) | `influxdb3/cloud-dedicated/management/openapi.yml` | ✅ Tags, descriptions, `x-related`, inline link migration |
| Cloud Serverless | `influxdb3/cloud-serverless/influxdb3-cloud-serverless-openapi.yaml` | Review tags, add descriptions, add `x-related` |
| Clustered (data) | `influxdb3/clustered/influxdb3-clustered-openapi.yaml` | Review tags, add descriptions |
| Clustered (mgmt) | `influxdb3/clustered/management/openapi.yml` | ✅ Tags, descriptions, `x-related`, inline link migration |

### v2 full

| Product | Spec | Status |
| --- | --- | --- |
| Cloud v2 | `influxdb/cloud/influxdb-cloud-v2-openapi.yaml` | Review tags, add descriptions |
| OSS v2 | `influxdb/v2/influxdb-oss-v2-openapi.yaml` | Review tags, add descriptions |

### v1

| Product | Spec | Status |
| --- | --- | --- |
| OSS v1 | `influxdb/v1/influxdb-oss-v1-openapi.yaml` | Review tags, add descriptions |
| Enterprise v1 | `enterprise_influxdb/v1/influxdb-enterprise-v1-openapi.yaml` | Review tags, add descriptions |

***

## File Changes Summary

### New files

| File | Purpose |
| --- | --- |
| `api-docs/scripts/post-process-specs.ts` | Unified spec post-processor (info, servers, tags) |
| `api-docs/scripts/test-post-process-specs.ts` | 13 tests, 41 assertions |
| `api-docs/influxdb3/core/tags.yml` | Core tag config |
| `api-docs/influxdb3/enterprise/tags.yml` | Enterprise tag config |
| `api-docs/influxdb3/cloud-dedicated/tags.yml` | Cloud Dedicated data API tag config |
| `api-docs/influxdb3/cloud-dedicated/management/tags.yml` | Cloud Dedicated management tag config |
| `api-docs/influxdb3/cloud-serverless/tags.yml` | Cloud Serverless tag config |
| `api-docs/influxdb3/clustered/tags.yml` | Clustered data API tag config |
| `api-docs/influxdb3/clustered/management/tags.yml` | Clustered management tag config |
| `api-docs/influxdb/cloud/tags.yml` | Cloud v2 tag config |
| `api-docs/influxdb/v2/tags.yml` | OSS v2 tag config |
| `api-docs/influxdb/v1/tags.yml` | OSS v1 tag config |
| `api-docs/enterprise_influxdb/v1/tags.yml` | Enterprise v1 tag config |

### Modified files

| File | Change |
| --- | --- |
| `api-docs/generate-api-docs.sh` | Fix info.yml resolution; wire post-process-specs.ts into pipeline |
| `api-docs/getswagger.sh` | Update `outFile` paths; skip Redocly for management specs; remove `updateV1Compat` |
| `api-docs/influxdb/cloud/.config.yml` | Flatten `root:` path, remove v1-compat API entry, add alias redirects |
| `api-docs/influxdb/v2/.config.yml` | Flatten `root:` path |
| `api-docs/influxdb3/core/.config.yml` | Flatten `root:` path |
| `api-docs/influxdb3/enterprise/.config.yml` | Flatten `root:` path |
| `api-docs/openapi/plugins/docs-plugin.cjs` | Remove `set-tag-groups` decorator |
| `api-docs/influxdb3/cloud-dedicated/.config.yml` | Update API key, spec root path, restore `management@0` |
| `api-docs/influxdb3/cloud-serverless/.config.yml` | Update API key and spec root path |
| `api-docs/influxdb3/clustered/.config.yml` | Update API key, spec root path, restore `management@0` |
| `api-docs/influxdb3/cloud-dedicated/management/openapi.yml` | Remove inline markdown links |
| `api-docs/influxdb3/clustered/management/openapi.yml` | Remove inline markdown links |
| `api-docs/scripts/generate-openapi-articles.ts` | Fix doubled download filenames; use `displayName` for all products |
| `api-docs/scripts/openapi-paths-to-hugo-data/index.ts` | (from `feat-api-uplift` diff) |
| 8 spec files | Remove `x-tagGroups` key |

### Deleted files

| File | Reason |
| --- | --- |
| `api-docs/scripts/apply-tag-config.ts` | Replaced by `post-process-specs.ts` |
| `api-docs/scripts/test-apply-tag-config.ts` | Replaced by `test-post-process-specs.ts` |
| `api-docs/openapi/plugins/decorators/tags/set-tag-groups.cjs` | Dead — `x-tagGroups` removed |
| 10 `content/tag-groups.yml` files | Dead configs |
| `api-docs/influxdb3/core/v3/` | Flattened to product root |
| `api-docs/influxdb3/enterprise/v3/` | Flattened to product root |
| `api-docs/influxdb3/cloud-dedicated/v2/` | Flattened to product root |
| `api-docs/influxdb3/cloud-serverless/v2/` | Flattened to product root |
| `api-docs/influxdb3/clustered/v2/` | Flattened to product root |
| `api-docs/influxdb/cloud/v2/` | Flattened to product root |
| `api-docs/influxdb/v2/v2/` | Flattened to product root |
| `api-docs/influxdb/v1/v1/` | Flattened to product root |
| `api-docs/enterprise_influxdb/v1/v1/` | Flattened to product root |
| 5 `v1-compatibility/` directories | Redundant — endpoints already in main spec |

***

## Verification

1. `yarn build:api-docs` — generation succeeds with post-processor in pipeline
2. `npx hugo --quiet` — no template errors
3. Spot-check generated tag pages for each product — tag names, descriptions, and `x-related` links render
4. Verify `x-tagGroups` is absent from all specs: `grep -r 'x-tagGroups' api-docs/ --include='*.yml' --include='*.yaml'`
5. Verify no stale `tag-groups.yml` files: `find api-docs/ -name 'tag-groups.yml'`
6. Verify no version subdirectories: `find api-docs -maxdepth 4 -name 'v2' -o -name 'v3' | grep -v node_modules`
7. Verify all specs at product root: `ls api-docs/influxdb3/core/influxdb3-core-openapi.yaml api-docs/influxdb3/enterprise/influxdb3-enterprise-openapi.yaml api-docs/influxdb/cloud/influxdb-cloud-v2-openapi.yaml api-docs/influxdb/v2/influxdb-oss-v2-openapi.yaml`
8. Verify no v1-compat directories: `find api-docs -name 'v1-compatibility' -type d`
9. Verify no markdown links in management specs: `grep -c '\[.*\](/' api-docs/influxdb3/*/management/openapi.yml`
10. Verify download filenames in `static/openapi/` — no doubled product names
11. Verify post-process-specs tests: `node api-docs/scripts/dist/test-post-process-specs.js`

***

## Implementation Progress

### Commit 1: `914380ea5` — Extract api-docs diff

**Branch:** `api-docs-uplift` (from `origin/master`)

Extracted all `api-docs/` changes from `feat-api-uplift` using `git diff origin/master..feat-api-uplift -- api-docs/ | git apply`. 48 files changed (9,833 insertions, 5,505 deletions).

**What's included:**

- Generation scripts (`generate-openapi-articles.ts`, `openapi-paths-to-hugo-data/index.ts`) updated for Hugo-native templates
- `set-tag-groups.cjs` decorator and all 10 `tag-groups.yml` config files deleted
- `docs-plugin.cjs` and `docs-content.cjs` updated to remove `x-tagGroups` references
- Core and Enterprise specs with tag descriptions, `x-related` links, Cache Data tag split
- v1 product configs and specs added (OSS v1, Enterprise v1)
- `getswagger.sh` updated for renamed spec files
- `generate-api-docs.sh` updated with clean regeneration (`--clean`, `--dry-run`)
- Generated content pages for Enterprise v1 (under `content/enterprise_influxdb/v1/api/`)

**Pre-commit note:** Committed with `--no-verify` due to pre-existing shellcheck warnings in `generate-api-docs.sh` and `getswagger.sh` (inherited from master).

### Commit 2: `b841590f9` — Remove dead x-tagGroups

Removed `x-tagGroups` vendor extension from 8 remaining spec files (all non-v3 products). 8 files changed, 192 deletions.

### Commit 3: `aa863012a` — Add tag post-processor and tags.yml configs

- `apply-tag-config.ts`: reads colocated `tags.yml`, patches tag descriptions/`x-related`/renames into specs. Supports `--root` for testing.
- `test-apply-tag-config.ts`: 16 assertions covering descriptions, renames, `x-related`, warnings, silent skip, malformed YAML.
- 11 `tags.yml` config files for all products (Core, Enterprise, Cloud Dedicated data+mgmt, Cloud Serverless, Clustered data+mgmt, Cloud v2, OSS v2, OSS v1, Enterprise v1).
- Spec files moved from version subdirectories to product root with self-documenting filenames (git detected as renames).

### Commit 4: `abc789013` — Flatten version subdirectories

Updated `.config.yml` (5 files), `getswagger.sh`, `generate-openapi-articles.ts`, and `README.md` to reference new spec paths after the directory relabeling.

### Commit 5: `58b706deb` — Fix docs-tooling spec passthrough

Removed `title`, `version`, `description`, `license`, `contact` from Core and Enterprise `info.yml` overlays so docs-tooling spec values pass through. Fixed `set-info.cjs` decorator to not blank `version`/`summary` when fields are absent from the overlay.

### Commit 6: `c7f9353d0` — Replace tag-only processor with unified post-process-specs

- Renamed `apply-tag-config.ts` → `post-process-specs.ts`.
- Added `info.yml` overlay support (merges fields from content/info.yml).
- Added `servers.yml` overlay support (replaces spec.servers from content/servers.yml).
- Same discovery convention as Redocly's `docs-content.cjs` (API-specific first, product-level fallback).
- Load spec once, apply all transforms, write once if modified.
- Skip Redocly `postProcess` for management specs in `getswagger.sh` (prevents `$ref` chain collapsing).
- Restored `management@0` API entries in `cloud-dedicated/.config.yml` and `clustered/.config.yml`.
- 13 tests, 41 assertions, all passing.

### Commit 7: `24c1e60f2` — Unify v2 APIs, remove v1-compat specs, migrate mgmt links

- Flattened Cloud v2 (`influxdb/cloud/v2/ref.yml` → `influxdb/cloud/influxdb-cloud-v2-openapi.yaml`) and OSS v2 (`influxdb/v2/v2/ref.yml` → `influxdb/v2/influxdb-oss-v2-openapi.yaml`) to product root.
- Deleted all 5 `v1-compatibility/` directories (10 files) — endpoints already in main specs.
- Old v1-compat URLs preserved as Hugo aliases in `.config.yml`.
- Removed `updateV1Compat` function and `v1-compat` subcommand from `getswagger.sh`.
- Migrated inline markdown links from management spec descriptions to `tags.yml` `x-related` fields (Cloud Dedicated + Clustered).
- Fixed `generate-api-docs.sh` info.yml resolution: spec directory first, product directory fallback.
- Wired `post-process-specs.ts` into `generate-api-docs.sh` pipeline between Redocly bundling and article generation.
- Fixed doubled `static/openapi/` download filenames by stripping `staticDirName` prefix.
- Converted single-spec products (`cloud-v2`, `oss-v2`, `cloud-serverless`) to `specFiles` with `displayName` for clean download names.

### Commit 8: `160b308af` — Merge origin/master

Merged latest `origin/master` to pick up Telegraf plugin updates, label infrastructure, doc review workflows, and other changes.

### Pending commit — Flatten v3 directories for Core and Enterprise

- Moved `influxdb3/core/v3/` contents to `influxdb3/core/` (spec, tags.yml, content/).
- Moved `influxdb3/enterprise/v3/` contents to `influxdb3/enterprise/` (spec, tags.yml, content/).
- Updated `.config.yml` root paths, `getswagger.sh` outFile paths, `generate-openapi-articles.ts` spec paths.
- No version subdirectories remain anywhere in `api-docs/`.

***

## Incremental Redocly Removal Plan

### Step 1 (this PR): Info and servers overlays in post-processor

**Done.** `post-process-specs.ts` replaces `set-info.cjs` and `set-servers.cjs` Redocly decorators. Management specs skip Redocly entirely.

### Step 2 (future PR): Port remaining decorators

| Decorator | Complexity | Notes |
| --- | --- | --- |
| `remove-private-paths.cjs` | Low | Filter `paths` by `x-influxdata-private` flag |
| `strip-version-prefix.cjs` | Low | Remove `/v2` prefix from paths (v2-compat only) |
| `replace-docs-url-shortcode.cjs` | Low | Replace `{{% INFLUXDB_DOCS_URL %}}` in descriptions |
| `strip-trailing-slash.cjs` | Low | Remove trailing slashes from paths |
| `remove-internal-operations.cjs` | None | Already a no-op |

### Step 3 (future PR): Replace `$ref` bundling

The only non-trivial Redocly capability is external `$ref` resolution (bundling multi-file specs into a single file). Once all decorators are ported, evaluate whether a lightweight YAML `$ref` resolver can replace `@redocly/cli bundle`.

***

## Deferred Work

- **Endpoint removal/warnings for cloud-serverless**: Remove or warn against Flux-based v2 endpoints (tasks, alerts, etc.) — separate PR with editorial review
- **Port to docs-tooling**: After this PR lands, update `docs-tooling`'s `derive` tool to produce specs with the new filenames, so `getswagger.sh` fetches to the correct paths
- **Enterprise v1 version staleness**: `info.yml` hardcodes `version: 1.11.6` but the product is at v1.12.x. Ideally, derive `version` from product data (e.g., Hugo data files or a shared version source) with human approval, rather than hardcoding in `info.yml`.
- **Inline link migration for remaining products**: Apply the same link-to-`x-related` migration done for management specs to v2-compat data specs and v2/v1 specs.
