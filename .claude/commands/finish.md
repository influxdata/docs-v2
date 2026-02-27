# Finish and Cleanup

Complete development work by cleaning up ephemeral documents and preparing for merge.

## Description

This skill handles the end of a development workflow:
1. Extracts key information from PLAN.md
2. Updates the PR description with a summary
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

### 2. Extract Summary from PLAN.md

Parse PLAN.md to extract:
- Title and objective
- Completed tasks
- Key notes/decisions

**Summary format:**
```markdown
## Summary

[Objective from PLAN.md]

### Completed
- [x] Task 1
- [x] Task 2
- [x] Task 3

### Key Decisions
- [Notable items from Notes section]
```

### 3. Update PR Description

Append or update the PR description with the summary:

```bash
# Get current PR body
gh pr view --json body -q '.body'

# Update PR with summary
gh pr edit --body "$(cat <<'EOF'
[Original body]

---

## Work Summary

[Extracted summary from PLAN.md]
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

### Prerequisites ✓
- Branch: docs-v2-issue6763
- PLAN.md: Found
- Uncommitted changes: None
- Open PR: #6789

### Summary extracted from PLAN.md:
- 4/4 tasks completed
- Objective: Document InfluxDB 3.9 release features

### Actions:
1. ✓ Updated PR #6789 description with summary
2. ✓ Removed PLAN.md
3. ✓ Created commit: "chore: remove planning docs"
4. ✓ Pushed to origin

Ready for merge! Run `/finish --merge` or merge manually.
```

### Example 2: Cleanup with merge
```
User: /finish --merge

Agent:
## Finishing development work

[... same as above ...]

5. ✓ Merged PR #6789 with squash
6. ✓ Deleted branch docs-v2-issue6763

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
1. Update PR #6789 description with summary from PLAN.md
2. Run: git rm PLAN.md
3. Run: git commit -m "chore: remove planning docs"
4. Run: git push

No changes made. Run `/finish` to execute.
```

## Notes

- Always extracts summary before deleting PLAN.md
- Squash merge is recommended to keep main branch clean
- The deleted PLAN.md remains in branch history (recoverable if needed)
- Works with GitHub Actions cleanup as a fallback safety net
- Use `--no-pr-update` if you want to write the PR description manually
