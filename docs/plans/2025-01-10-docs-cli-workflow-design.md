# docs-cli-workflow Skill Design

## Overview

A Claude Code skill that guides when to use `docs create` and `docs edit` CLI tools versus direct file editing for InfluxData documentation.

## Problem

Claude under-utilizes the `docs create` and `docs edit` CLI tools even when they would provide significant value:

- Better scaffolding for multi-product content
- Context gathering (link extraction, structure analysis)
- Education about style guidelines and shortcodes
- Automatic file location from URLs

## Skill Identity

- **Name**: `docs-cli-workflow`
- **Location**: `.claude/skills/docs-cli-workflow/SKILL.md`
- **Scope**: Decision guidance only (not full workflow management)
- **Behavior**: Suggest and wait for user confirmation

## Activation

### Trigger Keywords

The skill activates when user messages contain:

- "new page", "new doc", "create documentation", "add a page"
- "edit this URL", "edit <https://docs>", "update this page" (with URL)
- "document this feature", "write docs for"
- "I have a draft", "from this draft"
- References to docs.influxdata.com URLs

### Non-Triggers (Direct Editing is Fine)

- "fix this typo in content/..."
- "update the frontmatter in..."
- Explicit file paths the user already knows
- Small edits to existing files user has open

## Decision Logic

### When to Suggest `docs create`

| Trigger                            | Why CLI is Better                                         |
| ---------------------------------- | --------------------------------------------------------- |
| Content targets multiple products  | CLI scaffolds shared content pattern automatically        |
| User unsure where page should live | CLI analyzes structure, suggests location                 |
| Draft references existing docs     | CLI extracts links, provides context to avoid duplication |
| User unfamiliar with conventions   | CLI prompt includes style guide, shortcode examples       |
| Complex new feature documentation  | CLI gathers product metadata, version info                |

### When to Suggest `docs edit`

| Trigger                                | Why CLI is Better                                      |
| -------------------------------------- | ------------------------------------------------------ |
| User provides docs.influxdata.com URL  | CLI finds source file(s) including shared content      |
| User doesn't know source file location | CLI maps URL → file path(s)                            |
| Page uses shared content               | CLI identifies both frontmatter file AND shared source |

### When to Skip CLI (Edit Directly)

| Scenario                         | Why Direct is Fine              |
| -------------------------------- | ------------------------------- |
| User provides explicit file path | They already know where to edit |
| Small typo/link fixes            | Overhead not worth it           |
| User says "just edit it"         | Explicit preference             |
| Frontmatter-only changes         | No content generation needed    |

## Suggestion Format

### For `docs create`

```
I'd recommend using the docs CLI for this:

npx docs create <draft-path> --products <product>

**Why**: [1-2 sentences explaining the specific benefit for this request]

Options:
1. **Use CLI** - I'll run the command and guide you through product selection
2. **Edit directly** - Skip the CLI, I'll create/edit files manually

Which do you prefer?
```

### For `docs edit`

```
I can use the docs CLI to find the source files for this page:

npx docs edit <url>

**Why**: [1-2 sentences - e.g., "This will locate the source file and any shared content it uses"]

Options:
1. **Use CLI** - I'll find and open the relevant files
2. **I know the file** - Tell me the path and I'll edit directly

Which do you prefer?
```

### Principles

- Show the actual command (educational)
- Explain *why* for this specific case
- Always offer the direct alternative
- Keep it brief - 4-6 lines max

## Edge Cases

| Edge Case                                | Behavior                                               |
| ---------------------------------------- | ------------------------------------------------------ |
| User already in a `docs create` workflow | Don't re-suggest                                       |
| URL points to non-existent page          | Suggest `docs create --url` instead of `docs edit`     |
| User provides both URL and draft         | Suggest `docs create --url <url> --from-draft <draft>` |
| User declines CLI twice in session       | Stop suggesting, note preference                       |

## Post-Confirmation Behavior

After user confirms they want to use the CLI:

1. Run the appropriate command
2. Let the CLI handle the rest (product selection, file generation, etc.)
3. No additional skill guidance needed

## Related Files

- `scripts/docs-cli.js` - Main CLI entry point
- `scripts/docs-create.js` - Content scaffolding implementation
- `scripts/docs-edit.js` - File finder implementation
- `scripts/lib/content-scaffolding.js` - Context preparation logic
