---
name: collaborative-pr-review
description: Write docs-v2 PR descriptions, review or propose edits to existing pull requests, or prepare a successor PR for an external contribution. Use before creating a PR, publishing PR corrections, or submitting approval.
---

# Write and review collaborative pull requests

## Write the PR description

Before creating a PR through the GitHub UI, CLI, or API, read the applicable
repository template.
Use [the general template](../../../.github/pull_request_template/general.md)
unless a task-specific template applies.
Start the body from that template, including when supplying a complete body
through a connector or `--body-file`, which can bypass template insertion.

Keep the template's sections and checklist.
Fill in what changed, why, reader impact, verification, and preview pages with
the expected result for each affected page.
For sections or checks that do not apply, say why; check a box only when the
requirement is satisfied.
Include closing issue references only when the PR resolves those issues.

When a generated-content completion record is required, place it under
**Verification** alongside the checks that ran.
Use the applicable workflow's record fields and distinguish completed checks
from pending source corrections, regeneration, or runtime verification.
The record supplements the PR template.

## Choose the publication route

Preserve the PR author's control over substantive corrections.
Before publishing branch changes, check the PR author, target branch, and the
invoking user's authenticated account and access.
Apply the workflow for the current contributor; repository-owner permissions
do not transfer to other contributors who use this skill.

| Situation | Publication route |
| --- | --- |
| The user owns the PR and can push to its head branch | Direct pushes are allowed within the authorized task. |
| The user explicitly approves a direct push and has target access | Push only the authorized changes. |
| The user lacks upstream write access | Publish proposed changes from a branch in the user's fork. |
| The user requests a successor PR for an external contribution | Merge the fork branch into a new branch, preserve authorship, and follow the successor workflow below. |
| Another contributor or CODEOWNER owns the PR, without direct-push approval | Propose corrections as inline suggestions or a separate PR targeting the author's head branch. |
| Ownership or authorization is unclear | Prepare and verify the corrections locally; use the proposal route. |

Repository write access, `maintainer_can_modify`, CODEOWNERS status, and a
review request do not authorize a direct push to another contributor's PR.
An instruction to complete a review, fix findings, or approve when checks pass
does not authorize that push either.
This boundary applies to Git pushes and GitHub API operations that update
files or branch refs.

## Reviews and comments

Present findings, suggestions, and requested reviews through the usual GitHub
or local review tools, within the user's requested scope.
The direct-push approval rule concerns changes to another author's branch;
posting a review or suggestion does not update that branch.
Use the user's existing authorization without adding a separate approval step.

## Prepare corrections for the author

Continue local investigation, focused edits, rendering, and relevant checks
without waiting for permission to prepare the proposal.
For inline suggestions, explain the reader impact and include the replacement
text with source evidence where needed.

For a correction PR, branch from the reviewed head in a repository the invoker
can write to, including their own fork.
Target the original PR's head repository and branch.
If GitHub cannot open that comparison, leave inline suggestions or a patch
and identify the author action needed.
Verify that its diff contains only the proposed corrections.
Link the correction PR from the original review.
Request the author's review if the invoker has review-assignment permission;
otherwise, mention the author with the correction link.
Leave acceptance and merging of the correction PR to the author unless the
user explicitly authorizes otherwise.

Preserve the author's commits and authorship.
Keep proposed corrections in separate commits; don't amend, squash, rebase,
or rewrite the author's work as part of the review.

## Replace an external contribution with a successor PR

Use this route when the user requests a successor PR for an external
contribution, including closing the original PR.
Unlike a correction PR targeting the contributor's branch, the successor
targets the original PR's upstream base branch.

1. Record the original PR's title, description, author, upstream base branch,
   fork repository, and exact fork head commit.
2. Create a new branch in a writable repository, using the invoker's own fork
   when they lack upstream write access.
   Start from the upstream base and merge the contribution's fork branch into it.
   Keep the contributor's original commits and author metadata intact.
3. Commit focused corrections under your own identity and run the relevant checks.
   Verify that the recorded fork head remains an ancestor of the final head
   with `git merge-base --is-ancestor FORK_HEAD HEAD`, replacing `FORK_HEAD`
   with the recorded commit SHA.
4. Open a successor PR against the upstream base with the original title.
   Start from the original description and correct it to describe the final
   changes and verification.
   Credit the external contributor and link the original PR.
   Attribute the contributor's first-person statements rather than presenting
   them as your own.
5. Request the external author's review when GitHub permits it.
   Otherwise, mention them in a comment with the successor link and a concise
   explanation of the corrections.
6. Confirm the successor PR is open with the intended base, preserved commits,
   and corrected description.
   Link it from the original PR.
   Close the original as superseded only if the invoker has closure permission.
   Otherwise, leave it open and ask its author or a maintainer to close it.

Keep the original PR open if creating or verifying the successor fails.
Report the remaining step instead of closing the contribution without a
reviewable replacement.

## Submit the review

When updating the invoker's own PR, request independent review.
Do not submit approval of that PR on the author's behalf.
When reviewing someone else's PR, submit only the review the invoker can make;
a contributor's review does not imply a maintainer's required approval.

If substantive findings remain, submit an appropriate review with the proposed
resolution and keep approval pending the author's acceptance.
After the author accepts the corrections, inspect the resulting PR head and
verify its relevant checks before approving.
A successful check on the proposal alone does not resolve a finding in the
original PR.

## Respond to review feedback on your PR

To wait for Copilot reviews, reply to review comments, and fix links the
link checker reports, see [references/review-feedback.md](references/review-feedback.md).
