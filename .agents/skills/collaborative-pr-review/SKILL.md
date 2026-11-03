---
name: collaborative-pr-review
description: Review or propose edits to existing docs-v2 pull requests, including CODEOWNERS' and contributors' PRs, or prepare a successor PR for an external contribution. Use before publishing PR corrections or submitting approval.
---

# Review collaborative pull requests

Preserve the PR author's control over substantive corrections.
Identify the invoking user's GitHub account, the authenticated account, the
PR author, and both repositories and branches.
The user is the current invoker; never inherit a repository owner's identity
or permissions from this skill or an earlier conversation.
Check the invoker's authorization and GitHub capabilities separately.
If the authenticated account differs, use the invoker's credentials or hand off.

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

## Guard writes

Use [the write guard](../../../scripts/pr-write-guard.mjs) for Git pushes,
file and ref updates, merges, and PR closure.
Read [the request format and hook coverage](references/write-guard.md) before
the first write.
The guard checks live identity, repository permissions, PR ownership, and the
expected head before executing the specific operation.
Explicit authorization is a scoped record of a user instruction, not a role
or permission grant; the guard does not infer consent from prompt wording.
If a protected operation lacks access, use the returned fork or handoff route.

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
