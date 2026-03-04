# Instructions for InfluxData Documentation

> **For Claude with MCP**
> 
> This is a lightweight pointer file for Claude. For comprehensive instructions, see the files referenced below.
> 
> **Full instruction resources**:
> - [.github/copilot-instructions.md](.github/copilot-instructions.md) - For GitHub Copilot (technical setup, automation)
> - [AGENTS.md](AGENTS.md) - For general AI assistants (content creation, workflows, style guidelines)
> - [.claude/](.claude/) - Claude MCP configuration directory with:
>   - Custom commands in `.claude/commands/`
>   - Specialized agents in `.claude/agents/`
>   - Custom skills in `.claude/skills/`

## Documentation MCP server

This repo includes [`.mcp.json`](.mcp.json) with a hosted InfluxDB documentation search server.
Use it to verify technical accuracy, check API syntax, and find related docs.

- **`influxdb-docs`** — API key auth. Set `INFLUXDATA_DOCS_KAPA_API_KEY` env var before launching Claude Code.
- **`influxdb-docs-oauth`** — OAuth fallback. No setup needed.

See [content-editing skill](.claude/skills/content-editing/SKILL.md#part-4-fact-checking-with-the-documentation-mcp-server) for usage details.

## Purpose and scope

Claude should help document InfluxData products by creating clear, accurate technical content with proper code examples, frontmatter, and formatting.

## Project overview

See @README.md

## Available NPM commands

@package.json

## Instructions for contributing

See @.github/copilot-instructions.md for style guidelines and
product-specific documentation paths and URLs managed in this project.

See @DOCS-CONTRIBUTING.md for essential InfluxData
documentation contributing guidelines, such as style and
formatting, and commonly used shortcodes.

See @DOCS-TESTING.md for comprehensive testing information, including code block
testing, link validation, style linting, and advanced testing procedures.

See @api-docs/README.md for information about the API reference documentation, how to
generate it, and how to contribute to it.
