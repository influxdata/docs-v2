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

- Plugins are discovered from the upstream registry index
  (`influxdata/influxdb3_plugins` release `registry`, asset `index.json`),
  deduped to the latest published version per plugin name. This only
  surfaces plugins that have been published to the registry; a plugin merged
  in-tree but not yet released does not appear until it is.
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

- [x] `on:` in `.github/workflows/sync-plugins.yml` lists only
  `workflow_dispatch`.
- [x] The `Parse issue inputs`, `Update issue status`, `Report validation
      failure`, `Update issue with success`, and `Report failure` steps are
  removed, along with `issues: write` from `permissions:`.
- [x] `.github/ISSUE_TEMPLATE/sync-plugin-docs.yml` is deleted.
- [ ] Issue #7461 is closed with a comment explaining the replacement.
  Deferred by request: link it from the pull request instead of closing it
  ahead of the rewrite landing.

**Verification:**

- [ ] `actionlint .github/workflows/sync-plugins.yml` reports no errors.
  Remaining alerts (shellcheck SC2086/SC2012, one `if-cond`) are pre-existing,
  confirmed identical on `master`, and in the Debug/Playwright/screenshot
  steps Task 7 removes; none are on lines this task touched.
- [x] Manual check: no `${{ github.event.issue` remains in the file.

**Dependencies:** None.

**Files likely touched:**

- `.github/workflows/sync-plugins.yml`
- `.github/ISSUE_TEMPLATE/sync-plugin-docs.yml`

**Estimated scope:** Small.

### Phase 1: Generator

#### Task 2: Discover plugins from the registry index

**Description:** Replace the hand-maintained plugin list with a fetch of the
`index.json` asset from the `influxdb3_plugins` `registry` release
(`https://github.com/influxdata/influxdb3_plugins/releases/download/registry/index.json`).
The index lists one entry per published version, scoped entirely to
`influxdata/` plugins already; dedupe to the latest `published_at` per `name`.
Reduce `docs_mapping.yaml` to a slug override map and an exclusion list,
keeping the existing `exceptions.manual_review` entries.

**Acceptance criteria:**

- [x] Reading a fixture `index.json` returns one entry per unique plugin
  `name`, keeping only the entry with the latest `published_at` when a name
  repeats.
- [x] `mad_check` resolves to the `mad-anomaly-detection` stub slug through an
  override entry.
- [x] A plugin excluded in `docs_mapping.yaml` is dropped from the result and
  reported as excluded, not fatal.
- [x] A live fetch failure (network error, non-200, malformed JSON) is a
  reported error, not a silent empty result.

**Verification:**

- [x] Tests pass: `node --test helper-scripts/influxdb3-plugins/test/*.test.js`
  (a bare directory arg doesn't glob under this repo's Node version; every
  other `node --test` script here already spells out the glob).
- [x] Manual check: `yarn sync-plugins:dry-run` lists every official plugin
  (35 at the time of this run; the registry grew by one between the ADR
  snapshot and this check, which is the discovery mechanism working as
  intended, not a fixed count to match).

**Dependencies:** None.

**Files likely touched:**

- `helper-scripts/influxdb3-plugins/port_to_docs.js`
- `helper-scripts/influxdb3-plugins/docs_mapping.yaml`
- `helper-scripts/influxdb3-plugins/discovery.js` (new)
- `helper-scripts/influxdb3-plugins/test/discovery.test.js`
- `helper-scripts/influxdb3-plugins/test/discovery-fetch.test.js`

**Estimated scope:** Medium.

#### Task 3: Generate the plugin data file

**Description:** Map each discovered registry entry into
`data/influxdb3_plugins.yml`, translating upstream trigger identifiers to the
documentation vocabulary. The registry entry already carries name, version,
description, triggers, and dependencies as JSON, so this task is a field
mapping, not a parser. The sync owns this file completely.

**Acceptance criteria:**

- [x] `data/influxdb3_plugins.yml` contains one entry per official plugin with
  name, id, description, trigger types, `database_version`, and upstream URL.
  `id` is the *product-stub* slug (`stubSlug`), not the shared-page slug —
  they differ for `mad_check`, and `id` is what Task 14's card link needs.
