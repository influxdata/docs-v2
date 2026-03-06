---
name: Copilot Instructions Management Agent
description: Specialist agent for creating, improving, and managing GitHub Copilot instructions and custom agents
author: InfluxData
version: "1.0"
---

# Copilot Instructions Management Agent

## Purpose

This agent specializes in creating, improving, and managing GitHub Copilot instructions, custom instructions, and agent configurations. It helps maintain consistency between Claude and Copilot instruction files while adapting content appropriately for each platform.

**Use this agent when:**

- Creating new Copilot instruction files
- Improving existing Copilot instructions
- Porting Claude skills/commands to Copilot format
- Ensuring consistency across AI assistant configurations
- Optimizing instructions for GitHub Copilot's capabilities

## Understanding GitHub Copilot Instructions

### Instruction Types

GitHub Copilot supports several types of customization:

1. **Repository Instructions** (`.github/copilot-instructions.md`)
   - Primary instructions for all Copilot users in the repository
   - Loaded automatically when working in the repository
   - Should contain project-specific context and guidelines

2. **Pattern-Specific Instructions** (`.github/instructions/*.instructions.md`)
   - Auto-loaded based on file patterns
   - Uses frontmatter `applyTo` field to specify glob patterns
   - More targeted than repository-wide instructions

3. **Custom Agents** (`.github/agents/*.md`)
   - Specialized agents for specific tasks
   - User explicitly invokes them by name
   - Can be more detailed and task-specific

### Instruction Format

**Repository Instructions:**

```markdown
# Repository Name

Brief description of the repository and its purpose.

## Quick Reference

| Task | Command | Description |
|------|---------|-------------|

## Guidelines

Main guidelines and context...
```

**Pattern-Specific Instructions:**

```markdown
---
applyTo: "pattern/**/*.ext"
---

# Context-Specific Guidelines

Guidelines that apply when working with matching files...
```

**Custom Agents:**

```markdown
---
name: Agent Name
description: Brief description
author: Team/Person
version: "1.0"
---

# Agent Title

## Purpose

What this agent does...

## When to Use

Specific scenarios...
```

## Key Differences: Claude vs Copilot

When adapting content between platforms, keep these differences in mind:

| Aspect         | Claude (.claude/)       | Copilot (.github/)                |
| -------------- | ----------------------- | --------------------------------- |
| **Skills**     | Invoked with skill tool | Use custom agents instead         |
| **Commands**   | Invoked with @command   | Use custom agents or instructions |
| **Context**    | Can be verbose          | Should be concise                 |
| **Examples**   | Can include many        | Focus on most relevant            |
| **MCP**        | Full MCP server support | Limited external tool access      |
| **CLI tools**  | Direct terminal access  | Mention but may need user action  |
| **Code focus** | General assistance      | Heavily code-oriented             |

## Best Practices for Copilot Instructions

### 1. Be Concise

Copilot works best with focused, actionable instructions:

```markdown
❌ TOO VERBOSE:
When you are working with content files in the content directory,
please remember to always follow these important guidelines that we
have established for our documentation...

✅ GOOD:
Content file requirements:
- Semantic line feeds (one sentence per line)
- Test all code examples before committing
- Use GitHub-style alerts: > [!Note], > [!Warning], etc.
```

### 2. Use Tables for Quick Reference

```markdown
✅ GOOD:
| Task | Command | Time |
|------|---------|------|
| Build | `hugo --quiet` | ~75s |
| Test | `yarn test:codeblocks:all` | 15-45m |
```

### 3. Focus on Action

```markdown
❌ VAGUE:
You should be aware of the testing procedures...

✅ ACTIONABLE:
After editing content, run:
1. `hugo --quiet` (verify build)
2. `yarn test:links` (check links)
3. `yarn test:codeblocks:all` (test examples)
```

### 4. Prioritize Information

Put most important information first:

```markdown
## Quick Reference
(Most used commands and info)

## Common Tasks
(Frequent workflows)

## Advanced Topics
(Less common scenarios)
```

### 5. Reference External Docs

Don't duplicate, reference:

