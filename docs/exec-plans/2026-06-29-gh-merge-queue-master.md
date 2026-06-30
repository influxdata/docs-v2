# GitHub merge queue for `master`

**Status:** In review — PR [#7434](https://github.com/influxdata/docs-v2/pull/7434)
**Closes:** [#7412](https://github.com/influxdata/docs-v2/issues/7412)
**Depends on:** lint-codeblocks bug fix — [#7433](https://github.com/influxdata/docs-v2/issues/7433) (gates the Phase 2 follow-up)

## Goal

Replace the dead PR auto-update mechanism with GitHub's native **merge queue**
on `master`. Contributors stop hand-rebasing onto `master`: a maintainer clicks
**"Merge when ready"**, the queue builds `master` + the PR on a throwaway
`gh-readonly-queue/master/*` branch, runs the required checks there, and
completes the merge only if green. The human merge gate is unchanged.

## Why now

`.github/workflows/pr-autoupdate.yml` is a silent no-op — it pins
`docker://chinthakagodawita/autoupdate-action:v1.7.0`, whose Docker image is
gone and whose upstream repo is archived. With `master` branch protection set
to `strict: true` ("require branches up to date before merging"), contributors
must now manually rebase every PR each time `master` moves — and at the current
volume (\~90 PRs merged in the last 30 days, 47 in the last week, \~18 open at a
time) that churn is constant. A merge queue removes the rebase requirement while
preserving the "master never breaks" guarantee.

## Decisions

- **Merge queue, not a maintained auto-update action.** A queue updates the base
  *once at merge time* (\~3–6 builds/day at current volume); a continuous
  auto-update action rebuilds *every* open PR on *every* `master` push
  (\~55–110 builds/day) — roughly 10× the CircleCI cost for the same
  "no manual rebase" outcome. The queue also catches a bad merge *before* it
  reaches `master` instead of fanning it out to all open PRs. Decisively: this
  issue exists *because* a third-party auto-update action rotted; the queue is a
  native GitHub feature with nothing to archive or pin.
- **Turn off `strict`.** The queue rebuilds `master` + PR in its temp branch and
  validates *that*, so "require branch up to date before merging" is redundant
  and merely re-imposes the manual rebase the queue exists to remove. Turning it
  off does **not** weaken the human merge gate — that gate is the "Merge when
  ready" click, not `strict`.
- **Phase the rollout — ship the queue now, gated only on `ci/circleci: build`;
  re-require `Lint code blocks` later (sequencing option "B").** `Lint code
  blocks` is a *required* check, and a merge queue hangs forever on any required
  check that does not report on the `merge_group` branch. That check currently
  has a known bug ([#7433](https://github.com/influxdata/docs-v2/issues/7433)),
  so we do **not** wire it into `merge_group`
  yet. Instead, admin temporarily drops it from the required-checks list so the
  queue gates only on the CircleCI Hugo build — the real "master doesn't break"
  guarantee for a docs site. Lint still runs on every PR as a non-required
  check, so contributors keep its feedback; it just doesn't block merges during
  the window. Rejected alternatives: (A) gate the entire rollout on the lint
  fix — ships the queue later for no current benefit, since auto-update is
  already dead; (C) `merge_group` skip-to-success — keeps lint required but
  reports a phantom "skipped" check and still entangles the queue change with
  the buggy workflow.
- **No CircleCI config change.** The `build` job has no branch filter, so it
  already builds every pushed branch — including `gh-readonly-queue/master/*` —
  and reports the exact required context `ci/circleci: build`. The `deploy` job
  is filtered `only: master`, so queue branches never deploy, and the job's
  `CIRCLE_BRANCH != master` path keeps them on the cheaper incremental build.
  The single dependency is the CircleCI **"Only build pull requests"** project
  setting: it must be **OFF**, or queue branches won't build and PRs hang. This
  is the issue's headline risk and is a settings verification, not code.
- **Queue parameters: squash merge, max group size = 1.** Squash matches how the
  repo merges today and keeps `master` history clean. Max group size 1 means the
  queue validates one PR at a time, so the *only* thing that can eject a PR is
  its own build failure — never a semantic conflict with another PR ahead of it.
  At \~6 merges/day the throughput cost is negligible, and it directly limits the
  committer-experience downside (ejection on a flaky build).

## Explicitly out of scope

- **Fixing the `Lint code blocks` bug and wiring it into `merge_group`** — the
  Phase 2 follow-up. Once fixed, a single change adds `merge_group:` to
  `test.yml` (run-for-real: `detect-changes` computes its diff from
  `github.event.merge_group.base_sha`, and the `lint-codeblocks` `if:` is
  extended to `merge_group`) **and** re-adds `Lint code blocks` to the required
  list. These must land together, or the queue hangs again. Tracked by
  [#7433](https://github.com/influxdata/docs-v2/issues/7433).
- **Auditing other GitHub Actions checks for `merge_group`** — trivial under
  option B: after de-requiring lint, `ci/circleci: build` is the only required
  check, and it reports independently of `merge_group`. Re-audit when lint is
  re-required.

## How to update

- **Required checks / queue settings** live in `master` branch protection (admin
  UI / ruleset), not in the repo — coordinate with the security team, which owns
  branch protection org-wide.
- **To make a *new* GitHub Actions check merge-queue-safe** before marking it
  required: add `merge_group:` to that workflow's `on:` triggers so it reports on
  `gh-readonly-queue/*` branches. A required check without it stalls the queue.

## Verification

1. **Pre-enable:** confirm CircleCI "Only build pull requests" is OFF for the
   `docs-v2` project (CircleCI project settings → Advanced).
2. **Admin:** on the literal-`master` rule (classic protection, no wildcard —
   confirmed via `gh api repos/influxdata/docs-v2/branches/master/protection`),
   remove `Lint code blocks` from required checks, turn off `strict`, enable
   "Require merge queue" with the parameters above.
3. **Smoke test (low-traffic window):** open one trivial docs PR, click "Merge
   when ready", and confirm `ci/circleci: build` reports on the
   `gh-readonly-queue/master/*` branch and the PR merges. If it hangs, CircleCI
   is not building queue branches — revisit step 1.
4. **Rollback:** disable "Require merge queue" in branch protection. No code
   revert needed; the only in-repo change is the `pr-autoupdate.yml` deletion.

## In-repo change set (this PR)

- Delete `.github/workflows/pr-autoupdate.yml` (dead no-op).
- This exec-plan.

Everything else is admin/settings (Phase 1 enablement) or the Phase 2 follow-up.
