# CI consolidation plan for docs-v2

Ephemeral plan.
`block-ephemeral-docs.yml` blocks `PLAN.md` on `master`, so remove it before
this branch merges.

Branch: `claude/great-ramanujan-t7p7t2`, based on `master` at `e80ae76`.

This plan replaces four sources:

- The CI optimization analysis of 2026-11-01 (1,000 `pull_request` runs,
  2026-10-26 to 2026-11-01). Its recommendations keep their letters A–I.
- `PLAN.md` on `claude/hugo-dependency-management-h7v86e` (dependency and
  install-surface hardening). Its parts keep their numbers 1–4.
- `PLAN.md` on `ccr-ed7ae69a-bs2fua` (link-check failures, commit
  `fcec40f`). Its phases appear here as L0–L5.
- `HANDOVER.md` on this branch (broken `prepare-release.yml`).

## Branch and PR inventory

Checked on 2026-11-02.
All PR check runs on the current heads are green.
No pair of branches has a textual merge conflict, on its own or on top of
`master`.

| Item                                                                                                          | State                                                                                          | Recommendation                                                                                                        |
| ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [influxdata/docs-v2#7897](https://github.com/influxdata/docs-v2/pull/7897) sample data and distributed limits | Mergeable. 35 commits behind `master`. Approved on `1af50de`; the head is now `931232a`.       | **Merge first.** Re-request approval if the ruleset dismisses stale reviews.                                          |
| [influxdata/docs-v2#7903](https://github.com/influxdata/docs-v2/pull/7903) prose linter beside Vale           | Blocked on review. No reviews. 6 behind.                                                       | **Merge second**, after review.                                                                                       |
| [influxdata/docs-v2#7916](https://github.com/influxdata/docs-v2/pull/7916) remove Vale                        | Stacked on #7903 (base `chore/prose-lint`).                                                    | **Merge third.** Retarget to `master` after #7903 merges, then merge `master`.                                        |
| [influxdata/docs-v2#7898](https://github.com/influxdata/docs-v2/pull/7898) Playwright trial                   | Blocked on review. 143 behind. Trial approved 2026-11-02.                                      | **Merge last, after #7897.** See "Playwright trial" below.                                                            |
| `claude/hugo-dependency-management-h7v86e`                                                                    | Code cherry-picked to this branch (`016f63f`, `f931d31`). Plan merged into this file.          | **Delete the branch.** It carries \~10,700 commits of pre-rewrite history that `master` doesn't have. Never merge it. |
| `ccr-ed7ae69a-bs2fua` link-check plan                                                                         | One commit on `master` (`e80ae76`) that adds only `PLAN.md`. Merged into this file as L0–L5.   | **Delete the branch.**                                                                                                |
| This branch                                                                                                   | Converter hardening (Part 1a, 1c, 1e), the `prepare-release.yml` removal (1.4), and this plan. | Becomes the Phase 1 PR after `PLAN.md` is removed.                                                                    |

### Interactions between the PRs

- **#7897 and #7898 both touch custom timestamps.**
  \#7897 changes how `assets/js/custom-timestamps.js` anchors dates.
  \#7898 adds `playwright/e2e/custom-timestamps.spec.js`, which its PR body
  doesn't mention.
  Merge #7897 first, then merge `master` into #7898 and rerun its spec.
- **#7898 changes `yarn.lock` from a base 143 commits old.**
  `merge-tree` reports no conflict, but regenerate the lockfile with
  `yarn install` after merging `master` instead of trusting the merge.
- **#7916 deletes `check-pinned-deps.yml`.**
  Part 2 below used it as the template for the audit workflow.
  Use `pr-lockfile-lint.yml` instead.
- **New workflows add install cost.**
  \#7903 adds Prose Lint with an inline `setup-node` and `yarn install`.
  \#7897 adds Content Data through `setup-docs-env`.
  \#7898 adds a job that runs an uncached `npx playwright install --with-deps chromium`.
  \#7916 removes Vale, which cost 13 s.
  Phase 1 (B) moves all of them onto the cached setup action.

### Playwright trial (#7898)

Decided: run the trial.
The two-week trial described in the PR hasn't started, because the PR never
merged, so start the clock at the merge date.
Before merging, update the PR body to list the custom-timestamps spec.

Cost: the trial adds a second Hugo server and a browser install to every PR
that touches `layouts/` or `assets/`.
Phase 1 (1.2) caches the browser.
If Playwright replaces Cypress, A drops the Cypress job and the Playwright job
reads the shared build.

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
- Link check fails 24% of runs (20 of 85). The analysis attributes every
  sampled failure to a deliberate forward reference. The link-check plan
  questions that: `production.lycherc.toml` sets `include_fragments = false`,
  so an internal anchor alone shouldn't fail. L0 settles it.
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
4. Merge `master` into #7898, regenerate `yarn.lock`, rerun CI, and merge.
   Start the two-week trial.
5. Delete `claude/hugo-dependency-management-h7v86e`, `ccr-ed7ae69a-bs2fua`,
   and the merged PR branches.
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
- Cache `~/.cache/ms-playwright` keyed on the Playwright version (#7898).

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
- `influxdb3-release.yml`, unless 1.4 deletes it

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

### 1.4 Remove `prepare-release.yml` (done on this branch)

The workflow never ran (its Actions page has no runs), and nobody uses it or
its `release_type` input.
It couldn't have worked:

- Its last step required `.github/scripts/release-checklist.js`, which
  doesn't exist.
- It failed before that step:
  `helper-scripts/common/update-product-version.sh` runs
  `find compose-examples/` under `set -e`, and that directory doesn't exist.
- It never committed or pushed, so its edits would have been lost.
- It had no `permissions:` block for `issues: write`.

Done: deleted `prepare-release.yml` and `update-product-version.sh`, and
updated both `helper-scripts` READMEs.

Decided:

- Only Core and Enterprise need a release checklist. Cloud Serverless, Cloud
  Dedicated, and Clustered don't.
- Leave out the Quay item. Nobody knows where `latest_quay_tag` or a "Quay tag
  check" job came from, and neither exists.

Still open: where the Core and Enterprise checklist lives.
`influxdb3-release.yml` has never run either, and its release-notes step is a
placeholder: the `npx docs release-notes` call is commented out.
Releases happen through hand-made PRs that bump `latest_patch`
(`a75dd63`, `62c9b77`).

Recommendation: add the checklist to the sticky comment that
`pr-release-check.yml` already posts on those PRs, because it runs on every
change to `data/products.yml` or the release notes.
For a Core or Enterprise `latest_patch` bump, the comment lists:

- [ ] `latest_patch` bumped for both `influxdb3_core` and `influxdb3_enterprise`.
- [ ] Release notes added to
  `content/shared/v3-core-enterprise-release-notes/_index.md`.
- [ ] Downloads live at `dl.influxdata.com`.

Then decide whether to delete `influxdb3-release.yml` and
`trigger-on-release.yml`, which exists only to start it.
Check `trigger-on-release.yml`'s run history first: an external release
pipeline may send it `repository_dispatch` events.

### 1.5 Fix the link check's 30-file silent skip (L1, part of H)

`pr-link-check.yml` lists changed files with the unpaginated
`/pulls/{n}/files` API, which returns at most 30.
Content files after the 30th aren't checked, and the job still passes.
Replace the call with `git diff --name-only base.sha...head.sha`, which the
same workflow already uses for `data/products.yml`.
This is a correctness bug, so it ships in Phase 1 instead of waiting for H.
Acceptance: a PR that touches more than 30 files maps every changed content
file.

### 1.6 Keep deploy credentials away from dependency code (Part 1b)

**Decision, 2026-11-03: use GitHub Actions for build, checks, and deployment.**
Keep GitHub-hosted standard runners for now.
Reconsider CircleCI if GitHub performance and uptime become unsatisfactory
and CircleCI fully supports the GitHub workflow syntax this repository uses
outside Preview.
A future CircleCI trial must also verify credential isolation;
workflow syntax compatibility alone does not establish equivalent permissions.

#### Evidence that changes the original CircleCI proposal

CircleCI production still uses permanent project-level AWS keys.
Its production build runs dependency installation and Hugo before deployment.
The proposed `docs-deploy` context does not isolate AWS role access from that build:

- [Job 27034](https://circleci.com/gh/influxdata/docs-v2/27034) confirmed that
  AWS rejects a V3 token from a non-`master` branch.
- [Job 27037](https://circleci.com/gh/influxdata/docs-v2/27037) confirmed that
  a job without a context receives all three OIDC token versions, including V3.
  This disproves the assumption that only `deploy` receives a token.
- The existing trust policy checks the organization, project, repository,
  checkout ref, and config ref.
  It does not distinguish `build` from `deploy` on `master`.
- `docs-deploy` contains the new Slack webhook.
  Security groups remain `All members`; project restrictions require an administrator.
  Context restrictions do not repair the AWS boundary demonstrated by the test.

The console-created CircleCI role is
`arn:aws:iam::056065491910:role/circleci-docs-v2-deploy`.
The branch's CircleCI OIDC deployment changes are superseded by this decision.
Do not merge them as the final deployment design.

PR Preview has the same dependency-exposure problem on GitHub:
its `preview` job grants `id-token: write` before dependency installation.
Temporary credentials alone do not meet this section's goal.

#### GitHub build and deploy boundary

Use separate jobs on fresh GitHub-hosted runners:

1. **Build and validate.**
   Grant read-only repository access and no OIDC permission.
   Install dependencies, run the complete production build, and preserve the
   existing page-count, sitemap, Markdown-coherence, archive, and manifest checks.
   Upload the deployable archive as an artifact.
   Reuse `build-docs-site` where applicable without dropping production build steps.
2. **Deploy the artifact.**
   Depend on the successful build.
   Download the artifact from that same trusted `master` workflow run.
   Verify it before requesting deployment credentials.
   Grant `id-token: write` only to this job.
   Run the trusted, checksum-verified uploader without dependency installation
   or build scripts.
   Preserve S3 deployment, CloudFront invalidation, and Slack notification behavior.
3. **Apply the same separation to PR Preview.**
   Its build job must not receive `id-token: write`.
   Keep the staging role and resources separate from production.
   Keep fork behavior unchanged.

Use a dedicated GitHub production role and the GitHub OIDC provider.
Do not reuse the staging role or broaden the CircleCI role's trust as a shortcut.
The provider URL is `https://token.actions.githubusercontent.com`;
the audience for `aws-actions/configure-aws-credentials` is `sts.amazonaws.com`.
Use a GitHub `production` environment restricted to `master`.
Scope the role's subject to this repository and environment,
using the actual subject format issued for this repository.
See [GitHub's AWS OIDC setup](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws).

Keep production permissions scoped to the existing resources:

- S3 bucket `docs-prod1-docsbucket-bydtaqrf1y0a`:
  `s3:ListBucket` on the bucket;
  `s3:PutObject`, `s3:PutObjectAcl`, and `s3:DeleteObject` on its objects.
- CloudFront distribution `EOKTCBCMTW666` in account `056065491910`:
  `cloudfront:GetDistribution` and `cloudfront:CreateInvalidation`.

The pinned `s3deploy` v2.11.0 uploader reads
`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN`.
Configure temporary credentials before invoking it.

#### Cutover and acceptance

1. Prepare the GitHub workflow, production role, environment variables, and
   Slack secret before changing live deployment.
   Pin third-party actions by full commit SHA.
   Keep the existing production build and output safety checks.
2. Verify that the build job has no OIDC request capability or production credentials.
   Verify that an unauthorized branch cannot assume the production role.
   Verify that the authorized deploy job reports the expected account and assumed role.
3. During the cutover, disable CircleCI production deployment before allowing
   GitHub production uploads.
   Do not let both systems deploy concurrently.
   Run the first GitHub production deployment from `master` under manual control.
   Confirm the upload, invalidation, live-site checks, and Slack notification.
   An authentication failure stops the job; old keys are not an automatic fallback.
4. After a successful GitHub deployment, enable the intended automatic `master`
   deployment trigger.
   Remove CircleCI's project-level AWS keys and obsolete webhook variable.
   Remove `DocsCircleCIDeployUser`, `DocsCircleCIDeployAccessKey`, and their two
   outputs from `deploy/docs-website.yml`, then update the CloudFormation stack.
   Do not delete stack-managed resources only in the console.
   The template exposes the permanent secret key in a stack output,
   so retire the AWS key itself as well as its CircleCI copies.
5. Update `DOCS-DEPLOYING.md` and retain a durable decision record before removing
   this ephemeral plan for merge.
   Record build duration, queue wait, failure and retry rates, and time to deployment.
   Use those observations when reconsidering CircleCI.

Keep the old production configuration and keys until a controlled cutover can verify
GitHub deployment and provide a deliberate rollback path.
Do not revoke credentials during preparation.

#### Runner placement and future CircleCI review

The SRE cost advice was directed at the private `support-team` repository.
`docs-v2` is public, and its standard GitHub-hosted runner compute is
[free](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
Long link-check and E2E jobs remain candidates for a measured performance trial,
but do not change them to `group: self-hosted` without an approved isolated pool.
SRE [declined public-repository access](https://influxdata.slack.com/archives/C0781297K18/p1792176830150159)
to the existing pool on 2026-10-16.
[Internal discussions](https://influxdata.slack.com/archives/CEPEF2FGX/p1783620991283229)
also describe long-lived GitHub runners.

Self-hosted GitHub runners still depend on GitHub Actions job dispatch.
The [2026-08-06 outage thread](https://influxdata.slack.com/archives/CF8RKRSTE/p1786036205806099)
reports that the company runners could not fetch jobs during an Actions outage.
Moving compute does not remove that availability dependency.

CircleCI's [GitHub Actions workflow support](https://circleci.com/docs/guides/orchestrate/use-a-github-actions-workflow-file-as-your-pipeline-configuration/)
is currently in Preview with a compatibility matrix.
Reconsider it only after the platform conditions above are met.
Before switching, verify artifact transfer, action support, job permissions,
AWS trust, required-check names, and rollback behavior against the actual workflow.
Do not assume a future switch is only a `runs-on` change.

### 1.7 Commit the analysis scripts

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
  `preview-deploy`, and the Playwright job (#7898) as `needs: build`
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
  The link-check detector fix moved to Phase 1 (1.5).
  This failure mode already exists: on #7903, the required
  `Lint code blocks` check reported **skipped**, which branch protection
  treats as passing.

## Phase 4: independent work

### G. Make link-check failures mean something (L0, L2–L5)

Goal: a failing PR link check means the PR added a broken link.
A weekly sweep finds and tracks everything else, and an agent proposes fixes.
The current failures have four possible causes:

- Inherited breakage: the check validates every link on a touched page, not
  only the links the PR changed.
- Forward references to pages or anchors that exist only after a release.
- External URLs that broke since the last PR.
- The 30-file skip, fixed in 1.5.

Reuse what exists:

- `link-check-classify.js` promotes `Cannot find file` to an error and
  downgrades URLs found in open `area:links` issues to warnings.
  A rolling issue that lists every broken URL therefore downgrades all of
  them, with no change to the classifier.
- `fetch-known-link-issues.js`, `link-check-comment.js`, and the
  `broken-link.yml` issue template.
- `weekly-repo-status.md` (gh-aw) as the pattern for an agentic workflow.

Phases:

- **L0. Measure the failure causes.** Sort the errors from the 20 failed runs
  into inherited, introduced by the PR, forward reference, and external.
  Reorder L2–L5 if inherited breakage isn't the largest group.
- **L2. Weekly sweep.** Add `link-sweep.yml` on a weekly schedule (jittered
  minute) and `workflow_dispatch`, with `contents: read` and `issues: write`.
  It builds the site, checks all of `public/` with `production.lycherc.toml`,
  and updates one `Link sweep: broken links` issue labeled `area:links` and
  `automation`.
  - Group the issue body by source file. If it exceeds 65,536 characters,
    list URLs only and attach the details as an artifact.
  - Close the issue when the sweep finds nothing.
  - Put the logic in `.github/scripts/link-sweep-issue.js`, with a unit test.
  - Measure the first run against `max_execution_time_minutes = 10`.
- **L3. Fail only on links the PR introduces.** Extract links from the base
  and head versions of each touched file. An error whose file and URL pair
  already existed at the base becomes `info`, marked `inherited`.
  Start with Markdown source extraction (`scripts/link-extractor.js`).
  Rendering the base revision would add a Hugo build, which works against A.
- **L4. Agent fix workflow.** Add a gh-aw workflow `link-fix.md`, triggered by
  sweep results, that opens at most one draft `[link-fix]` PR.
  - It fixes internal 404s using `aliases:` and `git log --follow`, and
    replaces or removes dead external links.
  - It edits `content/shared/` instead of product stubs.
  - It never touches pending links.
  - Engine: Copilot (decided). Use gh-aw `engine: copilot`, as
    `weekly-repo-status.md` does. The `COPILOT_GITHUB_TOKEN` repository
    secret already exists, so no new secret is needed.
- **L5. Pending links (the original G).** Add a `pending_links` frontmatter
  key with a `url` and an `until` date. The PR check and the sweep downgrade
  listed URLs to warnings until that date. Document the key in
  `DOCS-FRONTMATTER.md`.

L2 and Part 2 below both maintain one long-lived issue.
Write one shared upsert helper for both instead of two copies.

### Dependencies

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

| Metric                         | Baseline  | Target                              |
| ------------------------------ | --------- | ----------------------------------- |
| Hugo builds per content commit | 4–5       | 1–2                                 |
| Runner-minutes per day         | \~253     | \~110–130                           |
| Preview URL available, median  | \~4.2 min | \~2.5 min with D, \~3.5 min without |
| Required checks green, median  | \~2.1 min | \~1.2 min                           |
| Setup time per Node job        | 30–45 s   | 10–15 s                             |

## Open questions

1. Where should the Core and Enterprise release checklist live? The
   recommendation is the `pr-release-check.yml` comment (1.4).
2. Delete `influxdb3-release.yml` and `trigger-on-release.yml`? Check whether
   `trigger-on-release.yml` has ever run (1.4).
3. Who can configure the GitHub production environment and AWS production role
   for the cutover in 1.6? It needs GitHub repository administration and IAM access.
4. Why does `pr-preview.yml` prefetch the converter?
5. Weekly sweep cadence and scope: the link-check plan proposes weekly,
   internal and external. Revisit after L0.

## Decision log

- 2026-11-02: Run the Playwright trial (#7898).
- 2026-11-02: The link-fix agent (L4) runs on Copilot.
- 2026-11-02: Remove `prepare-release.yml`. Nobody uses it, and it never ran.
- 2026-11-02: Only Core and Enterprise get a release checklist. No Quay item.
- 2026-11-02: Confirmed CircleCI stores static AWS keys as project variables.
  PR Preview uses OIDC (`AWS_PR_PREVIEW_ROLE_ARN`).
- 2026-11-02: CircleCI OIDC uses the V3 token and an explicit
  `assume-role-with-web-identity` step, because `s3deploy` ignores the
  web-identity variables.
  Superseded by the 2026-11-03 GitHub deployment decision.
- 2026-11-03: Use GitHub Actions for build, checks, and deployment.
  Separate build and deploy jobs; only deploy receives production OIDC permission.
  Keep standard GitHub-hosted runners until an approved public-repository runner
  option justifies a measured trial.
- 2026-11-03: Reconsider CircleCI if GitHub performance and uptime become
  unsatisfactory and CircleCI fully supports the required GitHub workflow syntax
  outside Preview.
  Revalidate credential isolation before any future switch.