- [x] Entries follow the shape `data/telegraf_plugins.yml` uses, so the
  existing `plugin-card` and `list-filters` rendering applies unchanged in
  Task 14: `name`, `id`, `description`, `tags`, plus `introduced` from the
  registry `version` and a minimum `database_version` from
  `dependencies.database_version`.
- [x] `process_scheduled_call`, `process_writes`, and `process_request` map to
  `scheduled`, `data-write`, and `HTTP request`.
- [x] Output is deterministic: two runs over the same input produce byte-
  identical files.

**Verification:**

- [x] Tests pass: `node --test helper-scripts/influxdb3-plugins/test/*.test.js`
- [x] Build succeeds: `npx hugo --quiet`

**Dependencies:** Task 2.

**Files likely touched:**

- `helper-scripts/influxdb3-plugins/port_to_docs.js`
- `helper-scripts/influxdb3-plugins/plugin-data.js` (new)
- `data/influxdb3_plugins.yml`
- `helper-scripts/influxdb3-plugins/test/plugin-data.test.js`
- `helper-scripts/influxdb3-plugins/test/plugin-data-yaml.test.js`

**Estimated scope:** Small.

#### Task 4: Preserve hand-owned regions in shared pages

**Description:** Make the shared-page writer region-aware. The generator
replaces content between markers and preserves everything outside them. Migrate
the two hardcoded `addSchemaRequirements()` sections out of the script and into
hand-owned regions of `basic-transformation.md` and `downsampler.md`.

**Acceptance criteria:**

- [x] A page with a hand-owned region survives regeneration unchanged outside
  the generated region.
- [x] A page with no markers is treated as fully generated and gains markers on
  first write.
- [x] `addSchemaRequirements()` is removed from `port_to_docs.js` and its
  content appears in the two pages. `downsampler.md`'s "Schema management"
  section turned out to already be README-derived, not script-injected: the
  config check that would have fired the downsampler branch of
  `addSchemaRequirements()` tested `additional_sections.includes('schema_requirements')`,
  but `docs_mapping.yaml` listed `schema_management` for that plugin, so the
  branch never ran. Verified by diffing the upstream README against the page;
  the section is byte-identical (`—` vs. `:` list punctuation aside). Only
  `basic-transformation.md` needed a real hand-owned-region migration;
  `downsampler.md` needed no content change, just markers, deferred to the
  first real sync run.
- [x] A page with an unterminated marker fails that plugin and reports it,
  rather than corrupting the file.

**Verification:**

- [x] Tests pass: `node --test helper-scripts/influxdb3-plugins/test/*.test.js`
- [x] Build succeeds: `npx hugo --quiet`
- [x] Manual check, revised: a real regen of all 11 pages (run once, ad hoc, to
  observe behavior) showed marker insertion plus substantial unrelated content
  drift on most pages — expected, since `sync-plugins.yml` has never completed
  a run and the upstream READMEs have moved on (flag renames like `--path` to
  `--plugin-filename`, a `_internal` database note, trimmed sections). That
  drift is real and out of scope for this task: reconciling 11 pages to
  current upstream content is the eventual first real scheduled-sync run's
  job, not the writer's. Reverted that regen and instead hand-authored the
  minimal, scoped diff on `basic-transformation.md` only (markers + relocated
  schema section) and read it directly — matches expectations, nothing else
  changed. `downsampler.md` was left untouched.

**Dependencies:** Task 2.

**Files likely touched:**

- `helper-scripts/influxdb3-plugins/port_to_docs.js`
- `helper-scripts/influxdb3-plugins/docs_mapping.yaml` (dropped the
  `additional_sections` keys tied to the removed function)
- `content/shared/influxdb3-plugins/plugins-library/official/basic-transformation.md`
- `helper-scripts/influxdb3-plugins/test/region-writer.test.js`

**Estimated scope:** Medium.

#### Task 5: Scaffold product stubs for new plugins

**Description:** When a plugin has no Core or Enterprise stub, create one from
a template carrying the conventions the existing 22 stubs follow. Never rewrite
an existing stub.

**Acceptance criteria:**

