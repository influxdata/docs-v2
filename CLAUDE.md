# Instructions for InfluxData Documentation

> **For Claude with MCP**
> 
> This is a lightweight pointer file for Claude. For comprehensive instructions, see the files referenced below.
> 
> **Full instruction resources**:
> - [.github/copilot-instructions.md](.github/copilot-instructions.md) - For GitHub Copilot (technical setup, automation)
> - [AGENTS.md](AGENTS.md) - Shared project guidelines (style, constraints, content structure)
> - [.github/LABEL_GUIDE.md](.github/LABEL_GUIDE.md) - Label taxonomy and pipeline usage
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

## Design docs and implementation plans (superpowers skills)

The `superpowers:brainstorming` and `superpowers:writing-plans` skills default to
writing output under `docs/superpowers/specs/` and `docs/superpowers/plans/`.
Do **not** use those paths in this repo. Instead:

- **Implementation plan** → `PLAN.md` at the repo root. A CI workflow deletes
  `PLAN.md` before merging to `master`, so the plan stays visible on the branch
  during review but never lands in `master`.
- **Design spec** → if a design doc is genuinely useful post-merge, put it in
  an existing docs location (for example, `DOCS-*.md` or product-specific
  `content/` frontmatter). Otherwise skip committing it; keep the spec in the
  session only, or save it alongside `PLAN.md` on the branch so it gets
  scrubbed by the same workflow.

When a superpowers skill asks where to save a plan or spec, use `PLAN.md` (or
ask the user) — never write to `docs/superpowers/`.
