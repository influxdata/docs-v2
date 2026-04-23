# Design: Automated InfluxDB v3 client library release notes

**Date:** 2026-04-23
**Status:** Design approved, implementation plan pending
**Scope:** MVP for publishing v3 client library release notes in docs.influxdata.com

## Problem

The InfluxData v3 client libraries (Python, Go, JS, C#, Java) ship independent releases
from repos under `InfluxCommunity/`, but `docs.influxdata.com` has no published release
notes for any of them. Existing client library pages at
`/influxdb3/<product>/reference/client-libraries/v3/<lang>/` are stale because there is no
time to maintain them manually.

At minimum, users and the Kapa.ai knowledge base should have current release notes per
client. Ideally, upstream repos stay the source of truth and docs-v2 publishes
downstream automatically.

## Decisions

| Decision       | Choice                                                                                                 | Rationale                                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MVP scope      | Changelog sync now, README sync later (phased)                                                         | Low coordination cost; proves the pipeline before asking for upstream template work. README sync is a clean follow-up once the client team opts in.                                          |
| URL structure  | Mirror existing per-product pattern; use `canonical` frontmatter                                       | Adding `/influxdb3/` general content breaks a pattern we do not otherwise have. Defer hub-style consolidation to a separate spec.                                                            |
| Trigger model  | Nightly cron + `workflow_dispatch` override                                                            | Zero-coordination routine path; manual escape hatch for post-release urgency. Avoids modifying the 5 upstream client repos.                                                                  |
| Transformation | Raw markdown body + light regex; top version/date to frontmatter; per-heading `{date="..."}` attribute | Matches existing release notes convention (`## vX.Y.Z {date="YYYY-MM-DD"}`). Extracts the minimum structured data needed for cross-page consumption without maintaining a per-client parser. |
| Client scope   | v3 only (5 InfluxCommunity repos)                                                                      | v2 Java client is a different org and cadence; defer to avoid widening MVP.                                                                                                                  |

## Architecture

### Source repos

Five repos on `main`, each with `CHANGELOG.md`:

- `InfluxCommunity/influxdb3-python`
- `InfluxCommunity/influxdb3-go`
- `InfluxCommunity/influxdb3-js`
- `InfluxCommunity/influxdb3-csharp`
- `InfluxCommunity/influxdb3-java`

### Sync workflow

`.github/workflows/sync-client-library-release-notes.yml`

- **Triggers:**
  - `schedule`: nightly cron (initial value `0 6 * * *` UTC, adjust as needed).
  - `workflow_dispatch`: input for client selection (`python`, `go`, `js`, `csharp`, `java`, `all`; default `all`).
- **Per client:**
  1. Fetch `CHANGELOG.md` from upstream (sparse checkout of `main`).
  2. Run transform script.
  3. Write to the shared source file.
  4. If content unchanged, skip this client.
- **Failure isolation:** one client's parse or fetch failure records a warning and does
  not block the other clients.
- **PR behavior:** if any client produced changes, open or update a single PR titled
  `sync(client-libs): update release notes` using `peter-evans/create-pull-request`'s
  default "update existing open PR on the same branch" behavior. Avoids PR churn on
  days with multiple releases (e.g., the 2026-04-22 announcement shipping 5 clients).

### Transform script

`helper-scripts/client-libraries/sync-release-notes.js`

- **Body transform:** line-by-line regex pass on the raw `CHANGELOG.md` body.
  - Match `## [X.Y.Z] - YYYY-MM-DD` (and common variants: unbracketed version, `(YYYY-MM-DD)` parens) and rewrite to `## vX.Y.Z {date="YYYY-MM-DD"}`.
  - Non-matching lines pass through unchanged.
  - Strip or preserve the upstream `# Changelog` H1 (TBD in implementation plan; likely strip since Hugo renders its own H1 from frontmatter `title`).
- **Frontmatter generation:** extract the first version heading and date, emit as
  `latest_version` and `latest_release_date` frontmatter fields. Include a `generated`
  marker and source URL so the file is self-identifying:
  ```yaml
  ---
  title: influxdb3-python release notes
  description: Release notes for the influxdb3-python client library.
  latest_version: 0.19.0
  latest_release_date: 2026-04-23
  source_repo: https://github.com/InfluxCommunity/influxdb3-python
  source_file: CHANGELOG.md
  generated: true
  ---
  <!-- Generated from CHANGELOG.md. Edit upstream and re-sync; do not edit here. -->
  ```

### File layout

**Shared source (one per client, written by the sync):**

```
content/shared/influxdb-client-libraries-reference/v3/release-notes/
  python.md
  go.md
  javascript.md
  csharp.md
  java.md
```

**Per-product stubs (5 products x 5 clients = 25 thin stubs, hand-written once):**

```
content/influxdb3/{core,enterprise,cloud-dedicated,cloud-serverless,clustered}/
  reference/client-libraries/v3/<lang>/release-notes.md
```

Each stub contains only frontmatter:

```yaml
---
title: influxdb3-python release notes
menu:
  influxdb3_<product>:
    name: Release notes
    parent: influxdb3-python
canonical: /influxdb3/core/reference/client-libraries/v3/python/release-notes/
source: /shared/influxdb-client-libraries-reference/v3/release-notes/python.md
---
```

Canonical URL points all five product variants at the Core copy so search engines and
Kapa.ai deduplicate near-identical pages.

### Downstream integration

- Existing landing pages at `.../client-libraries/v3/<lang>/` gain a "Latest version"
  callout that reads the child release-notes page's `latest_version` and
  `latest_release_date` via Hugo's `.Site.GetPage`. One template/partial change,
  applied via the shared source so it lives in one place.
- No other changes to existing landing pages in MVP. Phase 2 (README sync) is what
  updates body content.

## Non-goals

- README-as-source-of-truth sync for client library landing pages (phase 2).
- v2 Java client (`influxdata/influxdb-client-java`) release notes.
- `/influxdb3/` general content hub — a separate architectural decision with its own
  SEO and nav implications.
- Retrofitting `sync-plugins.yml` to the cron + dispatch trigger model — worth doing
  once the client-library sync is proven, tracked as a follow-up.

## Risks and mitigations

| Risk                                                                      | Mitigation                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Upstream CHANGELOG format drifts (e.g., someone adds a new heading style) | Regex transform is defensive — non-matching lines pass through. Worst case: a heading renders without its date badge. Alerting: transform script logs a warning when no version heading is parsed; the PR body surfaces these warnings. |
| Kapa retrieves all 5 product-variant pages for the same release note      | Canonical URL frontmatter. All 5 stubs canonicalize to Core.                                                                                                                                                                            |
| Nightly cron creates noisy PR activity                                    | Single rolling PR per sync branch; updated in place when the branch already exists. No PR opened when no content changed.                                                                                                               |
| A single client's fetch fails (e.g., repo briefly unavailable)            | Per-client isolation — the job records the failure and continues with the other clients. Next cron run retries.                                                                                                                         |

## Open items (for implementation plan)

- Cron time (current guess `0 6 * * *` UTC).
- Whether to strip the upstream `# Changelog` H1 or pass it through.
- Whether the transform needs to handle `[Unreleased]` sections (likely strip or convert
  to a normal heading without a date).
- Exact Hugo partial for the "Latest version" callout on existing landing pages.
- Whether to add a smoke test (e.g., a JSON snapshot test of the transform on a fixture
  CHANGELOG per client).