- [x] A new plugin produces stubs at
  `content/influxdb3/{core,enterprise}/plugins/library/official/<slug>.md`
  with `title`, `description`, `menu`, `weight: 100`, product-namespaced
  tags, `related`, `source`, and `canonical: self`. The filename and `source:`
  target use `stubSlug`; `source:` and the `//SOURCE` comment use `slug` (the
  shared-page slug), matching the existing `mad-anomaly-detection.md` /
  `mad-check.md` split. Baseline tags for a scaffolded stub are `[plugins,
  processing engine, python, official]`, matching `_index.md`'s convention —
  editorial tags beyond that aren't derivable from the registry and stay a
  human decision, same as the existing hand-authored stubs.
- [x] An existing stub is left byte-identical: `scaffoldStub` checks `exists`
  before rendering and returns `{ skipped: true }` with no content, so
  `port_to_docs.js` never opens the file for writing. Confirmed against real
  data: a `yarn sync-plugins:dry-run` run reported 22 stubs already present
  (11 mapped plugins × 2 products) and 0 rewrites.
- [x] Generated stubs render: verified with a throwaway fixture plugin (one
  shared page + two scaffolded stubs, not committed) — `npx hugo --quiet`
  built cleanly and the rendered Core and Enterprise pages showed the
  resolved shared body and appeared under `Official plugins` in both nav
  trees. Fixture files were deleted after the check; `git status` confirmed
  no residue.

**Verification:**

- [x] Tests pass: `node --test helper-scripts/influxdb3-plugins/test/*.test.js`
  (21/21, including 5 new `stub-template.js` tests: core rendering, enterprise
  rendering, `stubSlug`-keyed path, scaffold-when-missing, skip-when-present).
- [x] Build succeeds: `npx hugo --quiet`
- [x] Manual check: performed via the throwaway fixture above rather than a
  live `npx hugo server` session, since running the scaffolder against the
  real registry's 24 unmapped plugins would write stubs whose `source:` shared
  pages don't exist yet (Task 10/11's job) — `readFile .Params.source` fails
  the build for a missing target, so a full real-data scaffold run belongs in
  the backfill, not here.

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

- [x] The script writes a markdown table to `GITHUB_STEP_SUMMARY` listing each
  plugin and its status. One row per plugin, not per artifact: `processPlugin`
  and `scaffoldMissingStubs` each append a `{ plugin, status, detail }` entry,
  and `collapseByPlugin` reduces them to the worst status per plugin. The
  detail column describes only the artifacts that produced the reported
  status, so an `error` row explains the error rather than also listing the
  files that were fine.
- [x] `needs_attention` is set when any plugin is skipped or a page is
  reported as newly scaffolded. `removed` also sets it, per the decision
  below.
- [x] A skipped plugin does not fail the run; a malformed region or unwritable
  target does. Verified end to end: a plugin with a missing source README
  exits 0 with a `skipped` row, and a page with an unterminated region marker
  exits 1 with the hand-owned text left byte-identical on disk.
- [x] Multi-line outputs use a random heredoc delimiter
  (`EOF_` plus 8 random bytes, a fresh one per call).

Two decisions settled while implementing:

- **Drift is in scope for this task.** `detectRemovedPlugins` reports a shared
  page whose plugin is no longer in the registry index. It matches on `slug`
  (the shared-page name), not `stubSlug`, and ignores `_index.md`, `CLAUDE.md`,
  and `README.md`, which otherwise appear as phantom removals on every run.
  Removals are reported, never deleted, per ADR 0004.
- **The discovery failure modes are split.** A registry fetch failure is a
  `skipped` row and exits 0, because a flaky network must not fail a nightly.
  A write failure to the data file or a stub is an `error` row and exits 1,
  because a sync that reports success while publishing nothing is the exact
  failure this rebuild exists to end. Previously both were a `console.warn`
  and exit 0.

**Verification:**

- [x] Tests pass: `yarn test:sync-plugins` (46/46, including 19 new
  `reporting.js` tests and 6 new `processPlugin` result tests).
  `node --test helper-scripts/influxdb3-plugins/test/` does not work — Node
  resolves a bare directory as a module — so a `test:sync-plugins` script was
  added using the quoted-glob form the repo already uses for
  `test:lint-codeblocks`.
- [x] Manual check: ran the CLI against fixture configs for both cases. A
  missing source README produced `| ghost_plugin | skipped | ... |`,
  `needs_attention=true`, and exit 0. A malformed generated region produced an
  `error` row, exit 1, and left the page untouched.