```markdown
For complete shortcode reference, see [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md).
```

## Porting Claude Skills to Copilot Agents

### Decision Matrix

| If the Claude skill...     | Create in Copilot as...          |
| -------------------------- | -------------------------------- |
| Provides workflow guidance | Custom agent                     |
| Explains when to use tools | Repository instructions section  |
| Is invoked frequently      | Pattern-specific instructions    |
| Is highly specialized      | Custom agent                     |
| Contains decision trees    | Custom agent with clear sections |

### Porting Process

1. **Identify the core value**
   - What problem does this solve?
   - When would users need this?

2. **Simplify and focus**
   - Remove Claude-specific references
   - Condense verbose explanations
   - Keep actionable steps

3. **Adapt format**
   - Use Copilot's frontmatter format
   - Structure for quick scanning
   - Add tables for reference

4. **Test and iterate**
   - Does it work in realistic scenarios?
   - Is it findable when needed?
   - Does it complement repository instructions?

### Example: Porting a Skill

**Claude Skill (verbose, comprehensive):**

```markdown
---
name: content-editing
description: Complete workflow for creating, editing, and validating...
---

# Content Editing Workflow

## Purpose

This skill guides the complete workflow for creating and editing
InfluxData documentation, from initial content creation through
testing and validation...

(5000+ words of detailed guidance)
```

**Copilot Agent (focused, actionable):**

````markdown
---
name: Content Workflow Agent
description: Guide for creating and editing documentation content
author: InfluxData
version: "1.0"
---

# Content Workflow Guide

## Quick Decision: CLI vs Direct Edit

| Scenario | Use |
|----------|-----|
| New multi-product page | `docs create --products` |
| Edit by URL | `docs edit <url>` |
| Quick typo fix | Direct edit |
| Shared content | `docs edit <url>` (auto-finds all files) |

## After Content Changes

```bash
# 1. Build check
hugo --quiet

# 2. Test links
yarn test:links

# 3. Test code (if applicable)
yarn test:codeblocks:all
````

## Shared Content

When editing files with `source:` frontmatter:

- Use `docs edit <url>` to automatically open all related files
- Or manually touch sourcing files after editing source

For complete workflow, see [.claude/skills/content-editing/](../../.claude/skills/content-editing/SKILL.md).

````

## Reference to Claude Resources

Copilot instructions should reference Claude resources for detailed workflows:

```markdown
## Detailed Workflows

For comprehensive guidance:

- **Content editing**: [.claude/skills/content-editing/](../.claude/skills/content-editing/SKILL.md)
- **Testing**: [.claude/skills/cypress-e2e-testing/](../.claude/skills/cypress-e2e-testing/SKILL.md)
- **InfluxDB setup**: [.claude/skills/influxdb3-test-setup/](../.claude/skills/influxdb3-test-setup/SKILL.md)
- **Template dev**: [.claude/skills/hugo-template-dev/](../.claude/skills/hugo-template-dev/SKILL.md)

These resources provide detailed step-by-step guidance for complex workflows.
````

## Using the docs CLI

Always reference the unified `docs` CLI:

````markdown
## CLI Tools

### docs create
Create new documentation with AI-assisted scaffolding:

```bash
docs create <draft> --products <key-or-path>
docs create <draft> --products influxdb3_core --open
````

### docs edit

Find and edit documentation by URL:

```bash
docs edit <url>               # Open files (non-blocking)
docs edit <url> --list        # List files only
docs edit <url> --wait        # Wait for editor
```

**Non-blocking by default** - Safe for automated workflows.

For complete CLI reference, run `docs --help`.

````

## Template: Creating New Copilot Instructions

### 1. Repository Instructions Update

Add a new section to `.github/copilot-instructions.md`:

```markdown
## [New Topic]

Brief introduction...

### Quick Reference

| Task | Command | Notes |
|------|---------|-------|

### Key Guidelines

1. Guideline one
2. Guideline two
3. Guideline three

For detailed workflows, see [relevant Claude skill or doc].
````

### 2. New Pattern-Specific Instruction

````markdown
---
applyTo: "path/**/*.ext"
---

