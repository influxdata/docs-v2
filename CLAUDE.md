# Instructions for InfluxData Documentation

@AGENTS.md

This is Claude's pointer file. Shared, harness-neutral instructions come from
`AGENTS.md` above. Only Claude-specific setup belongs here.

## Documentation MCP server (Claude Code setup)

This repo's [`.mcp.json`](.mcp.json) defines the InfluxDB docs search server.
See "Documentation search (MCP)" in `AGENTS.md` for when to use it.

- **`influxdb-docs`** — API key auth. Set `INFLUXDATA_DOCS_KAPA_API_KEY` before
  launching Claude Code.
- **`influxdb-docs-oauth`** — OAuth fallback. No setup needed.

See the [content-editing skill](.agents/skills/content-editing/SKILL.md#part-4-fact-checking-with-the-documentation-mcp-server)
for usage details.

## Plan paths (superpowers override)

The `superpowers:brainstorming` and `superpowers:writing-plans` skills default
to `docs/superpowers/`. Do **not** use that path here — follow "Plans and
design docs" in `AGENTS.md` (`PLAN.md` at the repo root).
