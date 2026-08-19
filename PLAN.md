# Regenerate OSS v2 API specs for `onConflict` (restore bucket metadata)

Tracking: [influxdata/influxdb#27578](https://github.com/influxdata/influxdb/issues/27578) ·
[influxdata/openapi#655](https://github.com/influxdata/openapi/pull/655)

## Status: blocked — do not regenerate yet

Verified 2026-08-07:

| Precondition                                                            | State                                   |
| ----------------------------------------------------------------------- | --------------------------------------- |
| `influxdata/openapi#655` merged to `master`                             | **No** — open (approved, not merged)    |
| Change present on `influxdata/openapi` `docs-release/influxdb-oss`      | **No** — branch has 0 `onConflict` hits |
| `influxdata/influxdb#27578` (server-side `--on-conflict`) implemented   | **No** — issue open, no linked PR       |
| `api-docs/influxdb/v2/influxdb-oss-v2-openapi.yaml` in sync with source | Yes — current except for #655           |

Regenerating today would produce no `onConflict` change, because `getswagger.sh v2`
fetches from `docs-release/influxdb-oss`, not `master`.

## What #655 adds

A query parameter on `POST /api/v2/restore/bucketMetadata`
(`PostRestoreBucketMetadata`), in `src/oss/paths/restore_bucketMetadata.yml`:

```yaml
- in: query
  name: onConflict
  description: Behavior when a bucket with the same name already exists.
  schema:
    type: string
    enum:
      - error
      - skip
      - replace
```

The docs-v2 spec currently has only `TraceSpan` on that operation
(`api-docs/influxdb/v2/influxdb-oss-v2-openapi.yaml`, `PostRestoreBucketMetadata`).

## Runbook (after #655 merges and the feature ships in an OSS 2.x release)

1. In `influxdata/openapi`, land the change on the OSS docs release branch —
   this is a separate step from the `master` merge and needs push access to
   `influxdata/openapi`:

   ```sh
   git fetch -ap
   git checkout docs-release/influxdb-oss
   git cherry-pick <sha-of-655-on-master>
   git push origin docs-release/influxdb-oss
   ```

2. In `docs-v2`, on this branch:

   ```sh
   cd api-docs
   bash getswagger.sh v2      # use bash, not sh — the script is not POSIX-clean
   ```

3. Confirm the diff is limited to `PostRestoreBucketMetadata` gaining the
   `onConflict` query parameter. See "Regeneration churn" below — if the diff is
   thousands of lines, stop and resolve that first.

4. Generate and eyeball the rendered page:

   ```sh
   sh generate-api-docs.sh
   npx hugo server   # /influxdb/v2/api/
   ```

5. Commit the spec change only (generated HTML and `api-docs/_build/` are
   gitignored).

## Timing caveat

`docs-release/influxdb-oss` exists so OSS reference docs describe the *released*
server, not `openapi` `master` (see `api-docs/README.md`, "InfluxDB OSS v2
version"). `influxdata/influxdb#27578` is still open, so `onConflict` is not in
any released OSS 2.x. Hold step 1 until the implementing release is out,
otherwise the published reference documents a parameter the server rejects.

## Regeneration churn (pre-existing, unrelated to #655)

Regenerating today rewrites the committed specs wholesale with no source change:

- `influxdb/v2/influxdb-oss-v2-openapi.yaml`: ~685 insertions / ~693 deletions
- `influxdb/cloud/influxdb-cloud-v2-openapi.yaml`: ~779 lines changed

**This churn is expected catch-up, not a bug.** The committed specs are stale
artifacts of the previous pipeline. Verified causes, in order of diff size:

### 1. `info` / `servers` / `tags` reset — by design

`api-docs/openapi/plugins/docs-plugin.cjs` states in its header comment that the
`set-info` and `set-servers` decorators were deliberately removed, because
`post-process-specs.ts` now owns the overlays. So `getswagger.sh` output is
*supposed* to carry raw upstream `info`/`servers`/`tags`; the overlays are
reapplied into `api-docs/_build/`, which is gitignored.

Confirmed: after `node api-docs/scripts/dist/post-process-specs.js`, the `info`
block in `_build/` is identical to the committed spec. The committed file has
overlays baked in only because it was last generated when post-processing wrote
in place.

`servers` still differs after post-processing — committed `[{url: /}]` vs
`_build` `[{url: 'http://localhost:8086', description: 'Local InfluxDB
instance'}]` — because `influxdb/v2/content/servers.yml` changed since the last
regeneration. The `_build` value is the intended one.

### 2. `components.parameters` inlining — upstream, not the bundler

Current `contracts/ref/oss.yml` on `docs-release/influxdb-oss` declares only
`After`, `Descending`, `Limit`, `Offset`, `SortBy`, `TraceSpan`. It does not
declare `Accept`, `AcceptEncoding`, `Content-Type`, `AuthV1Username`,
`AuthV1Password`, `V1Database`, `V1Query`, `V1RetentionPolicy`, or `V1Epoch` —
and neither does the `influxdb-oss-v2.7.0` tag. Those components exist only in
the stale committed snapshot; upstream now inlines the same parameters on the
v1-compatibility operations.

**No content is lost.** Comparing fully dereferenced parameter sets across all
233 shared operations: 206 are identical, and the remaining 27 differ only in
parameter ordering or in the `After`/`Offset` description string (see item 4).
`GET /query` carries the same 10 parameters in both.

### 3. `QuerystringAuthentication` — already an orphan, and its anchor is broken

Tracked in [#7667](https://github.com/influxdata/docs-v2/issues/7667).

The scheme has **0 `$ref`s** in the committed spec and is absent from
`security:`, so dropping it changes no operation. But
`api-docs/influxdb/v2/tags.yml:9` links to
`#section/Authentication/QuerystringAuthentication`, and that anchor is
generated from `components.securitySchemes`. Since current upstream declares
only `BasicAuthentication` and `TokenAuthentication`, the link is **already
dead** in `_build/`. Same pattern in `influxdb/cloud/tags.yml:9`. Fix separately
from #655: either drop the link or restore the scheme upstream.

### 4. Upstream regression: `/influxdb/latest/` links in v2 reference

Tracked in [#7666](https://github.com/influxdata/docs-v2/issues/7666).

`src/common/parameters/{After,Offset}.yml` still author the link with the
`INFLUXDB_DOCS_URL` shortcode, but since `influxdata/openapi#603` ("use /latest
alias for OSS URL substitutions") the OSS contract generation expands it to
`https://docs.influxdata.com/influxdb/latest`. Our `replace-docs-url-shortcode`
decorator can only rewrite shortcodes that survive into the contract, so these
two links stay pinned to `/latest` while the rest of the page is rewritten to
`/influxdb/v2/`. 19 shortcodes do survive unexpanded, which is the
inconsistency. The same substitution also emits two doubled-segment URLs from
`src/oss/tags.yml:148-149` and leaves one malformed shortcode unsubstituted.

### Redocly version

`getswagger.sh` calls `npx @redocly/cli` with no pinned version; npx currently
resolves 2.46.0, and Redocly logs `Deprecated plugin format detected: docs` for
`docs-plugin.cjs`. The version bump was **not** found to cause any of the
substantive deltas above — those are all pipeline-refactor staleness or upstream
source changes. Pin the version anyway for reproducible builds, and migrate the
plugin to the 2.x format to clear the warning, but treat both as separate work.

### Recommendation

Re-baseline all product specs against the current pipeline in its own PR, then
regenerate for #655 on top so the `onConflict` diff is one parameter.
Tracked in [#7668](https://github.com/influxdata/docs-v2/issues/7668), which
also covers pinning `@redocly/cli` and migrating `docs-plugin.cjs` to the
Redocly 2.x plugin format.

## Also needs updating when the CLI flag ships

`influx restore` gains `--on-conflict`. The flags table lives in shared content:
`content/shared/influxdb-v2/reference/cli/influx/restore/index.md`
(surfaced by `content/influxdb/v2/reference/cli/influx/restore/index.md`).
Out of scope for the spec regeneration, but it ships in the same release.
