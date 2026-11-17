# Coordinate the InfluxDB OSS 2.10.1 release

**Status:** Local release preparation. Nothing pushed. Release-note source reconciliation complete.

## Goal

Create one visible v2.10.1 release-note section dated 2026-11-17, with matching product metadata.
Keep all changes local and remove this release plan when the remaining tasks are complete, as the user requested.

## Sources and release coordination

- The user supplied `CHANGELOG-v2.9.1-to-v2.10.1.md`, generated through `main-2.x` commit `f8319f25c47593de4569aae98211b5512dde6f6f`.
  It contains 22 features, 13 bug fixes, and 11 other changes in one section.
- [influxdb#27759](https://github.com/influxdata/influxdb/pull/27759) merged at `2026-11-17T19:42:20Z` with all reported checks passing.
  Its source verifies the security entries about organization boundaries and token permission validation.
- [The release coordination message](https://influxdata.slack.com/archives/CPYJNHM4K/p1794950683795109) links [repos#290](https://github.com/influxdata/repos/pull/290), [influxdb-customers#1115](https://github.com/influxdata/influxdb-customers/pull/1115), and [influxdata-docker#941](https://github.com/influxdata/influxdata-docker/pull/941).
  All three are open at the latest check.
  The package and download PRs report artifact checksum and signature verification.
  The Docker PR reports successful builds and tests, but official image publication still requires the docker-library update.
- The v2.10.1 tag now points to `db5102ec64d5dd3dfa87208edb054eb0721c36c9`.
  The [published changelog](https://dl.influxdata.com/influxdb/releases/CHANGELOG.v2.10.1.md) returns HTTP 200 and identifies that commit.
  A GitHub release is still absent at the latest check.
- The tag and the supplied changelog's source commit have divergent histories.
  The tag contains backports through [#27760](https://github.com/influxdata/influxdb/pull/27760), including the security patch and Go 1.26.11.
  The supplied changelog's series-iterator fix [#27724](https://github.com/influxdata/influxdb/pull/27724) is absent from the tag's post-2.10.0 commits; the index implementation also differs.
  A complete blob comparison found only four changed files: the iterator implementation and its two test files, plus the CI signing-runner configuration.
  At the user's request, remove the iterator entry to align the reader-facing notes with the tagged release.

## Decisions

- Consolidate unreleased 2.10.0 changes into 2.10.1 instead of listing an unpublished server release.
  The existing `v2.10.0` tag is a changelog boundary, not evidence that 2.10.0 shipped.
  Don't delete tags or modify `cliff.toml` in this documentation worktree.
- Keep the UI package version `OSS-v2.10.0`; it has its own version number.
  Combine all Go updates into one Maintenance entry, `Update Go to 1.26.11`.
- Use the supplied generated changelog for the current draft.
  Group related health/readiness changes and move the bucket security fix into Security.
  Include user-visible fixes, configuration, statistics, log fields, and dependency changes.
  Omit the test-only correction #27516, build-download fallback #27682, close assertion helper #27751, signing runner change #27733, and artifact hosting migration #27583.
  Fold the HEALTH\_READY.md addition #27477 into the health/readiness documentation links.
  Remove two legacy metric entries from the previous draft because the supplied changelog doesn't include them.
- Update the WAL delay default and examples from `10m` to `1h` in the configuration reference.
  The source diff for #27668 changes `DefaultWALMaxWriteDelay` to one hour.
- Keep `influxdb.latest` at `v2.10` and `latest_patches.v2` at `2.10.1`; leave the independent CLI version unchanged.

## Remaining tasks

- [x] Reconcile the supplied changelog to the tagged release by removing #27724; the other source-tree difference is CI-only.
- [ ] Confirm package, download portal, and official Docker publication.
- [ ] Prepare the 2.10.1 announcement with a new notification ID and preserve the token-hashing upgrade warning.
- [ ] Finish checks on the final source-reconciled notes and related changes.
- [ ] Delete this release plan once all tasks are complete.

## Verification

Before this changelog revision, the Hugo build, code-block lint, release-version check, and diff whitespace checks passed.
Rendered HTML showed `v2101` and `v291`, omitted `v2100`, and used 2.10.1 install URLs.
All internal release-note anchors resolved.
The earlier full link check found one existing historical GitHub link returning 404 and 67 warnings.
Fresh Hugo build, code-block lint for both changed content files, prose lint, release-version check, and `git diff --check` pass.
Rendered checks confirm the release headings, one Go update, UI package version, all release-section internal anchors, and the WAL default of `1h`.
The fresh link check covers 1,885 links across both pages and exits 1 with the same historical 404, 90 warnings, and two informational results.
Removed the series-iterator entry at the user's request after verifying the complete source-tree differences against the tag.
