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

`api-docs/getswagger.sh` calls `npx @redocly/cli` with **no pinned version**, and
npx now resolves 2.46.0. Bundling the current sources with 2.46.0 rewrites the
committed specs wholesale, independent of any source change:

- `influxdb/v2/influxdb-oss-v2-openapi.yaml`: ~685 insertions / ~693 deletions
- `influxdb/cloud/influxdb-cloud-v2-openapi.yaml`: ~779 lines changed

The rewrite inlines shared `components.parameters` (`Accept`, `AcceptEncoding`,
`V1Database`, `V1Query`, `AuthV1Username`, …), drops the
`QuerystringAuthentication` security scheme entry, and resets `info`/`servers`/
`tags` to the raw upstream values. No paths are added or removed. Redocly also
logs `Deprecated plugin format detected: docs` for
`api-docs/openapi/plugins/docs-plugin.cjs`, so the committed specs were bundled
with a Redocly 1.x CLI.

Before step 2, either pin `@redocly/cli` to the 1.x line that produced the
committed specs, or migrate `docs-plugin.cjs` to the 2.x plugin format and
re-baseline every product spec in a separate PR. Do not fold that churn into the
`onConflict` change.

## Also needs updating when the CLI flag ships

`influx restore` gains `--on-conflict`. The flags table lives in shared content:
`content/shared/influxdb-v2/reference/cli/influx/restore/index.md`
(surfaced by `content/influxdb/v2/reference/cli/influx/restore/index.md`).
Out of scope for the spec regeneration, but it ships in the same release.
