---
name: docs-cli-workflow
description: Guides when to use docs create/edit CLI tools versus direct file editing for InfluxData documentation.
author: InfluxData
version: "1.0"
---

# docs CLI Workflow Guidance

## Purpose

Help recognize when to suggest `docs create` or `docs edit` CLI tools instead of direct file editing.
These tools provide scaffolding, context gathering, and education about conventions that direct editing misses.

## When This Skill Applies

Check for these trigger keywords in user messages:

- "new page", "new doc", "create documentation", "add a page"
- "edit this URL", "edit <https://docs>", "update this page" (with a URL)
- "document this feature", "write docs for"
- "I have a draft", "from this draft"
- Any docs.influxdata.com URL

**Skip this skill when:**

- User provides an explicit file path (e.g., "fix typo in content/influxdb3/...")
- Small fixes (typos, broken links)
- User says "just edit it" or similar
- Frontmatter-only changes

## Decision: Which Tool to Suggest

### Suggest `docs create` when

| Trigger                                | Why CLI is better                                         |
| -------------------------------------- | --------------------------------------------------------- |
| Content targets multiple products      | CLI scaffolds shared content pattern automatically        |
| User unsure where page should live     | CLI analyzes structure, suggests location                 |
| Draft references existing docs         | CLI extracts links, provides context to avoid duplication |
| User seems unfamiliar with conventions | CLI prompt includes style guide, shortcode examples       |
| Complex new feature documentation      | CLI gathers product metadata, version info                |

### Suggest `docs edit` when

| Trigger                                | Why CLI is better                                      |
| -------------------------------------- | ------------------------------------------------------ |
| User provides docs.influxdata.com URL  | CLI finds source file(s) including shared content      |
| User doesn't know source file location | CLI maps URL to file path(s)                           |
| Page uses shared content               | CLI identifies both frontmatter file AND shared source |

### Edit directly when

| Scenario                         | Why direct is fine              |
| -------------------------------- | ------------------------------- |
| User provides explicit file path | They already know where to edit |
| Small typo/link fixes            | CLI overhead not worth it       |
| User says "just edit it"         | Explicit preference to skip CLI |
| Frontmatter-only changes         | No content generation needed    |

## How to Suggest

When a trigger is detected, present a concise recommendation and wait for confirmation.

### For `docs create`

```
I'd recommend using the docs CLI for this:

npx docs create <draft-path> --products <product>

**Why**: [1-2 sentences explaining the specific benefit]

Options:
1. **Use CLI** - I'll run the command and guide you through product selection
2. **Edit directly** - Skip the CLI, I'll create/edit files manually

Which do you prefer?
```

### For `docs edit`

```
I can use the docs CLI to find the source files for this page:

docs edit <url-or-path>

**Why**: [1-2 sentences explaining the benefit]

Options:
1. **Use CLI** - I'll find and list the relevant files (non-blocking)
2. **I know the file** - Tell me the path and I'll edit directly

Which do you prefer?
```

### Key principles

- Show the actual command (educational)
- Explain *why* for this specific case
- Always offer the direct alternative
- Keep it brief (4-6 lines max)
- **Wait for user confirmation before running**

## Edge Cases

| Situation                           | Behavior                                                 |
| ----------------------------------- | -------------------------------------------------------- |
| Already in a `docs create` workflow | Don't re-suggest                                         |
| URL points to non-existent page     | Suggest `docs create --url <url>` instead of `docs edit` |
| User provides both URL and draft    | Suggest `docs create --url <url> --from-draft <draft>`   |
| User declines CLI twice in session  | Stop suggesting, respect preference                      |

## After User Confirms

Run the appropriate command and let the CLI handle the rest.
No additional guidance needed—the CLI manages product selection, file generation, and context gathering.

## CLI Reference

The unified `docs` CLI includes all documentation tooling commands:

```bash
# CREATE: Create new documentation from a draft
docs create <draft-path> --products <product-key>
docs create <draft-path> --products <product-key> --open        # Non-blocking
docs create <draft-path> --products <product-key> --open --wait # Blocking
docs create --url <url> --from-draft <draft-path>              # Create at URL

# EDIT: Find and edit existing documentation
docs edit <url-or-path>                  # Non-blocking, agent-friendly
docs edit <url-or-path> --list           # List files without opening
docs edit <url-or-path> --wait           # Block until editor closes
docs edit <url-or-path> --editor nano    # Use specific editor

# PLACEHOLDERS: Add placeholder syntax to code blocks
docs placeholders <file.md>              # Add { placeholders="PATTERN" } syntax
docs placeholders <file.md> --dry        # Preview changes without writing

# AUDIT: Audit documentation coverage
docs audit core v3.9                     # Audit InfluxDB Core docs
docs audit enterprise v3.9               # Audit Enterprise docs
docs audit telegraf v1.33                # Audit Telegraf plugin docs

# RELEASE-NOTES: Generate release notes from commits
docs release-notes v3.1.0 v3.2.0 ~/repos/influxdb

# Examples
docs edit https://docs.influxdata.com/influxdb3/core/admin/databases/
docs edit /influxdb3/core/admin/databases/
docs placeholders content/influxdb3/core/admin/databases/create.md
docs audit core main
```

**Editor Selection** (checked in order):
1. `--editor` flag
2. `DOCS_EDITOR` environment variable
3. `VISUAL` environment variable
4. `EDITOR` environment variable
5. System default

**Important for AI Agents**: 
- Both `docs edit` and `docs create --open` commands are non-blocking by default (launch editor in background and exit immediately)
- This prevents agents from hanging while waiting for user editing
- Use `--wait` only when you need to block until editing is complete
- For `docs create`, omit `--open` to skip editor entirely (files are created and CLI exits)

For full CLI documentation, run `npx docs --help`.

## Related Skills

- **hugo-template-dev** - For Hugo template syntax, data access patterns, and runtime testing
- **cypress-e2e-testing** - For running and debugging Cypress E2E tests
- **ts-component-dev** (agent) - TypeScript component behavior and interactivity
