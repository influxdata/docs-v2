# Context Files for LLMs and AI Tools 

This directory contains plans, reports, and other context files that are:
- Used to provide context to LLMs during development
- Not committed to the repository
- May be transient or belong in other repositories

## Directory Structure

- `plans/` - Documentation plans and roadmaps
- `reports/` - Generated reports and analyses
- `research/` - Research notes and findings
- `templates/` - Reusable templates for Claude interactions

## Usage

Place files here that you want to reference--for example, using @ mentions in Claude--such as:
- Documentation planning documents
- API migration guides
- Performance reports
- Architecture decisions

## Example Structure

```
.context/
├── plans/
│   ├── v3.2-release-plan.md
│   └── api-migration-guide.md
├── reports/
│   ├── weekly-progress-2025-07.md
│   └── pr-summary-2025-06.md
├── research/
│   └── competitor-analysis.md
└── templates/
    └── release-notes-template.md
```

## Best Practices

1. Use descriptive filenames that indicate the content and date
2. Keep files organized in appropriate subdirectories
3. Consider using date prefixes for time-sensitive content (e.g., `2025-07-01-meeting-notes.md`)
4. Remove outdated files periodically to keep the context relevant