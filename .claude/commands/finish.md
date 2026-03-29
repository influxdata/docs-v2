# Finish and Cleanup

Complete development work by cleaning up ephemeral documents and preparing for merge.

## Description

This skill handles the end of a development workflow:
1. Reads the full contents of PLAN.md
2. Adds the complete plan details to the PR description (or as a PR comment if the description is already long)
3. Removes ephemeral planning documents
4. Creates a cleanup commit
5. Optionally merges the PR

## Usage

```
/finish              # Cleanup and prepare for merge
/finish --merge      # Cleanup and merge with squash
/finish --dry-run    # Show what would happen without making changes
```

## Arguments

- `--merge`: After cleanup, merge the PR using `gh pr merge --squash`
- `--dry-run`: Preview actions without executing them
- `--no-pr-update`: Skip updating PR description

## Steps

### 1. Verify Prerequisites

Check that we're ready to finish:
- Confirm we're in a git worktree (not main branch)
- Check for PLAN.md existence
- Verify no uncommitted changes (or warn)
- Check for open PR on current branch

```bash
# Check branch
git branch --show-current

# Check for uncommitted changes
git status --porcelain

# Check for open PR
gh pr view --json state,url 2>/dev/null
```

### 2. Read Full PLAN.md Contents

Read the entire PLAN.md file and preserve all sections:
- Source metadata
- Objective
- All tasks (completed and incomplete)
- Notes, decisions, and research

```bash
# Read the full plan
PLAN_CONTENTS="$(cat PLAN.md)"
```

### 3. Add Plan Details to PR

Add the **complete** PLAN.md contents to the PR. Do not summarize or abbreviate
the plan -- include all details so they are preserved after the file is deleted.

**Strategy:**
- If the PR description is short (under ~2000 characters), append the full plan
  to the PR description.
- If the PR description is already long, post the full plan as a PR comment
  instead, to keep the description readable.

**Appending to PR description:**

```bash
# Get current PR body
CURRENT_BODY="$(gh pr view --json body -q '.body')"

# Update PR with full plan details appended
gh pr edit --body "$(cat <<EOF
${CURRENT_BODY}

---

## Development Plan

<details>
<summary>Full plan details (from PLAN.md)</summary>

${PLAN_CONTENTS}

</details>
EOF
)"
```

**Posting as PR comment (if description is already long):**

```bash
gh pr comment --body "$(cat <<EOF
## Development Plan

Full plan details preserved from PLAN.md before cleanup:

---

${PLAN_CONTENTS}
EOF
)"
```

### 4. Remove Ephemeral Files

Delete planning documents that shouldn't be merged:

```bash
# Remove PLAN.md and any other ephemeral docs
git rm PLAN.md 2>/dev/null || true
git rm HANDOVER.md 2>/dev/null || true
```

### 5. Create Cleanup Commit

```bash
git commit -m "chore: remove planning docs

Cleanup ephemeral documents before merge.
See PR description for work summary."
```

### 6. Push Changes

```bash
git push
```

### 7. Merge (if --merge flag)

```bash
gh pr merge --squash --delete-branch
```

## Edge Cases

### No PLAN.md exists
- Warn user: "No PLAN.md found. Nothing to cleanup."
- Offer to proceed with merge anyway if --merge flag

### Uncommitted changes
- Warn user about uncommitted changes
- Ask for confirmation before proceeding
- Suggest committing or stashing first

### No open PR
- Skip PR update step
- Warn: "No open PR found for this branch"
- Still cleanup files if they exist

### Incomplete tasks in PLAN.md
- Warn: "PLAN.md has X incomplete tasks"
- Show remaining tasks
- Ask for confirmation before proceeding

## Examples

### Example 1: Standard cleanup
```
User: /finish

Agent:
## Finishing development work

### Prerequisites
- Branch: docs-v2-issue6763
- PLAN.md: Found (42 lines)
- Uncommitted changes: None
- Open PR: #6789

### Plan status:
- 4/4 tasks completed
- Objective: Document InfluxDB 3.9 release features

### Actions:
1. Read full PLAN.md contents (42 lines, all sections preserved)
2. Updated PR #6789 description with complete plan details
3. Removed PLAN.md
4. Created commit: "chore: remove planning docs"
5. Pushed to origin

Ready for merge! Run `/finish --merge` or merge manually.
```

### Example 2: Cleanup with merge
```
User: /finish --merge

Agent:
## Finishing development work

[... same as above ...]

6. Merged PR #6789 with squash
7. Deleted branch docs-v2-issue6763

Done! PR merged successfully.
```

### Example 3: Plan added as comment (long PR description)
```
User: /finish

Agent:
## Finishing development work

### Prerequisites
- Branch: docs-v2-issue6763
- PLAN.md: Found
- PR description: 3200 characters (long)

### Actions:
1. Read full PLAN.md contents
2. PR description already long -- posted full plan as PR comment on #6789
3. Removed PLAN.md
4. Created commit: "chore: remove planning docs"
5. Pushed to origin

Ready for merge!
```

### Example 4: Incomplete tasks warning
```
User: /finish

Agent:
## Finishing development work

⚠️ Warning: PLAN.md has 2 incomplete tasks:
- [ ] Write unit tests
- [ ] Update documentation

Are you sure you want to finish? (yes/no)

User: yes

Agent: Proceeding with cleanup...
[continues with normal flow]
```

### Example 5: Dry run
```
User: /finish --dry-run

Agent:
## Finish Preview (dry run)

Would perform the following actions:
1. Read full PLAN.md contents
2. Add complete plan details to PR #6789 description (or comment)
3. Run: git rm PLAN.md
4. Run: git commit -m "chore: remove planning docs"
5. Run: git push

No changes made. Run `/finish` to execute.
```

## Notes

- Always reads full PLAN.md contents before deleting it
- Preserves complete plan details (not just a summary) in the PR for future reference
- If the PR description is short, appends plan details in a collapsible `<details>` block
- If the PR description is already long, posts the full plan as a PR comment instead
- Squash merge is recommended to keep main branch clean
- The deleted PLAN.md remains in branch history (recoverable if needed)
- Works with GitHub Actions cleanup as a fallback safety net
- Use `--no-pr-update` if you want to write the PR description manually
