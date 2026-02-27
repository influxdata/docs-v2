# Plan Management

Manage the PLAN.md planning document for the current worktree.

## Description

This skill manages ephemeral planning documents that track objectives, tasks, and notes during development. PLAN.md lives inside the git worktree, is tracked on the feature branch, and should be deleted before merging to main.

## Usage

```
/plan                    # Display current PLAN.md
/plan create [issue-url] # Create new PLAN.md from template
/plan update             # Update task status interactively
/plan status             # Show task completion summary
```

## Subcommands

### /plan (default: read)

Display the current PLAN.md contents. If no PLAN.md exists, suggest creating one.

**Steps:**
1. Check if PLAN.md exists in current directory
2. If exists: display contents with syntax highlighting
3. If not exists: inform user and suggest `/plan create`

### /plan create [issue-url]

Create a new PLAN.md from template. Optionally fetch issue/PR details from GitHub.

**Arguments:**
- `issue-url` (optional): GitHub issue or PR URL to populate metadata

**Steps:**
1. Check if PLAN.md already exists (warn if overwriting)
2. If issue-url provided:
   - Parse org/repo/type/id from URL
   - Fetch issue/PR details with `gh issue view` or `gh pr view`
   - Populate Source section with metadata
3. If no issue-url:
   - Create blank template with placeholders
4. Write PLAN.md to current directory
5. Display the created file

**Template:**
```markdown
# [Title]

## Source

- **Repo**: [org/repo](https://github.com/org/repo)
- **Issue**: [#123](https://github.com/org/repo/issues/123)
- **Branch**: `branch-name`
- **Created**: YYYY-MM-DD

## Objective

<!-- What are we trying to accomplish? -->

## Tasks

- [ ] Task 1
- [ ] Task 2

## Notes

<!-- Research, decisions, blockers -->
```

### /plan update

Interactively update the PLAN.md - mark tasks complete, add notes, update objective.

**Steps:**
1. Read current PLAN.md
2. Parse existing tasks (checkbox items)
3. Ask user what to update:
   - Mark tasks as complete/incomplete
   - Add new tasks
   - Add notes to Notes section
   - Update objective
4. Write updated PLAN.md
5. Show diff of changes

### /plan status

Show a summary of task completion status.

**Steps:**
1. Read PLAN.md
2. Parse all checkbox items (`- [ ]` and `- [x]`)
3. Calculate completion stats
4. Display summary:
   ```
   ## Plan Status

   **Progress:** 3/5 tasks complete (60%)

   ### Completed
   - [x] Task 1
   - [x] Task 2
   - [x] Task 3

   ### Remaining
   - [ ] Task 4
   - [ ] Task 5
   ```

## Examples

### Example 1: Create plan for GitHub issue
```
User: /plan create https://github.com/influxdata/docs-v2/issues/6763

Agent: Created PLAN.md for issue #6763: "InfluxDB 3.9 Release Documentation"

# ISSUE 6763: InfluxDB 3.9 Release Documentation

## Source
- **Repo**: [influxdata/docs-v2](https://github.com/influxdata/docs-v2)
- **Issue**: [#6763](https://github.com/influxdata/docs-v2/issues/6763)
- **Branch**: `docs-v2-issue6763`
- **Created**: 2026-02-10

## Objective
<!-- What are we trying to accomplish? -->

## Tasks
- [ ] Task 1
- [ ] Task 2

## Notes
<!-- Research, decisions, blockers -->
```

### Example 2: Check status
```
User: /plan status

Agent:
## Plan Status

**Progress:** 2/4 tasks complete (50%)

### Completed
- [x] Review issue requirements
- [x] Set up development environment

### Remaining
- [ ] Implement feature
- [ ] Write tests
```

### Example 3: Update tasks
```
User: /plan update

Agent: Current tasks in PLAN.md:
1. [ ] Review issue requirements
2. [ ] Set up development environment
3. [ ] Implement feature
4. [ ] Write tests

What would you like to update?
- Mark tasks complete (e.g., "1, 2")
- Add new task
- Add note

User: Mark 1 and 2 complete, add note "Decided to use React for the UI"

Agent: Updated PLAN.md:
- Marked "Review issue requirements" as complete
- Marked "Set up development environment" as complete
- Added note: "Decided to use React for the UI"
```

## Notes

- PLAN.md is ephemeral - delete before merging to main
- Use `/finish` skill to properly cleanup and merge
- Tasks use standard markdown checkbox format: `- [ ]` and `- [x]`
- A startup hook can be configured to auto-inject PLAN.md at session start
