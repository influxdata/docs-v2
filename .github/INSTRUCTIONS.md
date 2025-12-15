# AI Instructions Navigation Guide

This repository has multiple instruction files for different AI tools and use cases. This guide helps you find the right instructions for your needs.

## Quick Navigation

| If you are... | Use this file | Purpose |
|---------------|---------------|---------|
| **GitHub Copilot** | [copilot-instructions.md](copilot-instructions.md) | Primary instructions for coding agents, technical setup, build automation |
| **Claude, ChatGPT, Gemini** | [../AGENTS.md](../AGENTS.md) | Comprehensive guide for content creation, workflows, style guidelines |
| **Claude Desktop app** | [../CLAUDE.md](../CLAUDE.md) | Lightweight pointer with references to other resources |
| **Working on content files** | [instructions/content.instructions.md](instructions/content.instructions.md) | Auto-loaded for `content/**/*.md` files |
| **Working on layouts** | [instructions/layouts.instructions.md](instructions/layouts.instructions.md) | Auto-loaded for `layouts/**/*.html` files |
| **Working on API docs** | [instructions/api-docs.instructions.md](instructions/api-docs.instructions.md) | Auto-loaded for `api-docs/**/*.{yml,yaml}` files |
| **Working on JavaScript/TypeScript** | [instructions/assets.instructions.md](instructions/assets.instructions.md) | Auto-loaded for `assets/js/**/*.{js,ts}` files |

## Instruction File Organization

```
docs-v2/
├── .github/
│   ├── copilot-instructions.md        # PRIMARY - GitHub Copilot instructions
│   ├── INSTRUCTIONS.md                # THIS FILE - Navigation guide
│   ├── agents/
│   │   └── typescript-hugo-agent.md   # Custom specialist for TypeScript/Hugo work
│   └── instructions/
│       ├── content.instructions.md    # Auto-loaded for content files
│       ├── layouts.instructions.md    # Auto-loaded for layout files
│       ├── api-docs.instructions.md   # Auto-loaded for API doc files
│       └── assets.instructions.md     # Auto-loaded for JS/TS files
├── .claude/                           # Claude Desktop app configuration
│   ├── agents/                        # Specialized Claude agents
│   ├── commands/                      # Custom Claude commands
│   ├── skills/                        # Claude skills
│   └── settings.json                  # Claude app settings
├── AGENTS.md                          # Comprehensive guide for general AI assistants
└── CLAUDE.md                          # Pointer for Claude Desktop app
```

## File-Pattern Specific Instructions

GitHub Copilot automatically loads pattern-specific instructions based on the files you're editing:

| File Pattern | Instructions Loaded | Focus Area |
|--------------|---------------------|------------|
| `content/**/*.md` | [content.instructions.md](instructions/content.instructions.md) | Frontmatter, shortcodes, content guidelines |
| `layouts/**/*.html` | [layouts.instructions.md](instructions/layouts.instructions.md) | Hugo templates, shortcode implementation, testing |
| `api-docs/**/*.{yml,yaml}` | [api-docs.instructions.md](instructions/api-docs.instructions.md) | OpenAPI specifications, Redoc generation |
| `assets/js/**/*.{js,ts}` | [assets.instructions.md](instructions/assets.instructions.md) | TypeScript config, component architecture, debugging |

## Custom Specialist Agents

Use these for specialized, complex tasks:

| Agent | File | Best For |
|-------|------|----------|
| **TypeScript & Hugo Dev** | [agents/typescript-hugo-agent.md](agents/typescript-hugo-agent.md) | TypeScript migration, Hugo asset pipeline, component development |

**Note**: Additional Claude agents are available in [.claude/agents/](.claude/agents/) for Claude Desktop app users.

## General Documentation

For comprehensive reference documentation:

| Topic | File | Description |
|-------|------|-------------|
| **Testing** | [../DOCS-TESTING.md](../DOCS-TESTING.md) | Code block testing, link validation, style linting |
| **Contributing** | [../DOCS-CONTRIBUTING.md](../DOCS-CONTRIBUTING.md) | Full contribution workflow, style guide, conventions |
| **Frontmatter** | [../DOCS-FRONTMATTER.md](../DOCS-FRONTMATTER.md) | Complete page metadata reference |
| **Shortcodes** | [../DOCS-SHORTCODES.md](../DOCS-SHORTCODES.md) | Complete shortcode reference |
| **API Documentation** | [../api-docs/README.md](../api-docs/README.md) | OpenAPI workflow and generation |

## Choosing the Right Instructions

### For Code Changes (GitHub Copilot)
**Use**: [copilot-instructions.md](copilot-instructions.md)
- Quick command reference with timing estimates
- Build and test automation
- Network restrictions and troubleshooting
- Technical setup procedures

### For Content Writing (General AI Assistants)
**Use**: [../AGENTS.md](../AGENTS.md)
- Detailed content creation workflows
- Style guidelines and conventions
- Commit message format
- Common shortcode examples
- Browser-based editing workflow

### For Specific File Types
**Use**: Pattern-specific instructions in [instructions/](instructions/)
- Automatically loaded by Copilot
- Focused on specific file type requirements
- Links to relevant comprehensive documentation

### For Specialized Tasks
**Use**: Custom agents in [agents/](agents/) or [../.claude/agents/](../.claude/agents/)
- Deep expertise in specific domains
- Complex migration tasks
- Advanced development patterns

## Maintenance Notes

When updating instructions:

1. **Avoid duplication**: Link to comprehensive docs instead of copying content
2. **Keep it current**: Update all cross-references when moving content
3. **Be specific**: Include concrete examples and commands
4. **Test instructions**: Verify that file patterns and links work correctly
5. **Update this guide**: When adding new instruction files, add them to the tables above

## Getting Started

1. **New to the repository?** Start with [../README.md](../README.md) and [../DOCS-CONTRIBUTING.md](../DOCS-CONTRIBUTING.md)
2. **Using GitHub Copilot?** Read [copilot-instructions.md](copilot-instructions.md)
3. **Using other AI assistants?** Read [../AGENTS.md](../AGENTS.md)
4. **Using Claude Desktop?** Check [../CLAUDE.md](../CLAUDE.md) and [../.claude/](../.claude/)
5. **Working on specific file types?** The right instructions will auto-load, or check [instructions/](instructions/)
