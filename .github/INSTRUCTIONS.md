# AI Instructions Navigation Guide

This repository has multiple instruction files for different AI tools and use cases. This guide helps you find the right instructions for your needs.

## Quick Navigation

| If you are... | Use this file | Purpose |
|---------------|---------------|---------|
| **GitHub Copilot** | [copilot-instructions.md](copilot-instructions.md) | Primary instructions for coding agents, technical setup, build automation |
| **Claude, ChatGPT, Gemini** | [../AGENTS.md](../AGENTS.md) | Comprehensive guide for content creation, workflows, style guidelines |
| **Claude with MCP** | [../CLAUDE.md](../CLAUDE.md) | Lightweight pointer with references to other resources |

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
├── .claude/                           # Claude MCP configuration
│   ├── agents/                        # Specialized agents for Claude
│   ├── commands/                      # Custom commands for Claude
│   ├── skills/                        # Claude skills
│   └── settings.json                  # Claude settings
├── AGENTS.md                          # Comprehensive guide for general AI assistants
└── CLAUDE.md                          # Pointer for Claude with MCP
```

## What's in Each File

**[copilot-instructions.md](copilot-instructions.md)** - The primary instruction file with:
- Quick command reference
- Setup and testing procedures
- Repository structure
- Content guidelines and style
- File pattern-specific instructions (auto-loaded)
- Custom specialist agents
- General documentation references

**[../AGENTS.md](../AGENTS.md)** - Comprehensive guide for general AI assistants with:
- Detailed content creation workflows
- Common shortcode examples
- Commit message format
- Browser-based editing workflow

**[../CLAUDE.md](../CLAUDE.md)** - Lightweight pointer to other instruction resources

**[instructions/](instructions/)** - Auto-loaded pattern-specific instructions:
- `content.instructions.md` - For Markdown content files
- `layouts.instructions.md` - For Hugo template files
- `api-docs.instructions.md` - For OpenAPI spec files
- `assets.instructions.md` - For JavaScript/TypeScript files

**[agents/](agents/)** - Custom specialist agents for complex tasks

**[../.claude/](../.claude/)** - Claude MCP configuration with specialized agents and commands

## Choosing the Right Instructions

- **GitHub Copilot?** → [copilot-instructions.md](copilot-instructions.md)
- **General AI assistants?** → [../AGENTS.md](../AGENTS.md)
- **Claude with MCP?** → [../CLAUDE.md](../CLAUDE.md) and [../.claude/](../.claude/)

## Getting Started

1. **New to the repository?** Start with [../README.md](../README.md)
2. **Using GitHub Copilot?** Read [copilot-instructions.md](copilot-instructions.md)
3. **Using other AI assistants?** Read [../AGENTS.md](../AGENTS.md)
4. **Using Claude with MCP?** Check [../CLAUDE.md](../CLAUDE.md) and [../.claude/](../.claude/)
