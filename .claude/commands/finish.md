# Finish and Cleanup

Complete development work by cleaning up ephemeral documents and preparing for merge.

## Description

This skill handles the end of a development workflow:

1. Reads the full contents of PLAN.md
2. Preserves the plan as a PR comment, or promotes durable decision context to
   `docs/exec-plans/`
3. Removes ephemeral planning documents before the default-branch PR check runs
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
- `--no-comment`: Skip posting plan details as PR comment

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

### 3. Post Plan Details as PR Comment

By default, summarize the PLAN.md contents as a PR comment.
Include all important details so they are preserved
after the file is deleted. Always use a comment (not the PR description) to keep
the description clean and editable.

If the plan contains durable decision context, such as architectural, layout, or policy that should outlive the branch,
promote the relevant "why" to `docs/exec-plans/YYYY-MM-DD-slug.md` instead of
keeping the task checklist. Exec-plans are for rationale, rejected alternatives,
scope boundaries, and update instructions; PLAN.md remains the in-flight task
tracker.

```bash
# Summarize the full plan before posting.
PLAN_SUMMARY="<summary of objective, completed work, decisions, and follow-ups>"

gh pr comment --body "$(cat <<EOF
## Development Plan

Summary preserved from PLAN.md before cleanup:

---

${PLAN_SUMMARY}
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
2. Posted summarized plan as comment on PR #6789
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

### Example 3: Incomplete tasks warning

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

### Example 4: Dry run

```
User: /finish --dry-run

Agent:
## Finish Preview (dry run)

Would perform the following actions:
1. Read full PLAN.md contents
2. Post summarized plan as comment on PR #6789
3. Run: git rm PLAN.md
4. Run: git commit -m "chore: remove planning docs"
5. Run: git push

No changes made. Run `/finish` to execute.
```

## Notes

- Always reads full PLAN.md contents before deleting it
- Preserves summarized plan as a PR comment for future reference
- Always uses a PR comment, keeping the PR description clean and editable
- Squash merge is recommended to keep main branch clean
- The deleted PLAN.md remains in branch history (recoverable if needed)
- A GitHub Actions PR check blocks PLAN.md and HANDOVER.md from merging to the
  default branch
- Use `--no-comment` to skip posting plan details to the PR
