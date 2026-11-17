# Coordinate the InfluxDB OSS 2.10.1 release

**Status:** Local release preparation. The consolidated 2.10.1 release notes are visible at the user's request; nothing is pushed.

## Goal

Publish accurate InfluxDB OSS 2.10.1 notes, download versions, and an announcement together when the release is available.
Keep all preparation local until publication is authorized.

## Release evidence

Checked on 2026-11-17:

- [Engineering's coordination message](https://influxdata.slack.com/archives/CPYJNHM4K/p1794942221451849) says OSS 2.10.1 is planned after another security patch and asks to coordinate documentation availability.
- The [GitHub releases API](https://api.github.com/repos/influxdata/influxdb/releases) lists v2.10.0 as a draft with no published date and v2.9.1 as the latest published 2.x release.
  No v2.10.1 release or tag exists in the checked API responses.
- The [versioned 2.10.1 changelog](https://dl.influxdata.com/influxdb/releases/CHANGELOG.v2.10.1.md) returns HTTP 404.
  This is the release changelog path defined by the [main-2.x release pipeline](https://github.com/influxdata/influxdb/blob/5247e9d2bdcad38b5b30db3e0f7482fde0a5b126/.circleci/config.yml#L935).
  The root repository `CHANGELOG.md` redirects readers to an obsolete nightly changelog; it isn't a 2.10.1 source.
- Direct binary requests for 2.9.1, 2.10.0, and 2.10.1 all return HTTP 403 from this environment.
  These responses don't distinguish unavailable artifacts from download access restrictions.
  Successful artifact verification remains pending.

## Existing PRs and master

No open 2.10 documentation PR appears in the repository's complete open PR list.
The related PRs are already merged:

- [#7867](https://github.com/influxdata/docs-v2/pull/7867), options, metrics, and compaction documentation, merged into `release/influxdb2.10-cloud`.
- [#7911](https://github.com/influxdata/docs-v2/pull/7911), enhanced release notes, merged into `dar-800`.
- [#7907](https://github.com/influxdata/docs-v2/pull/7907), the combined OSS 2.10 and Cloud 2 release, merged into `master`.
- [#7926](https://github.com/influxdata/docs-v2/pull/7926), hides the 2.10.0 notes until packages are available.

The current branch starts at fetched `origin/master`, `a14cbf4de6f34ee680ea51b40816a65d9e7d9824`.
It has no additional commits to rebase, and no open PR needs retargeting based on the checked list.
Existing historical commits and authorship are preserved.

## Decisions

- Consolidate the unreleased 2.10.0 changes into the visible 2.10.1 notes, as the user requested.
  Remove the separate 2.10.0 entry and its planned date because it did not become a published release.
  Set the 2.10.1 heading date to `2026-11-17`, as the user requested.
- Carry forward the 2.10.0 draft changes and add confirmed merged changes from the [v2.10.0 to main-2.x comparison](https://github.com/influxdata/influxdb/compare/v2.10.0...5247e9d2bdcad38b5b30db3e0f7482fde0a5b126).
  The [series iterator fix](https://github.com/influxdata/influxdb/pull/27724) and Go, compress, and go-jose updates are provisional release inclusions.
  Internal close assertions and CI signing changes don't need reader-facing entries.
  Pending security work must be reconciled against the final release commit and approved public changelog before adding claims.
- Set `influxdb.latest` to `v2.10` and `latest_patches.v2` to `2.10.1` in the local release preparation.
  These fields keep rendered upgrade guidance and download URLs aligned with the visible notes.
  Artifact availability remains a publication check.
  Keep `latest_cli.v2` at `2.9.1`; CLI and server releases have independent versions.
- Keep the existing 2.9.0 token-hashing announcement accurate and pinned to its historical release.
  A 2.10.1 announcement needs a new ID when the release is available.
  Don't infer a Cloud 2 rollout or an Amazon release from OSS release plans.

## Publication checklist

- [ ] Confirm engineering's final release commit and published v2.10.1 changelog.
- [ ] Replace provisional entries with the final user-visible changes, including approved security wording.
- [x] Consolidate the unreleased 2.10.0 changes into 2.10.1 at the user's request.
- [ ] Verify the release is public and its macOS, Linux, Windows, DEB, RPM, signatures, and documented container tags are available.
- [x] Set `influxdb.latest: v2.10` and `influxdb.latest_patches.v2: 2.10.1` together locally.
- [x] Show the consolidated 2.10.1 release notes locally at the user's request.
- [x] Set the 2.10.1 release date to `2026-11-17` at the user's request.
- [ ] Add an `influxdb-v2-10-1-release` notification scoped to `/influxdb/v2/`, with title `InfluxDB OSS 2.10.1 is available`, a summary of the final verified changes, and a link to `/influxdb/v2/reference/release-notes/influxdb/#v2101`.
  Retain the token-hashing upgrade warning if replacing the previous notification.
- [ ] Check health/readiness, exit-code, configuration, and API documentation against the final release for any changed contracts.
  These pages and the Cloud-specific API filtering already landed through the merged 2.10 work; don't regenerate API specs without a source change.
- [ ] Run release-version and changed-file checks, build Hugo, inspect rendered notes and announcements, and verify generated download URLs against available artifacts.

## Verification

Use `yarn verify:changed -- <changed paths>` to select checks.
Run `node .ci/scripts/check-release-notes-version.js` with the changed release paths.
A normal Hugo build must show `v2101` and `v291`, omit `v2100`, and use 2.10.1 in install download URLs.
Recheck release availability at publication time; today's release evidence is not a publication approval.

Initial checks before the user requested visible release preparation:

- `npx hugo --quiet` passes.
- `yarn lint-codeblocks content/influxdb/v2/reference/release-notes/influxdb.md` passes.
- `node .ci/scripts/check-release-notes-version.js content/influxdb/v2/reference/release-notes/influxdb.md data/products.yml` passes; OSS v2 notes and product data both report 2.9.1.
- `git diff --check` passes.
- Prose lint passes with warnings in existing historical notes, outside the new draft.
- Rendered HTML contains the `v291` heading and omits the `v2100` and `v2101` headings.
  The install page contains the 2.9.1 Linux download URL and no 2.10.0 or 2.10.1 Linux download URL.
- The rendered release-note link check exits 1 with 870 links checked, one error, 67 warnings, and one informational result.
  The error is the existing historical link to `https://github.com/influxdata/influxdb/blob/master/scripts/influxdb2-upgrade.sh`, which returns 404.
  The added draft doesn't render any new links.
  Historical link repairs are separate from this release preparation.

Current consolidated release-preparation checks pass: Hugo build, code-block lint, release-version check, and `git diff --check`.
Rendered HTML shows `v2101` and `v291`, omits `v2100`, and uses 2.10.1 Linux install URLs.
All internal anchors linked from the consolidated release section resolve in the built pages.
