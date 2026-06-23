# InfluxData Documentation Repository (docs-v2)

> **For GitHub Copilot and other AI coding agents**

This is Copilot's pointer file. Shared, harness-neutral instructions —
commands, style, constraints, content structure, and where detailed guidance
lives — come from [AGENTS.md](../AGENTS.md). Only Copilot-specific
configuration belongs here.

## Instruction resources

- [AGENTS.md](../AGENTS.md) — shared project guidelines (start here)
- [.agents/](../.agents/) — canonical agent skills and path-specific instruction sources
- [.github/instructions/](instructions/) — pattern-specific instructions, auto-loaded by file type (see table below)
- [.github/LABEL\_GUIDE.md](LABEL_GUIDE.md) — label taxonomy and review pipeline

## File pattern-specific instructions

GitHub Copilot auto-loads these based on the files you change. They are
generated from `.agents/instructions/`; edit the canonical source and run
`yarn build:agent:instructions` to regenerate them.

| Pattern                  | File                                                                          | Description                                      |
| ------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------ |
| `content/**/*.md`        | [content.instructions.md](instructions/content.instructions.md)               | Content file guidelines, frontmatter, shortcodes |
| `content/**/*.md`        | [content-review.instructions.md](instructions/content-review.instructions.md) | Review criteria for content changes              |
| `layouts/**/*.html`      | [layouts.instructions.md](instructions/layouts.instructions.md)               | Shortcode implementation patterns and testing    |
| `api-docs/**/*.yml`      | [api-docs.instructions.md](instructions/api-docs.instructions.md)             | OpenAPI spec workflow                            |
| `assets/js/**/*.{js,ts}` | [assets.instructions.md](instructions/assets.instructions.md)                 | TypeScript/JavaScript and CSS development        |