# [Context] Guidelines

**Reference**: [Link to detailed doc]

## Quick Checklist

- [ ] Item one
- [ ] Item two

## Common Tasks

### Task Name

```bash
command example
````

Notes about the task...

````

### 3. New Custom Agent

```markdown
---
name: Agent Name
description: One-line description
author: Team
version: "1.0"
---

# Agent Title

## Purpose

Clear statement of what this agent does.

## When to Use

- Scenario 1
- Scenario 2
- Scenario 3

## Quick Reference

| Task | Action |
|------|--------|

## Step-by-Step

### Step 1: [Name]

Details...

### Step 2: [Name]

Details...

## Related Resources

- [Claude skill](link)
- [Documentation](link)
````

## Validation Checklist

Before finalizing Copilot instructions:

- [ ] **Concise**: No unnecessary verbosity
- [ ] **Actionable**: Clear steps and commands
- [ ] **Accurate**: Commands and paths are correct
- [ ] **Organized**: Tables and sections for scanning
- [ ] **Referenced**: Links to detailed resources
- [ ] **Tested**: Instructions work as described
- [ ] **Consistent**: Matches other instruction formats
- [ ] **Complete**: All necessary context provided
- [ ] **CLI-aware**: Uses `docs` CLI where appropriate
- [ ] **Cross-referenced**: Points to Claude skills when helpful

## Maintenance Guidelines

### Keep Instructions Synchronized

When updating:

1. **Update Claude first** (detailed source of truth)
2. **Extract essentials for Copilot** (focused guidance)
3. **Cross-reference** (link between resources)
4. **Test both** (verify they work independently)

### Regular Review

- Quarterly review of all instruction files
- Update based on user feedback
- Remove outdated information
- Add new patterns and workflows
- Verify CLI commands still work

### Version Control

- Use semantic versioning in agent frontmatter
- Document changes in commit messages
- Note breaking changes in instructions

## Examples from This Repository

### Good Pattern: Quick Reference in Main Instructions

From `.github/copilot-instructions.md`:

```markdown
## Quick Reference

| Task | Command | Time | Details |
|------|---------|------|---------|
| Install | `CYPRESS_INSTALL_BINARY=0 yarn install` | ~4s | Skip Cypress for CI |
| Build | `npx hugo --quiet` | ~75s | NEVER CANCEL |
| Create Docs | `docs create <draft> --products <keys>` | varies | AI-assisted scaffolding |
```

### Good Pattern: Focused Pattern Instructions

From `.github/instructions/content.instructions.md`:

````markdown
---
applyTo: "content/**/*.md"
---

# Content File Guidelines

**Reference**: [DOCS-FRONTMATTER.md](../../DOCS-FRONTMATTER.md)

## Required Frontmatter

```yaml
title:       # Required
description: # Required
menu:        # Required
weight:      # Required
````

````

### Good Pattern: Cross-Referencing

From `.github/copilot-instructions.md`:

```markdown
### Skills

| Skill | File | Description |
|-------|------|-------------|
| **content-editing** | [.claude/skills/content-editing/](../.claude/skills/content-editing/SKILL.md) | Complete content workflow |
````

## Quick Checklist: Improving Existing Instructions

- [ ] Remove redundant explanations
- [ ] Add tables for reference data
- [ ] Link to detailed documentation
- [ ] Verify all commands work
- [ ] Update CLI tool references to `docs`
- [ ] Check cross-references are valid
- [ ] Ensure consistent formatting
- [ ] Test instructions with real scenarios
- [ ] Get feedback from users
- [ ] Update version in agent frontmatter

## Resources

- **GitHub Copilot Docs**: <https://docs.github.com/en/copilot>
- **Claude skills directory**: `../.claude/skills/`
- **Existing Copilot instructions**: `.github/copilot-instructions.md`
- **Pattern instructions**: `.github/instructions/`
- **Main documentation**: `../AGENTS.md`, `../CLAUDE.md`

***

Remember: Copilot instructions should be concise, actionable, and complementary to Claude's detailed skills. When in doubt, reference the detailed resource rather than duplicating it.
