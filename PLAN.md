# Implementation plan: scheduled plugin documentation sync

## Overview

Replace the issue-triggered InfluxDB 3 plugin sync with a scheduled pull from
`influxdata/influxdb3_plugins`, and close the gap that leaves 23 of 34 official
plugins undocumented.

The existing `.github/workflows/sync-plugins.yml` has never completed
successfully: of its last 100 runs, 99 were skipped no-ops and one failed at
`Setup Node.js`. It also interpolates issue-body text directly into shell and
`github-script` bodies while holding `contents: write`, which is a live
injection surface in a public repository.

The transform script `helper-scripts/influxdb3-plugins/port_to_docs.js` is
worth keeping. Its rules encode real accumulated knowledge about link
rewriting, shortcode insertion, and style-attribute extraction. The workflow
around it is not worth keeping.

## Architecture decisions

Recorded in [docs/adr/0004-plugin-sync-ownership-seam.md](docs/adr/0004-plugin-sync-ownership-seam.md).
Terminology is defined in
[helper-scripts/influxdb3-plugins/README.md](helper-scripts/influxdb3-plugins/README.md#terminology).

- Plugins are discovered by scanning `influxdata/*/manifest.toml` upstream.
  `docs_mapping.yaml` shrinks to slug overrides and exclusions.
- Ownership splits three ways by file: manifest facts into a Hugo data file the
  sync fully owns; README prose into a generated region of the shared page;
  product stubs created once and never rewritten.
- The sync opens one aggregate pull request per run on a fixed branch, always
  review-gated.
- Scope is `influxdata/` only. Contributor directories are out.

## Task list

Tasks are recorded here rather than in an external tracker.
`AGENTS.md` designates `PLAN.md` at the repo root for implementation plans, and
a required check blocks it from merging to `master`.

### Phase 0: Close the injection surface

#### Task 1: Remove the issue trigger and issue form

**Description:** Delete the `issues:` trigger and the sync request issue form.
This removes the injection path and stops the workflow starting a runner on
every issue opened in the repository. Lands as its own commit, ahead of the
rewrite, so it can merge immediately.

**Acceptance criteria:**

- [ ] `on:` in `.github/workflows/sync-plugins.yml` lists only
  `workflow_dispatch`.
- [ ] The `Parse issue inputs`, `Update issue status`, `Report validation
      failure`, `Update issue with success`, and `Report failure` steps are
  removed, along with `issues: write` from `permissions:`.
- [ ] `.github/ISSUE_TEMPLATE/sync-plugin-docs.yml` is deleted.
- [ ] Issue #7461 is closed with a comment explaining the replacement.

**Verification:**

- [ ] `actionlint .github/workflows/sync-plugins.yml` reports no errors.
- [ ] Manual check: no `${{ github.event.issue` remains in the file.

**Dependencies:** None.

**Files likely touched:**

- `.github/workflows/sync-plugins.yml`
- `.github/ISSUE_TEMPLATE/sync-plugin-docs.yml`

**Estimated scope:** Small.

### Phase 1: Generator

#### Task 2: Discover plugins by scanning manifests

**Description:** Replace the hand-maintained plugin list with a scan of
`influxdata/*/manifest.toml` in the upstream checkout. Reduce
`docs_mapping.yaml` to a slug override map and an exclusion list, keeping the
existing `exceptions.manual_review` entries.

**Acceptance criteria:**

- [ ] A scan of a fixture tree returns all official plugins, excluding
  `influxdata/library/`.
- [ ] `mad_check` resolves to the `mad-anomaly-detection` stub slug through an
  override entry.
- [ ] A plugin directory missing `manifest.toml` or `README.md` is skipped and
  reported, not fatal.

**Verification:**

- [ ] Tests pass: `node --test helper-scripts/influxdb3-plugins/test/`
- [ ] Manual check: `yarn sync-plugins:dry-run` lists 34 plugins.

**Dependencies:** None.

**Files likely touched:**

- `helper-scripts/influxdb3-plugins/port_to_docs.js`
- `helper-scripts/influxdb3-plugins/docs_mapping.yaml`
- `helper-scripts/influxdb3-plugins/test/discovery.test.js`

**Estimated scope:** Medium.

#### Task 3: Generate the plugin data file

**Description:** Parse each plugin's `manifest.toml` into
`data/influxdb3_plugins.yml`, mapping upstream trigger identifiers to the
documentation vocabulary. The sync owns this file completely.

**Acceptance criteria:**

- [ ] `data/influxdb3_plugins.yml` contains one entry per official plugin with
  name, slug, description, trigger types, dependencies, and upstream URL.
- [ ] Entries follow the shape `data/telegraf_plugins.yml` uses, so the
  existing `plugin-card` and `list-filters` rendering applies unchanged in
  Task 14: `name`, `id`, `description`, `tags`, plus `introduced` from the
  manifest `version` and a minimum `database_version`.
- [ ] `process_scheduled_call`, `process_writes`, and `process_request` map to
  `scheduled`, `data-write`, and `HTTP request`.
- [ ] Output is deterministic: two runs over the same input produce byte-
  identical files.

**Verification:**

- [ ] Tests pass: `node --test helper-scripts/influxdb3-plugins/test/`
- [ ] Build succeeds: `npx hugo --quiet`

**Dependencies:** Task 2.

**Files likely touched:**

- `helper-scripts/influxdb3-plugins/port_to_docs.js`
- `data/influxdb3_plugins.yml`
- `helper-scripts/influxdb3-plugins/test/manifest.test.js`

**Estimated scope:** Medium.

#### Task 4: Preserve hand-owned regions in shared pages

**Description:** Make the shared-page writer region-aware. The generator
replaces content between markers and preserves everything outside them. Migrate
the two hardcoded `addSchemaRequirements()` sections out of the script and into
hand-owned regions of `basic-transformation.md` and `downsampler.md`.

**Acceptance criteria:**

- [ ] A page with a hand-owned region survives regeneration unchanged outside
  the generated region.
- [ ] A page with no markers is treated as fully generated and gains markers on
  first write.
- [ ] `addSchemaRequirements()` is removed from `port_to_docs.js` and its
  content appears in the two pages.
- [ ] A page with an unterminated marker fails that plugin and reports it,
  rather than corrupting the file.

**Verification:**

- [ ] Tests pass: `node --test helper-scripts/influxdb3-plugins/test/`
- [ ] Manual check: regenerate the 11 existing pages and read the diff. Expect
  marker insertion and the two migrated sections, nothing else.

**Dependencies:** Task 2.

**Files likely touched:**

- `helper-scripts/influxdb3-plugins/port_to_docs.js`
- `content/shared/influxdb3-plugins/plugins-library/official/basic-transformation.md`
- `content/shared/influxdb3-plugins/plugins-library/official/downsampler.md`
- `helper-scripts/influxdb3-plugins/test/regions.test.js`

**Estimated scope:** Medium.

#### Task 5: Scaffold product stubs for new plugins

**Description:** When a plugin has no Core or Enterprise stub, create one from
a template carrying the conventions the existing 22 stubs follow. Never rewrite
an existing stub.

**Acceptance criteria:**

- [ ] A new plugin produces stubs at
  `content/influxdb3/{core,enterprise}/plugins/library/official/<slug>.md`
  with `title`, `description`, `menu`, `weight: 100`, product-namespaced
  tags, `related`, `source`, and `canonical: self`.
- [ ] An existing stub is left byte-identical.
- [ ] Generated stubs render: the page resolves its shared source and appears
  under `Official plugins` in both product menus.

**Verification:**

- [ ] Tests pass: `node --test helper-scripts/influxdb3-plugins/test/`
- [ ] Build succeeds: `npx hugo --quiet`
- [ ] Manual check: `npx hugo server`, confirm one scaffolded page renders in
  Core and Enterprise.

**Dependencies:** Tasks 2, 3.

**Files likely touched:**

- `helper-scripts/influxdb3-plugins/port_to_docs.js`
- `helper-scripts/influxdb3-plugins/stub-template.js`
- `helper-scripts/influxdb3-plugins/test/stubs.test.js`

**Estimated scope:** Medium.

#### Task 6: Report skips, changes, and drift

**Description:** Give the generator the reporting surface the workflow needs,
following the pattern in `helper-scripts/client-libraries/sync-release-notes.js`.
Emit a step summary, a `needs_attention` output, and a non-zero exit only for
genuine errors.

**Acceptance criteria:**

- [ ] The script writes a markdown table to `GITHUB_STEP_SUMMARY` listing each
  plugin and its status.
- [ ] `needs_attention` is set when any plugin is skipped or a page is
  reported as newly scaffolded.
- [ ] A skipped plugin does not fail the run; a malformed region or unwritable
  target does.
- [ ] Multi-line outputs use a random heredoc delimiter.

**Verification:**

- [ ] Tests pass: `node --test helper-scripts/influxdb3-plugins/test/`
- [ ] Manual check: run with one fixture plugin deliberately malformed and
  confirm the run succeeds with the plugin listed as skipped.

**Dependencies:** Tasks 2, 4, 5.

**Files likely touched:**

- `helper-scripts/influxdb3-plugins/port_to_docs.js`
- `helper-scripts/influxdb3-plugins/test/reporting.test.js`

**Estimated scope:** Small.

### Checkpoint: Generator complete

- [ ] `node --test helper-scripts/influxdb3-plugins/test/` passes.
- [ ] `yarn sync-plugins:dry-run` reports all 34 official plugins.
- [ ] Regenerating the 11 existing pages produces only the expected migration
  diff.
- [ ] `npx hugo --quiet` succeeds.
- [ ] Review with a human before proceeding.

### Phase 2: Workflow

#### Task 7: Rewrite the sync workflow

**Description:** Replace the body of `sync-plugins.yml` with a scheduled pull
modelled on `sync-client-library-release-notes.yml`. Remove the debug
scaffolding, the Playwright install, the disabled screenshot step, and the
unnecessary PAT on the upstream checkout.

**Acceptance criteria:**

- [ ] The only trigger is `workflow_dispatch`; its input accepts a plugin list
  or `all`. The cron is added in Task 12, after the backfill, so the
  schedule never runs against a knowingly incomplete library.
- [ ] The upstream checkout is tokenless, sparse on `influxdata/` and
  `scripts/`, at `main`.
- [ ] `node-version-file: docs-v2/.nvmrc` — the path bug that broke the last
  run is fixed.
- [ ] A `concurrency` group prevents a dispatch racing the cron.
- [ ] `persist-credentials: false` on the upstream checkout.
- [ ] The generator runs, then the job exits early when the tree is clean.
- [ ] `peter-evans/create-pull-request` targets the fixed branch
  `sync/influxdb3-plugins` with labels `source:sync` and
  `product:v3-monolith`, and a PR body composed from generator output
  passed through `env:`, not interpolated into shell.
- [ ] All actions are SHA-pinned with version comments.

**Verification:**

- [ ] `actionlint` and `zizmor` report no errors.
- [ ] Manual check: `gh workflow run` against a test branch produces a pull
  request with the expected diff.

**Dependencies:** Tasks 1, 6.

**Files likely touched:**

- `.github/workflows/sync-plugins.yml`

**Estimated scope:** Medium.

#### Task 8: Update the pipeline documentation

**Description:** Rewrite `helper-scripts/influxdb3-plugins/README.md`, which
currently documents the issue-form path as recommended, claims "No cross-repo
secrets" while the workflow used a PAT, promises screenshots that are disabled,
names the pre-migration `sync-plugin-docs` label, and prescribes a manual
workflow under "Phase 5: Manual Workflow (Until Automation is Ready)". Update
the generated-directory `CLAUDE.md` for the region model.

**Acceptance criteria:**

- [ ] The README describes the scheduled pull, the three-way ownership split,
  and how to add a hand-owned region.
- [ ] Every claim in it is true of the workflow as landed.
- [ ] `content/shared/influxdb3-plugins/plugins-library/official/CLAUDE.md`
  distinguishes generated regions from hand-owned regions.

**Verification:**

- [ ] Manual check: every file path, label, and command named in the README
  exists.

**Dependencies:** Task 7.

**Files likely touched:**

- `helper-scripts/influxdb3-plugins/README.md`
- `content/shared/influxdb3-plugins/plugins-library/official/CLAUDE.md`

**Estimated scope:** Small.

### Checkpoint: Pipeline works

- [ ] A manual `workflow_dispatch` produces a pull request.
- [ ] A second dispatch with no upstream change produces no pull request.
- [ ] Docs CI runs on the generated pull request.
- [ ] The pull request body states current coverage.
- [ ] Review with a human before proceeding.

### Phase 3: Coverage and backfill

#### Task 9: Add a coverage verifier

**Description:** Add a check that reconciles the number of official plugins
upstream against what docs-v2 actually publishes, and reports the gap on every
run. This is the signal that was missing: the sync reported success while
documenting 11 of 34 plugins, and nothing in the repository could tell the
difference between a healthy pipeline and a dormant one.

Reconcile per axis rather than as a single number. A plugin can have a shared
page and no Enterprise stub, and a bare count would hide that.

Ship it with a committed baseline recording the current known gap. The backfill
in Task 11 is complete when the baseline reaches zero, which makes this task's
output the acceptance test for that one.

**Acceptance criteria:**

- [ ] `yarn verify-plugin-coverage` reports, for official plugins upstream: how
  many have a `data/influxdb3_plugins.yml` entry, a shared page, a Core
  stub, and an Enterprise stub.
- [ ] Output names the missing items per axis, not just totals.
- [ ] A committed baseline file records the accepted gap. The check fails when
  the gap grows beyond the baseline, and reports without failing when it
  shrinks.
- [ ] The sync workflow runs the verifier and writes its table into the step
  summary and the pull request body on every run, including no-op runs.
- [ ] A plugin listed in the `docs_mapping.yaml` exclusion list is excluded
  from the expected count and named as excluded.

**Verification:**

- [ ] Tests pass: `node --test helper-scripts/influxdb3-plugins/test/`
- [ ] Manual check: run against the current tree and confirm it reports 11 of
  34 documented, naming the 23 that are missing.
- [ ] Manual check: delete one Enterprise stub in a scratch tree and confirm
  the check fails and names that stub.

**Dependencies:** Tasks 2, 3, 5.

**Files likely touched:**

- `helper-scripts/influxdb3-plugins/verify-coverage.js`
- `helper-scripts/influxdb3-plugins/coverage-baseline.json`
- `helper-scripts/influxdb3-plugins/test/coverage.test.js`
- `package.json`
- `.github/workflows/sync-plugins.yml`

**Estimated scope:** Medium.

#### Task 10: Audit the 23 undocumented plugins

**Description:** Run the generator against all 34 plugins and triage the
output before proposing content. Determine which upstream READMEs fail
`validate_readme.py`, and how many Vale errors the new shared pages raise.

**Acceptance criteria:**

- [ ] A written list of the 23 plugins, each marked ready, needs upstream README
  work, or needs editorial work.
- [ ] Vale results for the generated pages are recorded, with a decision on
  which errors block the backfill.
- [ ] Upstream issues are filed for READMEs that fail validation.

**Verification:**

- [ ] Manual check: the list accounts for all 34 official plugins.

**Dependencies:** Task 9.

**Files likely touched:**

- None. Output is an audit recorded in the tracking issue.

**Estimated scope:** Medium.

#### Task 11: Land the backfill

**Description:** Open the reviewed pull request adding pages for the plugins
marked ready in Task 10. Hold back the rest.

**Acceptance criteria:**

- [ ] Each new plugin has a shared page and Core and Enterprise stubs.
- [ ] `/influxdb3/core/plugins/library/official/` and the Enterprise equivalent
  list every backfilled plugin.
- [ ] Vale passes, or every remaining alert is explicitly accepted.
- [ ] The Task 9 coverage baseline is reduced to zero, or to only the plugins
  Task 10 marked as needing upstream work, each named.

**Verification:**

- [ ] Build succeeds: `npx hugo --quiet`
- [ ] Link check passes on the changed pages.
- [ ] Manual check: spot-read three backfilled pages against their upstream
  READMEs.

**Dependencies:** Task 10.

**Files likely touched:**

- `content/shared/influxdb3-plugins/plugins-library/official/*.md`
- `content/influxdb3/{core,enterprise}/plugins/library/official/*.md`
- `data/influxdb3_plugins.yml`
- `helper-scripts/influxdb3-plugins/coverage-baseline.json`

**Estimated scope:** Large. Split by plugin batch if review stalls.

### Phase 4: Enable and retire

#### Task 12: Enable the schedule

**Description:** Add the cron trigger once a manual dispatch has produced a
clean no-op run against the backfilled tree.

**Acceptance criteria:**

- [ ] `schedule` is `cron: '30 7 * * *'` — 07:30 UTC daily, clear of the 06:00
  client-libraries cron and the 06:30 and 07:00 Monday OpenAPI crons.
- [ ] One scheduled run completes and opens no pull request.
- [ ] That run's step summary reports full coverage.

**Verification:**

- [ ] Manual check: the run appears in the Actions tab with a step summary
  listing all official plugins and the coverage table.

**Dependencies:** Task 11.

**Files likely touched:**

- `.github/workflows/sync-plugins.yml`

**Estimated scope:** Extra small.

#### Task 13: Retire the upstream reminder workflow

**Description:** Open a pull request against `influxdata/influxdb3_plugins`
removing `.github/workflows/remind-sync-docs.yml` and the "Documentation Sync
Process" section of `CONTRIBUTING.md`, which both point at the deleted issue
form.

**Acceptance criteria:**

- [ ] The reminder workflow is deleted.
- [ ] `CONTRIBUTING.md` describes the scheduled pull instead of the form, and
  its `blob/master/` links are corrected to `blob/main/`.

**Verification:**

- [ ] Manual check: a README change upstream produces no broken reminder.

**Dependencies:** Task 12.

**Files likely touched:**

- Upstream repository only.

**Estimated scope:** Small.

### Phase 5: Library index

#### Task 14: Render the plugin library from data

**Description:** Replace `{{< children >}}` on the official plugin library
index with a filterable card grid driven by `data/influxdb3_plugins.yml`,
following the pattern `content/telegraf/v1/plugins.md` uses. This is the change
that answers the original report: the backfill makes the pages exist, and this
makes them findable.

The frontend already exists. `plugin-card` and `filter-item` styling, the
`list-filters` shortcode, and the client-side filter are in the repository and
need a data source and a facet definition, not new components.

**Acceptance criteria:**

- [ ] A new shortcode renders one card per entry in
  `data/influxdb3_plugins.yml`, carrying `data-tags` for trigger type and
  plugin tags, and linking to the plugin's page in the current product.
- [ ] `data/list_filters.yml` gains an `influxdb3_plugins` key with a trigger
  type facet (scheduled, data write, HTTP request) and a tag facet.
- [ ] The official library index uses the shortcode instead of
  `{{< children >}}`, and renders correctly in both Core and Enterprise.
- [ ] Cards link to the correct per-product URL, not a hardcoded product.

**Verification:**

- [ ] Build succeeds: `npx hugo --quiet`
- [ ] Cypress passes, including a new test asserting the index lists every
  plugin in the data file and that filtering by trigger type narrows it.
- [ ] Manual check: `npx hugo server`, filter by each trigger type in Core and
  Enterprise.

**Dependencies:** Tasks 3, 11.

**Files likely touched:**

- `layouts/shortcodes/influxdb3/plugins.html`
- `data/list_filters.yml`
- `content/shared/influxdb3-plugins/plugins-library/official/_index.md`
- `cypress/e2e/content/plugin-library.cy.js`

**Estimated scope:** Medium.

### Checkpoint: Complete

- [ ] The scheduled sync has run unattended for one week.
- [ ] A deliberate upstream README change produces a pull request within a day.
- [ ] Coverage reports zero gap, and a new upstream plugin moves that number.
- [ ] No workflow in either repository references the issue form.
- [ ] The library index lists and filters every official plugin.

## Risks and mitigations

| Risk                                                                                                                                                                                   | Impact | Mitigation                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 23 new shared pages raise a large number of Vale alerts. `content/shared` is linted more strictly than product directories, so upstream README prose will surface pre-existing errors. | High   | Task 9 measures this before any content lands. If the count is unmanageable, backfill in batches by plugin.                                                    |
| Upstream READMEs fail `validate_readme.py`, shrinking the backfill below 23.                                                                                                           | Medium | Task 9 files upstream issues. The sync skips and reports rather than failing.                                                                                  |
| Region markers are lost or mangled by a future hand edit, and the generator silently overwrites prose.                                                                                 | Medium | Task 4 makes an unterminated marker a per-plugin failure, not a silent overwrite.                                                                              |
| Hugo builds in this repo are not byte-reproducible, so build output cannot be used for change detection.                                                                               | Medium | Change detection diffs content and data files only, never build output.                                                                                        |
| The pipeline reports success while doing nothing useful, as it did for eight months.                                                                                                   | High   | Task 9 reconciles upstream plugin count against published pages on every run and prints the result where humans read it.                                       |
| The coverage verifier itself becomes the thing nobody watches.                                                                                                                         | Medium | It writes into the pull request body, not only a job log, so the number appears in the artifact a reviewer already opens. It also fails the job on regression. |
| The backfill pull request is too large to review carefully.                                                                                                                            | Medium | Task 11 is explicitly splittable by plugin batch.                                                                                                              |

## Settled

- The pull request token is provisioned separately by the docs maintainer.
  Task 7 assumes it exists under a repository secret.
- The schedule is 07:30 UTC daily, clear of the three existing sync crons.

## Deferred

Does not block this plan. Revisit after the schedule is running.

- Should the sync cover every in-tree plugin, or only those published to the
  registry index? The plan assumes in-tree, which can include a plugin before
  its first release.
