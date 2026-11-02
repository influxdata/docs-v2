# CI consolidation plan for docs-v2

Ephemeral plan.
`block-ephemeral-docs.yml` blocks `PLAN.md` on `master`, so remove it before
this branch merges.

Branch: `claude/great-ramanujan-t7p7t2`, based on `master` at `e80ae76`.

This plan replaces three sources:

- The CI optimization analysis of 2026-11-01 (1,000 `pull_request` runs,
  2026-10-26 to 2026-11-01). Its recommendations keep their letters A–I.
- `PLAN.md` on `claude/hugo-dependency-management-h7v86e` (dependency and
  install-surface hardening). Its parts keep their numbers 1–4.
- `HANDOVER.md` on this branch (broken `prepare-release.yml`).

## Branch and PR inventory

Checked on 2026-11-02.
All PR check runs on the current heads are green.
No pair of branches has a textual merge conflict, on its own or on top of
`master`.

| Item | State | Recommendation |
|---|---|---|
| [influxdata/docs-v2#7897](https://github.com/influxdata/docs-v2/pull/7897) sample data and distributed limits | Mergeable. 35 commits behind `master`. Approved on `1af50de`; the head is now `931232a`. | **Merge first.** Re-request approval if the ruleset dismisses stale reviews. |
| [influxdata/docs-v2#7903](https://github.com/influxdata/docs-v2/pull/7903) prose linter beside Vale | Blocked on review. No reviews. 6 behind. | **Merge second**, after review. |
| [influxdata/docs-v2#7916](https://github.com/influxdata/docs-v2/pull/7916) remove Vale | Stacked on #7903 (base `chore/prose-lint`). | **Merge third.** Retarget to `master` after #7903 merges, then merge `master`. |
| [influxdata/docs-v2#7898](https://github.com/influxdata/docs-v2/pull/7898) Playwright trial | Blocked on review. 143 behind. | **Merge last, after #7897.** See "Playwright trial" below. |
| `claude/hugo-dependency-management-h7v86e` | Code cherry-picked to this branch (`016f63f`, `f931d31`). Plan merged into this file. | **Delete the branch.** It carries ~10,700 commits of pre-rewrite history that `master` doesn't have. Never merge it. |
| `ccr-ed7ae69a-bs2fua` link checker | Not in docs-v2. This session can't read `docs-tooling` or `link-checker`. | **Find it.** It probably belongs with recommendation G. |
| This branch | Converter hardening (Part 1a, 1c, 1e) and this plan. | Becomes the Phase 1 PR after `PLAN.md` is removed. |

### Interactions between the PRs

- **#7897 and #7898 both touch custom timestamps.**
  #7897 changes how `assets/js/custom-timestamps.js` anchors dates.
  #7898 adds `playwright/e2e/custom-timestamps.spec.js`, which its PR body
  doesn't mention.
  Merge #7897 first, then merge `master` into #7898 and rerun its spec.
- **#7898 changes `yarn.lock` from a base 143 commits old.**
  `merge-tree` reports no conflict, but regenerate the lockfile with
  `yarn install` after merging `master` instead of trusting the merge.
- **#7916 deletes `check-pinned-deps.yml`.**
  Part 2 below used it as the template for the audit workflow.
  Use `pr-lockfile-lint.yml` instead.
- **New workflows add install cost.**
  #7903 adds Prose Lint with an inline `setup-node` and `yarn install`.
  #7897 adds Content Data through `setup-docs-env`.
  #7898 adds a job that runs an uncached `npx playwright install --with-deps chromium`.
  #7916 removes Vale, which cost 13 s.
  Phase 1 (B) moves all of them onto the cached setup action.

### Playwright trial (#7898)

The two-week trial described in the PR hasn't started, because the PR never
merged.
Running it adds a second Hugo server and a browser install to every PR that
touches `layouts/` or `assets/`, which works against A.
Merge it only if you still want to replace Cypress.
The case for it: Cypress can't run in cloud agent sessions, and Playwright can.
If you merge it, start the trial clock at the merge date and update the PR body
to list the custom-timestamps spec.

## Baseline (from the CI analysis)

- Queue wait is 3 s median. Runners aren't the problem.
- The median commit finishes all PR workflows in about 6 minutes.
- Hugo builds the same site 4–5 times per commit: `preview` 90 s,
  `ai-artifacts` 78 s, `render-check` 70 s, `link-check` 60 s,
  `feedback-links` 57 s.
- PR Preview is the critical path on 67% of commits. Its S3 deploy (93 s
  median, 231 s p90) costs as much as its build.
- `yarn install` costs 16–30 s on a cache hit. Small check jobs spend 30 s
  installing to run a 1 s script.
- Link check fails 24% of runs. Every sampled failure was a deliberate forward
  reference.
- About 253 runner-minutes a day.
- Only `check-artifacts` and `Lint code blocks` are required checks.

The analysis scripts (`pull_runs.sh`, `pull_jobs.sh`, `analyze.py`,
`analyze2.py`) live in another session's scratchpad, not in the repository.
Each phase's acceptance test depends on rerunning them, so commit them in
Phase 1.

## Phase 0: merge the ready PRs

1. Merge #7897.
2. Review and merge #7903.
3. Retarget #7916 to `master`, merge `master` into it, and merge it.
4. Decide on #7898. If you keep it, merge `master` into it, regenerate
   `yarn.lock`, rerun CI, and merge.
5. Delete `claude/hugo-dependency-management-h7v86e` and the merged PR branches.
6. Rerun the analysis to record a new baseline. The workflow set changes:
   Vale goes away, and Prose Lint, Content Data, and possibly Playwright arrive.

## Phase 1: install surface and quick wins

One PR from this branch, plus small follow-ups.

### 1.1 Converter provenance and skip gate (done on this branch)

- **Part 1a.** `scripts/rust-markdown-converter/checksums.txt` is committed.
  `scripts/build-rust-converter.js` verifies the prebuilt binary against it
  instead of against a checksum file downloaded from the same release.
  `scripts/update-converter-checksums.js` refreshes it, and
  `release-rust-markdown-converter.yml` opens a PR after each release.
- **Part 1c, partial.** `DOCS_SKIP_MARKDOWN_CONVERTER=true` makes
  `build-rust-converter.js` exit before any download or `require()`.
  `setup-docs-env` exposes it as the `skip-markdown-converter` input.
  Both `setup-docs-env` call sites in `pr-render-check.yml` set it.
- **Part 1e.** `.yarnrc.yml` and `.yarn/install-state.gz` are untracked. They
  did nothing under Yarn Classic.
- Deleted the unreferenced `assets/js/jquery-3.5.0.min.js`.

Only `pr-ai-artifacts-check.yml` needs the converter.
It's the only workflow that runs `yarn build:md` or `yarn build:ai-artifacts`.

### 1.2 Cache `node_modules` and route every install through `setup-docs-env` (B, with Part 1c)

B and Part 1c edit the same thing.
Moving every inline `yarn install` onto `setup-docs-env` gives each one the
cache and the converter skip in one change.

In `.github/actions/setup-docs-env/action.yml`:

- Add `actions/cache` (pinned by SHA) for `node_modules`, keyed on
  `hashFiles('yarn.lock', '.nvmrc')`, with `restore-keys` so PR branches
  reuse an earlier cache.
- Skip `yarn install` on a cache hit.
- **On a cache hit, `postinstall` doesn't run.**
  The CI analysis missed this.
  `postinstall` runs `scripts/setup-local-bin.js` and
  `scripts/build-rust-converter.js`, and the converter writes to
  `scripts/rust-markdown-converter/`, outside `node_modules`.
  Either run both scripts explicitly after a cache hit, or add the converter
  output files to the cache paths.
  Check what `setup-local-bin.js` writes before you choose.
- Set `PUPPETEER_SKIP_DOWNLOAD=1`. No workflow uses Puppeteer's Chrome.
- If #7898 merged, cache `~/.cache/ms-playwright` keyed on the Playwright version.

Move these inline installs to `setup-docs-env`, and set
`skip-markdown-converter: 'true'` on each one:

- `pr-feedback-links.yml`
- `pr-link-check.yml`
- `pr-release-check.yml` (two jobs; see 1.3)
- `pr-prose-lint.yml` (after #7903)
- `test.yml` (two jobs)
- `audit-documentation.yml` (three jobs)
- `sync-openapi-oss-v2-spec.yml`
- `sync-openapi-cloud-v2-spec.yml`
- `sync-plugins.yml`
- `influxdb3-release.yml`

Before you edit each one, grep it for `build:md`, `build:ai-artifacts`, and
`RUST_MARKDOWN_CONVERTER`.
`pr-preview.yml` has its own converter prefetch-and-verify step, although
nothing downstream calls `build:md`.
Leave it alone until `git log -p` explains why it's there.

Leave `release-rust-markdown-converter.yml` on its own install. It builds the
converter.

The move also unifies the `setup-node` pin. On `master`, `setup-docs-env`
pins v6.3.0 and the inline steps pin v7.x. This branch moves
`setup-docs-env` to v7.0.0.

### 1.3 Small jobs that install everything (C, I)

- Merge the two `pr-release-check.yml` jobs into one. Both check out full
  history and install the same tree to run scripts that take 0 s.
- `auto-label`: replace `npm install js-yaml` (28 s) with the cached tree or
  with preinstalled Python PyYAML.
- `auto-label` and `doc-review`: gate `check-existing-success` with
  `if: github.run_attempt > 1`.
- `Lint code blocks` and `Agent Instructions`: no change beyond 1.2. Measure
  them afterward.

### 1.4 Decide what to do with `prepare-release.yml`

From the handover.
The workflow has never worked:

- Its last step requires `.github/scripts/release-checklist.js`, which doesn't
  exist.
- It fails before that step:
  `helper-scripts/common/update-product-version.sh` runs
  `find compose-examples/` under `set -e`, and that directory doesn't exist.
- It never commits or pushes, so its edits are lost.
- It has no `permissions:` block for `issues: write`.
- For the cloud products it writes `influxdb3_cloud-serverless.latest_patch`.
  The real key is `influxdb3_cloud_serverless`, and only Core, Enterprise, and
  Explorer have a top-level `latest_patch`.

`influxdb3-release.yml` already generates release notes, runs a CLI audit,
and opens a draft PR with a checklist for Core and Enterprise.
Recent releases bumped `latest_patch` by hand (`a75dd63`, `62c9b77`).

Recommendation: delete `prepare-release.yml` and `update-product-version.sh`
(update both `helper-scripts` READMEs), and replace "Version updates" in the
`influxdb3-release.yml` PR checklist with specific items:

- Bump `latest_patch` in `data/products.yml`.
- Add release notes to
  `content/shared/v3-core-enterprise-release-notes/_index.md`.
- Confirm the downloads at `dl.influxdata.com` are live.

Before you delete it, answer these:

1. Does anyone use `prepare-release.yml` or its `release_type` input?
2. Has `influxdb3-release.yml` ever run with `dry_run: false`? Check the
   Actions history.
3. Where do `latest_quay_tag` and the "Quay tag check" job come from?
   Neither exists on `master` or in any open PR.
   Add the Quay checklist item only once they exist.
4. Do Cloud Serverless, Cloud Dedicated, and Clustered need a checklist?

### 1.5 Commit the analysis scripts

Add the four analysis scripts under `scripts/ci/analysis/` so every phase
can measure its result.

## Phase 2: clones and Hugo cache

- **E. Blobless clones.** Add `filter: blob:none` to the nine workflows that
  use `fetch-depth: 0`. Saves about 5 s per job. Before you roll it out,
  confirm Hugo's `lastmod` output doesn't change on one build.
- **F. Cache `resources/_gen`.** Measure one build with and without the
  cache. Keep it only if it saves more than 10 s.

## Phase 3: build once and fan out

- **A. One build, many consumers.** Add a `build` job that uploads `public/`,
  then run `render-check`, `link-check`, `ai-artifacts`, `feedback-links`,
  `preview-deploy`, and the Playwright job (if #7898 merged) as `needs: build`
  jobs.
  - The builds differ in `baseURL` and environment. Start with two builds
    (preview and production) instead of one.
  - Moving `check-artifacts` changes required-check names. Update the
    ruleset and the `merge_group` trigger in the same change.
  - Measure artifact transfer time. If it's too slow, run the checks as steps
    in the build job instead.
- **D. Shorten the S3 deploy.** Serve `static/img` (61 MB) and
  `static/downloads` (19 MB) from a shared prefix, and try
  `s3deploy -workers 32`. This needs an S3 and CloudFront change.
  Replace doc-review's `Wait for preview deployment` polling (84 s median)
  with a `needs:` edge or `workflow_run`.
- **H. Test the skip logic.** Add a fixture test for each change detector:
  `detect-test-products.js`, `detect-preview-pages.js`, and the detect steps
  in `pr-render-check` and `pr-link-check`.
  Move the link-check detector from the `/pulls/{n}/files` API, which caps at
  30 files, to `git diff base...head`.
  This failure mode already exists: on #7903, the required
  `Lint code blocks` check reported **skipped**, which branch protection
  treats as passing.

## Phase 4: independent work

- **G. Pending links.** 24% of link-check runs fail on forward references.
  Add a `pending-link` convention that `link-check-classify.js` downgrades to
  a warning.
  The link-checker branch `ccr-ed7ae69a-bs2fua` probably belongs here.
- **Part 2. Monthly dependency audit.** Add
  `.github/workflows/dependency-audit.yml` and
  `scripts/ci/dependency-report.mjs`. Report only, never bump. Use
  `pr-lockfile-lint.yml` as the template, because #7916 deletes
  `check-pinned-deps.yml`. Report sections:
  1. Shipped versus build-only packages, derived from the import graph of
     `assets/js/main.js` and `assets/js/diagram-renderer.js`. Expected shipped
     set: `jquery`, `mermaid`, `vanillajs-datepicker`.
  2. `osv-scanner` across all five `yarn.lock` files,
     `scripts/rust-markdown-converter/Cargo.lock`, and
     `test/pytest/requirements.txt`.
  3. Unused dependencies (`knip`). Ignore packages Hugo reads through the
     asset mount, such as `lucide-static`.
  4. Duplicate packages (`yarn-deduplicate --list`, version pinned).
  5. `resolutions` entries that no longer change the resolved tree.
  6. External scripts in `layouts/` and `assets/js/`, diffed against a
     committed baseline.
  7. A regression check that `jquery-3.5.0.min.js` stays deleted.

  Update one long-lived issue using the marker pattern from
  `.github/scripts/link-check-comment.js`.
  Then drop or reduce the pre-push `yarn audit` hook in `lefthook.yml`.
- **Part 3. Dependabot version updates for npm, Cargo, and pip.** Proposal
  only. `AGENTS.md` requires security-team sign-off. Add one `directory` entry
  per lockfile. Group everything except the three shipped packages into one
  monthly PR.
- **Part 4. jQuery removal analysis.** Analysis and an issue only, no code.
  This is code health, not security: jQuery 3.7.1 is current. 15 modules
  import it. Resolve this blocker first: `layouts/404.html` runs `$(...)`
  inline and depends on the deferred bundle having set `window.$`.
  Re-verify the inventory before you write the analysis.
- **Part 1b. CircleCI credentials (needs a person).** Check whether the AWS
  deploy credentials are project-level variables or a context restricted to
  the `deploy` job. If they're project-level, the `build` job runs every
  package's `postinstall` with access to production credentials. Moving them
  into a `deploy`-only context is the highest-value security change in this
  plan. Record the answer in `DOCS-DEPLOYING.md`.

## Decisions already made

- **Don't migrate to Yarn Berry.** It replaces only `yarn-deduplicate`. All
  lockfile entries already carry `integrity` hashes. PnP breaks
  `hugo-extended`'s binary download. The environment-variable gate in Part 1c
  gives most of the benefit of Berry's script allowlist.
- **Don't use `--ignore-scripts`.** Yarn 1 applies it to every package, which
  disables `hugo-extended`'s `postinstall` and breaks `npx hugo`.
- **Don't change runners for queue time.** Queue wait is 3 s. Measure larger
  runners only for the Hugo build, after A.
- **Don't exclude products from PR builds.** Shared content renders into many
  products.
- **Don't let required checks skip on content-only PRs.** A skipped required
  check reads as passing.

## Expected result after Phase 3

| Metric | Baseline | Target |
|---|---|---|
| Hugo builds per content commit | 4–5 | 1–2 |
| Runner-minutes per day | ~253 | ~110–130 |
| Preview URL available, median | ~4.2 min | ~2.5 min with D, ~3.5 min without |
| Required checks green, median | ~2.1 min | ~1.2 min |
| Setup time per Node job | 30–45 s | 10–15 s |

## Open questions

1. Where is `ccr-ed7ae69a-bs2fua`, and what does it contain?
2. Do you still want the Playwright trial (#7898)?
3. The `prepare-release.yml` questions in 1.4.
4. Who can answer Part 1b in CircleCI?
5. Why does `pr-preview.yml` prefetch the converter?