- [x] Real-data check: `yarn sync-plugins:dry-run` reported 35 rows (24
  scaffolded, 11 skipped for the absent local upstream checkout) and zero
  `removed` rows, confirming all 11 existing shared pages still match a
  registry slug.

**Note for Task 7:** `processPlugin` no longer prints per-plugin progress. That
output duplicated the summary table, and it also corrupted the Node test
runner's stdout IPC under parallel workers — measured at 14 failures in 15 runs
with the logging and 0 in 15 without, on otherwise identical code. The workflow
should read the step summary, not scrape stdout.

**Dependencies:** Tasks 2, 4, 5.

**Files touched:**

- `helper-scripts/influxdb3-plugins/reporting.js` (new)
- `helper-scripts/influxdb3-plugins/port_to_docs.js`
- `helper-scripts/influxdb3-plugins/test/reporting.test.js` (new)
- `helper-scripts/influxdb3-plugins/test/sync-results.test.js` (new)
- `package.json`

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

- [x] The only trigger is `workflow_dispatch`; its input accepts a plugin list
  or `all`. The cron is added in Task 12, after the backfill, so the
  schedule never runs against a knowingly incomplete library.
- [x] The upstream checkout is tokenless, sparse on `influxdata/` and
  `scripts/`, at `main`. `PLUGINS_CONTENT_READ_TOKEN` is gone;
  `influxdata/influxdb3_plugins` is public and needs no secret. That secret is
  now referenced by no workflow in the repository.
- [x] `node-version-file: docs-v2/.nvmrc` — the path bug that broke the last
  run is fixed.
- [x] A `concurrency` group prevents a dispatch racing the cron
  (`group: sync-plugins`, `cancel-in-progress: false`).
- [x] `persist-credentials: false` on the upstream checkout, and on the
  docs-v2 checkout too — `create-pull-request` pushes with its own token, so
  neither checkout needs persisted credentials, and zizmor flags the omission.
- [x] The generator runs, then the job exits early when the tree is clean.
  A `changes` step gates both the body composition and the pull request.
- [x] `peter-evans/create-pull-request` targets the fixed branch
  `sync/influxdb3-plugins` with labels `source:sync` and
  `product:v3-monolith`, and a PR body composed from generator output
  passed through `env:`, not interpolated into shell. `SUMMARY` and
  `NEEDS_ATTENTION` reach the script only as environment variables, and the
  static prose uses quoted heredocs so backticks stay literal.
- [x] All actions are SHA-pinned with version comments.

Two changes beyond the workflow file:

- **The generator accepts a plugin list in one run.** The old workflow looped
  `node port_to_docs.js --plugin X` once per name. Each run appends `summary`
  and `needs_attention` to `$GITHUB_OUTPUT`, so a loop left only the last
  plugin's outcome visible and silently dropped earlier skips. `selectPlugins`
  now resolves `all`, a single name, or a comma-separated list, and unknown
  names fail the run by name instead of syncing nothing.
- **README validation is informational.** `validate_readme.py` previously
  gated the whole transform, so one bad README blocked all plugins. The
  generator reports an unusable README as a per-plugin `skipped` row, which is
  the behavior the risk table calls for, so the step is now
  `continue-on-error: true` and gates nothing. The `scripts/` sparse checkout
  stays, because that is where the validator lives.

**Verification:**

- [x] `actionlint` and `zizmor` report no errors. Both clean; zizmor reports
  "No findings" with 5 suppressed.
- [x] Tests pass: `yarn test:sync-plugins` (50/50, including 4 new
  `selectPlugins` tests).
- [x] The PR body script was executed directly with representative
  `SUMMARY` and `NEEDS_ATTENTION` values and its markdown inspected. Heredoc
  bodies render at column 0, so no line is accidentally indented into a code
  block.
- [ ] Manual check: `gh workflow run` against a test branch produces a pull
  request with the expected diff. Not run — `workflow_dispatch` needs the
  workflow on a pushed branch, and a real run opens a real pull request.
  Blocked on a human.

