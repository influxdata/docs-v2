# Adopt a GitHub merge queue for the `master` branch

## Purpose / Big Picture

After this change, a contributor to the `influxdata/docs-v2` documentation site no longer has to manually rebase a pull request (PR) onto the latest `master` before it can merge. Instead, a maintainer clicks the **Merge when ready** button, and GitHub's [*merge queue*](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue) takes over: it builds a temporary branch containing `master` plus the PR, runs the repository's required checks against that combined branch, and completes the merge only if those checks pass. The site's "master is always deployable" guarantee is preserved, but the rebase churn is gone.

## Progress

Phase 1 (ship the queue, gated only on the CircleCI build) is complete. Phase 2 (re-require the code-block lint once its bug is fixed) is not yet started.

- [x] (2026-06-30) Removed the defunct `.github/workflows/pr-autoupdate.yml` workflow. Merged to `master` via PR #7434.
- [x] (2026-06-30) Recorded the rollout decisions in this document. Merged via PR #7434.
- [x] (2026-06-30) Filed issue #7433 for the `Lint code blocks` bug that blocks Phase 2.
- [x] (2026-06-30 ~14:45Z) Admin enabled the merge queue on `master`, turned off the `strict` up-to-date requirement, and removed `Lint code blocks` from the required checks. Confirmed via the GitHub API: `strict` is now `false`.
- [ ] Verify the queue actually runs end-to-end (completed: queue is enabled; remaining: a PR has not yet been observed flowing through `gh-readonly-queue/master/*` — the one merge so far bypassed the queue, see `Surprises & Discoveries`).
- [ ] Confirm the CircleCI project setting "Only build pull requests" is OFF so queue branches build (completed: nothing; remaining: check CircleCI project → Settings → Advanced, or infer from a successful `ci/circleci: build` on a `gh-readonly-queue/*` branch).
- [ ] Phase 2: fix the `Lint code blocks` bug (#7433). Tracked separately; prerequisite for the next item.
- [ ] Phase 2: add the `merge_group:` trigger to `.github/workflows/test.yml` and make the lint job report on queue branches (completed: nothing; remaining: the edits in `Plan of Work` and `Concrete Steps`).
- [ ] Phase 2: re-add `Lint code blocks` to the `master` required checks, in the same change that lands the `merge_group:` trigger.

## Surprises & Discoveries

- Observation: Enabling "Require merge queue" does not stop a user with bypass permission from merging directly and skipping the queue. The first merge after enabling (PR #7434) bypassed the queue.

- Observation: The merge queue does not reduce the number of CircleCI builds; it adds one. After any merge, `master` still runs a full build and deploy.

  Evidence: In `.circleci/config.yml`, the `deploy` job declares `requires: build` and attaches the `workspace/public` directory produced by the `build` job in the same pipeline, and the `deploy` job is filtered to run only on `master`. There is no path that deploys a previously built artifact from another branch or pipeline. So the queue's validation build runs on the throwaway `gh-readonly-queue/*` branch (which never deploys), and then `master` builds and deploys again after the merge. The dependency caches added in earlier CI work make the rebuild faster but never skip the Hugo build itself.

## Decision Log

- Decision: Use a native GitHub merge queue rather than a maintained third-party auto-update action.

  Rationale: At this repository's volume (about 80–90 PRs merged per month, with bursts above 40 per week and roughly 18 open at once), a continuous auto-update action would rebuild every open PR on every push to `master` — on the order of 55–110 builds per day — versus roughly one validation build per merged PR for the queue. The queue also catches a bad combined state before it reaches `master`, and it is a native feature with no third-party dependency to rot. This issue exists precisely because the previous auto-update action (`chinthakagodawita/autoupdate-action`) was archived and its Docker image removed.

  Date/Author: 2026-06-29, Jason Stirnaman (with Claude).

- Decision: Turn off the `strict` "require branches to be up to date before merging" setting when enabling the queue.

  Rationale: The queue rebuilds `master` plus the PR in its temporary branch and validates that, so additionally requiring the PR branch to be up to date first is redundant and merely re-imposes the manual rebase the queue exists to remove. Turning `strict` off does not weaken human review: the merge gate is the **Merge when ready** click, not `strict`.

  Date/Author: 2026-06-29, Jason Stirnaman (with Claude).

- Decision: Ship the queue gated only on `ci/circleci: build`, and re-require `Lint code blocks` later (sequencing option "B").

  Rationale: A merge queue waits forever on any required check that does not report on the `merge_group` branch. `Lint code blocks` is a required check, and it has a known bug (#7433), so it was not wired into the queue yet. Removing it from the required set temporarily lets the queue ship now, gated on the CircleCI Hugo build, which is the real "master is deployable" guarantee for a docs site. Lint still runs on every PR as a non-required check, so contributors keep its feedback. Rejected alternatives: (A) gate the entire rollout on the lint fix, which delays the queue for no current benefit since the old auto-update was already dead; (C) wire lint as a `merge_group` job that skips to success, which keeps a confusing phantom "skipped" check and still entangles the queue with the buggy workflow.

  Date/Author: 2026-06-29, Jason Stirnaman (with Claude).

- Decision: Use the rebase merge method and the default merge limits (minimum group size 1, maximum 5).

  Date/Author: 2026-06-30, Jason Stirnaman (with Claude).

## Outcomes & Retrospective

Phase 1 achieved the user-visible goal: the dead auto-update workflow is gone, the queue is enabled on `master`, and `strict` is off, so contributors are no longer forced to rebase. What remains is to observe a real PR flowing through the queue (the first merge bypassed it) and to complete Phase 2 so the code-block lint runs inside the queue again.

## Context and Orientation

The repository is the Hugo-based documentation site at `influxdata/docs-v2`. Two continuous integration (CI) systems run against it, and both matter here.

The first is CircleCI, configured in `.circleci/config.yml`. It defines a `build` job that installs dependencies, generates API docs, builds a Rust markdown converter, runs the Hugo build over 5000-plus pages, and verifies the output. The `build` job has no branch filter, so CircleCI builds every pushed branch — including the queue's temporary `gh-readonly-queue/master/*` branches — and reports its result to GitHub under the status context exactly named `ci/circleci: build`. A separate `deploy` job runs only on `master` and depends on `build`. Because CircleCI is a third-party provider rather than a GitHub Actions workflow, the GitHub `merge_group` event (described below) does not reach it; CircleCI participates in the queue purely by building the pushed `gh-readonly-queue/*` branch.

The second is GitHub Actions. The relevant workflow is `.github/workflows/test.yml`, named "Test Code Blocks". It currently triggers on `pull_request` and `workflow_dispatch`. Inside it, a job whose display name is `Lint code blocks` (job id `lint-codeblocks`) is a required status check on `master`. That job depends on a `detect-changes` job that computes the set of changed files by diffing `github.event.pull_request.base.sha` against `github.sha`, and the `lint-codeblocks` job runs only when its condition `github.event_name == 'pull_request' && needs.detect-changes.outputs.canonical-sources != '' && needs.detect-changes.outputs.canonical-sources != '[]'` is met. Both of those facts are PR-specific and are why Phase 2 needs edits, explained later.

Branch protection on `master` is classic branch protection on the literal branch name `master` (not a wildcard pattern, which matters because a merge queue cannot be enabled on a wildcard). Before this work, its required status checks were `ci/circleci: build` and `Lint code blocks`, and its `strict` flag was `true`. After Phase 1, `Lint code blocks` was removed from the required set and `strict` was set to `false`.

Two more terms used below. The `merge_group` event is a GitHub Actions trigger that fires when GitHub builds a merge-queue group; a workflow runs against the `gh-readonly-queue/*` branch only if its `on:` list includes `merge_group`. The `strict` flag is the REST API name for the branch-protection checkbox labeled "Require branches to be up to date before merging" in the GitHub UI.

## Plan of Work

Only Phase 2 has remaining code work; Phase 1's only in-repo change (deleting `pr-autoupdate.yml`) is already merged.

Phase 2 begins outside this repository: the `Lint code blocks` bug (#7433) must be fixed first, because wiring a still-broken check into the queue would make queued PRs fail or hang. That fix is tracked in #7433 and is not specified here.

Once #7433 is fixed, make three edits to `.github/workflows/test.yml`, all additive. First, add `merge_group:` to the workflow's `on:` list so the workflow runs against `gh-readonly-queue/*` branches. Second, in the `detect-changes` job, add a branch to the change-detection logic that computes the diff for the `merge_group` event using `github.event.merge_group.base_sha` as the base and `github.sha` as the head (the existing logic only handles `pull_request` and `workflow_dispatch`), and extend the `Setup Node.js` step's condition so Node is installed for `merge_group` as well as `pull_request`. Third, change the `lint-codeblocks` job condition so it also runs on the `merge_group` event, for example `(github.event_name == 'pull_request' || github.event_name == 'merge_group') && needs.detect-changes.outputs.canonical-sources != '' && needs.detect-changes.outputs.canonical-sources != '[]'`.

Finally, an admin must re-add `Lint code blocks` to the `master` required status checks. This admin step and the `test.yml` edits must land together: if `Lint code blocks` becomes required before it reports on `merge_group`, the queue hangs; if the trigger lands but the check is never required, nothing enforces it.

## Concrete Steps

Run these from the repository root, which in this worktree is the current working directory. Do not change directories into the main clone.

To make the `test.yml` edits, open `.github/workflows/test.yml` and change the `on:` block from its current form to include the merge-queue trigger. The current block looks like this:

    on:
      pull_request:
        types: [opened, synchronize, reopened]
      workflow_dispatch:
        inputs:
          ...

Add the trigger so it reads:

    on:
      pull_request:
        types: [opened, synchronize, reopened]
      merge_group:
      workflow_dispatch:
        inputs:
          ...

In the `detect-changes` job, the `Setup Node.js` step is currently gated on pull requests only:

    - name: Setup Node.js
      if: github.event_name == 'pull_request'

Change its condition to also cover the merge group:

    - name: Setup Node.js
      if: github.event_name == 'pull_request' || github.event_name == 'merge_group'

In the same job's change-detection script, the diff base is currently taken only from the pull-request payload:

    ALL_CHANGED=$(git diff --name-only ${{ github.event.pull_request.base.sha }}...${{ github.sha }})

Compute the base from whichever event fired, so the merge-group branch diffs against the base GitHub recorded for the group. One safe way is to set a shell variable before the diff:

    if [ "${{ github.event_name }}" = "merge_group" ]; then
      DIFF_BASE="${{ github.event.merge_group.base_sha }}"
    else
      DIFF_BASE="${{ github.event.pull_request.base.sha }}"
    fi
    ALL_CHANGED=$(git diff --name-only "$DIFF_BASE"...${{ github.sha }})

Finally, change the `lint-codeblocks` job condition from:

    if: github.event_name == 'pull_request' && needs.detect-changes.outputs.canonical-sources != '' && needs.detect-changes.outputs.canonical-sources != '[]'

to:

    if: (github.event_name == 'pull_request' || github.event_name == 'merge_group') && needs.detect-changes.outputs.canonical-sources != '' && needs.detect-changes.outputs.canonical-sources != '[]'

Commit the workflow change on a feature branch and open a PR, for example:

    git checkout -b 7412-merge-queue-phase-2 origin/master
    git add .github/workflows/test.yml
    git commit -m "ci(test): report Lint code blocks on merge_group for merge queue (#7412)"
    git push -u origin 7412-merge-queue-phase-2

The admin step cannot be done from the repository. In the `master` branch protection or ruleset, add `Lint code blocks` back to the required status checks at the same time the PR above merges.

You can inspect the current branch protection at any time to confirm state:

    gh api repos/influxdata/docs-v2/branches/master/protection \
      --jq '{strict: .required_status_checks.strict, contexts: [.required_status_checks.checks[].context]}'

Before Phase 1 this returned `strict: true` with both contexts; after Phase 1 it returns `strict: false` with only `ci/circleci: build`; after Phase 2 it should again list `Lint code blocks`.

## Validation and Acceptance

Phase 1 acceptance is behavioral. Open a trivial documentation PR against `master`, click **Merge when ready**, and observe that GitHub creates a branch named `gh-readonly-queue/master/...`, that `ci/circleci: build` reports a result on that branch, and that the PR merges automatically once the check passes. If the PR instead merges instantly with no `gh-readonly-queue` branch, it bypassed the queue (see `Surprises & Discoveries`); merge through **Merge when ready** and avoid using a bypass.

You can confirm a PR actually went through the queue by checking its timeline for the queue event. For PR number N:

    gh api graphql -f query='{repository(owner:"influxdata",name:"docs-v2"){pullRequest(number:N){timelineItems(last:30, itemTypes:[ADDED_TO_MERGE_QUEUE_EVENT, MERGED_EVENT]){nodes{__typename}}}}}'

A queued merge shows an `AddedToMergeQueueEvent` followed by a `MergedEvent`. A bypassed merge shows only `MergedEvent`.

If a queued PR hangs and never merges, the most likely cause is that CircleCI is not building the `gh-readonly-queue/*` branch. Confirm that the CircleCI project setting "Only build pull requests" is OFF (queue branches have no PR, so that setting would skip them), then re-queue the PR.

Phase 2 acceptance is also behavioral. After the `merge_group` trigger lands and `Lint code blocks` is required again, push a PR that changes a canonical content file and merge it through the queue. On the `gh-readonly-queue/master/*` branch you should see both `ci/circleci: build` and `Lint code blocks` report results, and the PR should merge only after both pass. A PR that changes no canonical sources should still merge, because the lint job skips cleanly when there is nothing to lint, and GitHub treats a skipped required check as satisfied.

## Idempotence and Recovery

The settings steps are safe to repeat: setting `strict` to `false` again, or re-adding a required check that is already present, changes nothing. The `test.yml` edits are additive and can be reapplied without harm. To roll the queue back at any time, disable "Require merge queue" in `master` branch protection; no code revert is needed, because the only merged in-repo change is the `pr-autoupdate.yml` deletion. If Phase 2 ever causes the queue to hang, removing `Lint code blocks` from the required checks immediately unblocks it while you investigate.

## Artifacts and Notes

Branch-protection state after Phase 1, for reference:

    $ gh api repos/influxdata/docs-v2/branches/master/protection \
        --jq '{strict: .required_status_checks.strict, contexts: [.required_status_checks.checks[].context]}'
    {"strict":false,"contexts":["ci/circleci: build"]}

Evidence that the first post-enable merge (PR #7434) bypassed the queue:

    $ gh api graphql -f query='{repository(owner:"influxdata",name:"docs-v2"){pullRequest(number:7434){autoMergeRequest{enabledAt} timelineItems(last:30, itemTypes:[ADDED_TO_MERGE_QUEUE_EVENT, MERGED_EVENT]){nodes{__typename}}}}}'
    {"data":{"repository":{"pullRequest":{"autoMergeRequest":null,"timelineItems":{"nodes":[{"__typename":"MergedEvent"}]}}}}}

## Interfaces and Dependencies

The files that must exist and be edited for Phase 2 are `.github/workflows/test.yml` (add `merge_group:`; handle the `merge_group` event in the `detect-changes` job and the `lint-codeblocks` condition) and, unchanged but depended upon, `.circleci/config.yml` (its `build` job already reports `ci/circleci: build` on all branches; its `deploy` job runs only on `master`).

The required status check contexts must match exactly, character for character: `ci/circleci: build` and `Lint code blocks`. The GitHub Actions event fields used by the Phase 2 edits are `github.event.merge_group.base_sha` (the base commit GitHub recorded for the merge group) and `github.sha` (the head of the `gh-readonly-queue/*` branch).

Related work items: issue #7412 (this rollout), issue #7433 (the `Lint code blocks` bug that gates Phase 2), and PR #7434 (Phase 1, merged, which deleted `pr-autoupdate.yml` and introduced this document).

## Revision note

2026-06-30: Rewrote this file from a short decision record into a self-contained ExecPlan following the PLANS.md pattern, because the remaining Phase 2 work needs a novice-followable specification and the rollout produced durable discoveries (queue bypass, build-not-reduced) worth recording. No facts were changed; the decisions and status were carried over and expanded with explicit context, concrete steps, and behavioral acceptance.
