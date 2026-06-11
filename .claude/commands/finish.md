# Finish and Merge

Complete development work and prepare for merge.

## Description

This command handles the end of a development workflow:
1. Verifies no uncommitted changes
2. Checks for exec-plans in `docs/exec-plans/active/` and moves them to `completed/`
3. Optionally merges the PR

## Usage

```
/finish              # Prepare for merge
/finish --merge      # Merge with squash
/finish --dry-run    # Show what would happen without making changes
```

## Arguments

- `--merge`: After preparation, merge the PR using `gh pr merge --squash`
- `--dry-run`: Preview actions without executing them

## Steps

### 1. Verify Prerequisites

Check that we're ready to finish:
- Confirm we're in a git worktree (not main branch)
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

### 2. Move Active Exec-Plans to Completed

If there are any exec-plans in `docs/exec-plans/active/` related to this PR,
move them to `docs/exec-plans/completed/` and update their status line.

```bash
# Check for active exec-plans
ls docs/exec-plans/active/*.md 2>/dev/null

# Move to completed and update status
# (Manual step - agent should identify relevant plans by PR number in the file)
```

### 3. Merge (if --merge flag)

```bash
gh pr merge --squash --delete-branch
```

## Edge Cases

### Uncommitted changes
- Warn user about uncommitted changes
- Ask for confirmation before proceeding
- Suggest committing or stashing first

### No open PR
- Warn: "No open PR found for this branch"
- Skip merge step

### Active exec-plans present
- List the active exec-plans
- Ask if they should be moved to completed
- Update status line from "In review" to "Merged YYYY-MM-DD"

## Examples

### Example 1: Standard finish
```
User: /finish

Agent:
## Finishing development work

### Prerequisites
- Branch: docs-v2-issue6763
- Uncommitted changes: None
- Open PR: #6789
- Active exec-plans: 1 (docs/exec-plans/active/2026-02-10-influxdb-3.9-docs.md)

Ready for merge! Run `/finish --merge` or merge manually.
```

### Example 2: Finish with merge
```
User: /finish --merge

Agent:
## Finishing development work

### Prerequisites
- Branch: docs-v2-issue6763
- Uncommitted changes: None
- Open PR: #6789

### Actions:
1. Moved exec-plan to docs/exec-plans/completed/
2. Updated status to "Merged 2026-02-10"
3. Merged PR #6789 with squash
4. Deleted branch docs-v2-issue6763

Done! PR merged successfully.
```

### Example 3: Dry run
```
User: /finish --dry-run

Agent:
## Finish Preview (dry run)

Would perform the following actions:
1. Move docs/exec-plans/active/2026-02-10-influxdb-3.9-docs.md to completed/
2. Update status line to "Merged YYYY-MM-DD"
3. Merge PR #6789 with squash

No changes made. Run `/finish` to execute.
```

## Notes

- Squash merge is recommended to keep main branch clean
- Exec-plans in `docs/exec-plans/active/` should be moved to `completed/` when merged
- For durable decision records, use exec-plans — see [exec-plan-writing skill](../skills/exec-plan-writing/SKILL.md)