**On the pull request token:** no additional secret is needed. The workflow
uses the default `GITHUB_TOKEN`, like the two existing sync workflows, and the
job-level `permissions` block grants everything `create-pull-request` needs:
`contents: write` to push the `sync/influxdb3-plugins` branch and
`pull-requests: write` to open or update the pull request and apply its labels.
Labels need no `issues: write` — verified against pull request #7699, which the
same setup labeled `source:sync` and `product:v2`. Repository settings already
permit this: `default_workflow_permissions` is `write` and
`can_approve_pull_request_reviews` is true.

The one real consequence for the Phase 2 checkpoint: on a *scheduled* run, docs
CI is created but does not execute. Runs on `sync/openapi-oss-v2-spec` from the
2026-08-31 cron sit at `conclusion: action_required`, waiting for a human to
approve them, while the runs from human-dispatched or human-pushed commits on
the same branch completed normally. So "Docs CI runs on the generated pull
request" holds for `workflow_dispatch` and needs one "Approve and run" click
per scheduled pull request. A PAT would remove that click; it is not required
for the sync itself, and Task 12 is where the choice matters, since that is
when the cron lands.

**Bug found while writing Task 8 and fixed here:** the workflow always passes
`--plugin`, defaulting to `all`, but the discovery block was guarded by
`if (!options.plugin)`. A default CI run therefore skipped registry discovery,
`data/influxdb3_plugins.yml`, stub scaffolding, and removal detection, and
transformed only the 11 mapped READMEs. `selectPlugins` already treated `all`
as a full run; the guard did not. Replaced with an exported
`shouldRunDiscovery()` so both readings of the argument live next to each
other, covered by two tests, and confirmed with
`node port_to_docs.js --plugin all --dry-run` now reporting 35 discovered
plugins and 24 scaffolds.

**Dependencies:** Tasks 1, 6.

**Files touched:**

- `.github/workflows/sync-plugins.yml`
- `helper-scripts/influxdb3-plugins/port_to_docs.js`
- `helper-scripts/influxdb3-plugins/test/sync-results.test.js`

**Estimated scope:** Medium.

#### Task 8: Update the pipeline documentation

**Description:** Rewrite `helper-scripts/influxdb3-plugins/README.md`, which
currently documents the issue-form path as recommended, claims "No cross-repo
secrets" while the workflow used a PAT, promises screenshots that are disabled,
names the pre-migration `sync-plugin-docs` label, and prescribes a manual
workflow under "Phase 5: Manual Workflow (Until Automation is Ready)". Update
the generated-directory `CLAUDE.md` for the region model.

**Acceptance criteria:**

- [x] The README describes the scheduled pull, the three-way ownership split,
  and how to add a hand-owned region. Rewritten around the pipeline as it
  actually runs: discovery, ownership, statuses, configuration, local and CI
  operation. The embedded Python listings of a `port_to_docs.py` that no
  longer exists, the "Phase 1-5" structure, the screenshot claims, and the
  issue-form path are gone. The Terminology section is kept verbatim; ADR 0004
  and `PLAN.md` link to its anchor.
- [x] Every claim in it is true of the workflow as landed. Writing this is what
  surfaced the `--plugin all` discovery bug recorded under Task 7: the README
  draft claimed a full run writes the data file, and the code did not.
- [x] `content/shared/influxdb3-plugins/plugins-library/official/CLAUDE.md`
  distinguishes generated regions from hand-owned regions. Also dropped its
  per-file source table, which listed 11 of 35 plugins and would need an edit
  on every backfill batch; the filename rule and the `mad_check` exception
  replace it.

**Verification:**

- [x] Manual check: every file path, label, and command named in the README
  exists. Verified the four `yarn` scripts in `package.json`, the six modules
  in this directory, the ADR path, the marker constants against
  `port_to_docs.js`, and the markers present in `basic-transformation.md`. No
  reference to the deleted issue form remains on this branch.

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
- The sync covers only plugins published to the registry index, not every
  in-tree plugin. A plugin merged but not yet released does not gain a page
  until it is published. `index.json` at 34 unique names matches the
  in-tree `influxdata/` count, is already scoped to official plugins with no
  contributor-directory filtering needed, and its fields (`version`,
  `description`, `triggers`, `dependencies`) map directly onto Task 3's data
  file, so it replaces the `manifest.toml` scan as the discovery source.

## Deferred

Does not block this plan. Revisit after the schedule is running.
