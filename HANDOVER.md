# Handover: `prepare-release.yml` fails on a missing checklist script

Branch: `claude/great-ramanujan-t7p7t2`, fast-forwarded to `master` at
`e80ae76`.
No fix is committed.
The decision below is still open.

## Problem

`.github/workflows/prepare-release.yml` ends with the step "Create release
checklist issue".
That step runs `require('./.github/scripts/release-checklist.js')` and calls
`checklist.createIssue({ github, context, product, version, releaseType })`.
`.github/scripts/release-checklist.js` doesn't exist, so the step fails.

## Findings

Verified on `master` at `e80ae76`.

### The workflow fails before it reaches the checklist step

The "Update product versions" step runs
`helper-scripts/common/update-product-version.sh`.
That script has three problems:

- It runs `find compose-examples/ ...` under `set -e`.
  The `compose-examples/` directory doesn't exist, so `find` exits non-zero
  and the job stops.
- It writes `.influxdb3_${PRODUCT}.latest_patch`.
  For `cloud-serverless` and `cloud-dedicated` this produces
  `influxdb3_cloud-serverless` and `influxdb3_cloud-dedicated`.
  The keys in `data/products.yml` are `influxdb3_cloud_serverless` and
  `influxdb3_cloud_dedicated`, and those products have no top-level
  `latest_patch`.
- It assumes `yq` is installed on the runner, and nothing in the workflow
  installs it.
  GitHub-hosted Ubuntu runners include `yq` now, but that isn't guaranteed.

### The workflow throws away its own output

- It creates a `docs-release-v<version>` branch, writes placeholder release
  notes to `helper-scripts/output/release-notes/`, and edits
  `data/products.yml`.
  It never commits, pushes, or opens a PR, so all of that is lost when the
  job ends.
- It has no `permissions:` block.
  If the repository's default `GITHUB_TOKEN` is read-only, `issues.create`
  fails even after the script exists.

### The requested Quay checklist item has nothing to point at

The original request asked for this checklist item:
"Set `latest_quay_tag` in `data/products.yml` to the release commit SHA
(`influxdata/influxdb` for Core, `influxdata/influxdb_pro` for Enterprise).
The 'Quay tag check' job in `.github/workflows/pr-release-check.yml` fails
when `latest_patch` changes and `latest_quay_tag` doesn't."

- `data/products.yml` has no `latest_quay_tag` field.
- `.github/workflows/pr-release-check.yml` has two jobs:
  `version-reminder` and `release-readiness`.
  Neither checks Quay, and neither blocks a merge.
- No docs-v2 PR found by search adds either one.
  The closest are
  [influxdata/docs-v2#7836](https://github.com/influxdata/docs-v2/pull/7836)
  and
  [influxdata/docs-v2#7837](https://github.com/influxdata/docs-v2/pull/7837),
  which changed Docker install instructions only.

### Another workflow already covers Core and Enterprise releases

`.github/workflows/influxdb3-release.yml` (manual dispatch, or started by
`trigger-on-release.yml` from a `repository_dispatch` event of type
`influxdb3-release`):

- Generates release notes for Core and Enterprise and uploads them as an
  artifact.
- Runs a CLI documentation audit.
- Opens a draft docs PR with this checklist:
  `Release notes`, `Version updates`, `CLI documentation audit results`.
- Opens an audit issue with review items.
- Defaults to `dry_run: true`.

It doesn't edit `data/products.yml`.
The "Version updates" item doesn't say which fields to change.
Recent Core and Enterprise releases bumped `latest_patch` by hand
(`a75dd63` for 3.12.1, `62c9b77` for 3.12.2), so neither workflow is in
regular use for that step.

### Other references to the broken script

`update-product-version.sh` is called only by `prepare-release.yml`.
It is documented in `helper-scripts/README.md` and
`helper-scripts/common/README.md`.
`helper-scripts/common/README.md` shows `--product clustered`, which would
add an `influxdb3_clustered.latest_patch` field that doesn't exist today.
Only `influxdb3_core`, `influxdb3_enterprise`, and `influxdb3_explorer`
have a top-level `latest_patch`.

## Options

| Option | Change | Result | Cost |
|---|---|---|---|
| A. Delete `prepare-release.yml`; move the checklist into `influxdb3-release.yml` | Delete the workflow and, if nothing else needs it, `update-product-version.sh` and its README entries. Replace "Version updates" in the `influxdb3-release.yml` PR body with specific items. | One release path for InfluxDB 3. No new script to maintain. | Removes the only `release_type` input and the only path that opens a standalone checklist issue. |
| B. Make `prepare-release.yml` a checklist-only workflow | Remove the branch, placeholder, and version-update steps. Add `.github/scripts/release-checklist.js` and `permissions: issues: write`. | A working checklist issue for all four products. | Two InfluxDB 3 release workflows remain, and they overlap. |
| C. Fix `prepare-release.yml` end to end | Option B, plus fix `update-product-version.sh` (drop `compose-examples`, map product keys, skip products without `latest_patch`), and commit, push, and open a PR. | A full release PR from one dispatch. | Largest change. Duplicates what `influxdb3-release.yml` does. |
| D. Remove only the checklist step | Delete the step. | The workflow still fails at "Update product versions". | Fixes nothing a user would notice. |

Option A is the smallest change that leaves a working path.
Choose B if release managers need a standalone checklist issue, or if the
cloud products need a checklist and `influxdb3-release.yml` isn't the right
place for one.

## Checklist content

Whichever option you choose, the checklist for Core and Enterprise needs at
least:

- Bump `latest_patch` for `influxdb3_core` or `influxdb3_enterprise` in
  `data/products.yml`.
- Add release notes to
  `content/shared/v3-core-enterprise-release-notes/_index.md`.
- Confirm the download artifacts at `dl.influxdata.com` are live.
  `pr-release-check.yml` reminds about this but doesn't block.
- Pending decision: set `latest_quay_tag` to the release commit SHA.
  Add this only after the field and its CI check exist.

## Questions to resolve

1. Who uses `prepare-release.yml`, and do they need a standalone checklist
   issue or the `release_type` input?
   If no one does, use option A.
2. Has `influxdb3-release.yml` run successfully with `dry_run: false`?
   Check the Actions run history.
   If it has never run, option A moves the checklist into a workflow no one
   uses either.
3. Where are `latest_quay_tag` and the "Quay tag check" job being added?
   Which branch or repository, and who owns it?
4. Do Cloud Serverless, Cloud Dedicated, and Clustered need a release
   checklist?
   They have no top-level `latest_patch`, so their checklist items differ
   from those for Core and Enterprise.

## Constraints for the implementer

- Follow the commit format in `AGENTS.md`: `type(scope): description`, with
  What changed, Why, Impact, and Verification.
- Pin any third-party action by full commit SHA with a version comment.
  `actions/github-script` is already pinned at
  `3a2844b7e9c422d3c10d287c895573f7108da1b3  # v9.0.0`.
- Delete this file before merging.
  `block-ephemeral-docs.yml` blocks `HANDOVER.md` on the default branch.
