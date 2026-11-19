---
name: release-staging
description: Stage a documentation product launch or versioned release in docs-v2 by composing relevant PR heads, building the full Hugo site, testing the rendered docs UI, and reporting missed wording or navigation changes. Use before publication, for release/GA cutovers, and when reviewing multiple related docs PRs together.
---

# Release staging

Use the CI workflow [Release staging review](../../../.github/workflows/release-staging.yml)
and its trusted scripts under `.ci/release-staging/`. The workflow owns the
build and reporting. The skill owns PR selection, interpretation, and handoff.

## Prepare the staging set

1. Identify all open `docs-v2` PRs belonging to the same release or launch.
   Include homepage, shared content, product metadata, notifications, and
   release notes. Check related PRs before treating source-search matches as
   the complete set. Close intake when every known change has a PR or an
   assigned blocker.
2. Apply the `release-staging` label to each relevant PR. Only same-repository,
   open PRs targeting `master` are eligible. Keep unrelated releases out of
   the set; all labeled PRs are composed together in the initial CI pilot.
3. Check `.ci/release-staging/checks.json` against the launch decision:
   list every high-impact rendered route, expected homepage links/order, and
   wording that needs review across the entire site. Add targeted assertions
   before staging rather than accepting a green build as content approval.
4. Record the approved wording and publication hold separately. A staging
   pass does not merge PRs into `master`, deploy publicly, or approve a launch.

## Run staging

CI runs on selected PR updates, when `release-staging` is added or removed,
and on its weekday schedule. For an explicit rerun, use **Actions > Release
staging review > Run workflow**. The optional `pr_numbers` input overrides
label discovery without changing the public repository.

The CI job fetches the exact selected PR SHAs and merges them into a temporary
runner checkout. Any merge conflict blocks the run. The job builds the full
site using the canonical Hugo action, scans every rendered HTML page, and
opens priority routes in Chromium at desktop and mobile widths. It saves a
combined-SHA record, route results, screenshots, and an Actions summary.

## Triage the report

1. Inspect every blocking browser/build failure and its exact rendered URL.
   Fix the owning PR, then rerun staging against the new PR SHA.
2. Review every site-wide wording match, including pages outside the expected
   product directory. Mark each match `update`, `preserve`, or `not affected`.
   Preserve genuine feature and compatibility limits when removing obsolete
   access restrictions.
3. Compare the staged homepage, navigation, overview, get-started guide,
   notification, signup, and support path against the launch brief. Use the
   screenshots to inspect layout, not merely as evidence that a browser ran.
4. Hand the resulting report to the release owner. State the exact PR heads,
   failures, remaining review matches, outstanding checks, and go/no-go owner.

Staging is ready only when the current PR SHAs compose, required browser
checks pass, and the reviewer has resolved all material wording findings.
Publication authorization and live post-launch verification remain separate.

## Limits of the initial CI pilot

- The CI build serves a temporary site only to its own browser. It produces
  screenshots and a report, not a shareable integrated staging URL.
- The workflow reads open same-repo PRs under one `release-staging` label.
  Use the manual PR list for distinct simultaneous releases until staging
  groups are supported.
- Review-term findings are advisory. The launch owner decides which are
  incorrect; missing required UI elements and merge/build failures block CI.
- No production secrets, deployments, pushes, or merges to `master` run in
  the staging job.
