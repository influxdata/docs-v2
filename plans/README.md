# Documentation Plans

This directory contains plans for recurring documentation tasks and automation.

## Active Plans

### CLI Documentation Synchronization
- **Location**: `cli-docs-sync/`
- **Purpose**: Keep InfluxDB 3 CLI reference documentation in sync with actual CLI commands
- **Current Version**: `plan-v3.2.0.md`
- **Status**: Ready for execution

### Release Notes Automation
- **Location**: `release-notes-automation/`
- **Purpose**: Automate generation of release notes from git commits
- **Scripts**: Available in `/scripts/generate-release-notes.sh`

## Plan Structure

Each plan directory should contain:
- `plan-[version].md` - The detailed plan
- `execution-log.md` - Track progress and notes
- `templates/` - Reusable templates and patterns

## Usage for Claude

When working with Claude on these plans:
1. Reference the specific plan file: `@plans/[task]/plan-[version].md`
2. Update execution logs as you progress
3. Iterate on plans by creating new versions
4. Use templates for consistency

## Best Practices

- Keep plans versioned by release or iteration
- Document lessons learned in execution logs
- Create reusable templates for recurring patterns
- Link plans to related scripts and automation