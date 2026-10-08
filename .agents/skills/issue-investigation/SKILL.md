---
name: issue-investigation
description: "Investigate GitHub issues before attempting fixes. Verifies reported problems are real and reproducible, checks whether fixes already exist, and gathers root cause evidence. Use before working on any bug report, broken link, or content issue."
---

# Issue Investigation Skill

This skill covers **investigation and reproduction** — confirming a reported
problem is real, finding its root cause, and checking whether a fix already
exists. For labeling, prioritizing, and routing issues, see `doc-triage-agent`.

## Step 1: Read the Issue Carefully

Extract:
- **What is reported** — exact symptom (404, wrong content, rendering bug, etc.)
- **Where** — URLs, file paths, product versions, or page locations
- **Date filed** — older issues are more likely already fixed
- **Assignees / comments** — may indicate in-progress or already-resolved work

## Step 2: Reproduce the Problem

Verify the reported behavior before assuming it still exists. Issues are
frequently fixed without being closed.

**Choose the right method for the issue type:**

| Issue type | How to reproduce |
|---|---|
| Broken link / 404 | Fetch the URL on the live site |
| Wrong content or outdated info | Read the live page and compare to what the issue describes |
| Rendering / layout bug | View the live page in a browser |
| Missing page or section | Search the repo for the expected content |
| CI link-checker failure | Read the CI logs referenced in the issue |

If the reported problem no longer exists, the issue may be resolved. Check git
history for when and how it was fixed before closing.

## Step 3: Check the Codebase

If the problem still exists, investigate locally:

- **Search for the relevant files** — does the expected content exist in the
  repo?
- **Check git history** — did recent commits touch this area? Was a file
  renamed, moved, or deleted?
  ```
  git log --oneline -20 -- <path>
  git log --follow --oneline -- <path>
  ```
- **Check for existing fixes** — search for PRs referencing the issue number:
  ```
  git log --oneline --all | grep <issue-number>
  ```

Check git history **before** concluding the content is wrong. Changes made after
the issue was filed often mean the fix is already in place.

## Step 4: Identify the Root Cause

Common patterns in this repo:

| Symptom | Likely cause | What to check |
|---|---|---|
| Broken link (404) | Missing page, bad Hugo alias, or wrong URL in source | File exists? Aliases in frontmatter? |
| Fragment not found | Heading renamed or removed | Search for the anchor ID |
| Wrong content | Outdated copy, stale shared content | Check `source:` frontmatter, shared files |
| Rendering bug | Shortcode misuse, template error | Check shortcode syntax, build the site |
| Missing documentation | Page never created, or removed | Search repo; check git history for deletions |

## Step 5: Decide the Outcome

After investigating, one of these is true:

- **Still broken** — describe the root cause and propose a minimal fix.
- **Already fixed** — identify the commit/PR that fixed it; recommend closing.
- **Not a docs problem** — access control, external site issue, product bug;
  recommend reassigning or closing with explanation.
- **Cannot reproduce** — describe what you checked; ask for clarification.

## Common Pitfalls

- Do not treat an open issue as proof the problem still exists — issues go stale.
- Do not apply a fix without reproducing the problem first.
- Do not restructure content (rename directories, move files) without first
  checking whether a simpler fix (alias, redirect, content edit) already handles
  the case.
- Do not confuse access errors (403) with missing content (404).
