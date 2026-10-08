---
paths:
  - "content/**/*.md"
---

<!-- This file is auto-generated from .agents/instructions. Do not edit directly. -->

<!-- Run 'yarn build:agent:instructions' to regenerate it. -->

# Content files

Use [DOCS-FRONTMATTER.md](../../DOCS-FRONTMATTER.md) and
[DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md) as the syntax authority.
Use the [content-editing skill](../../.agents/skills/content-editing/SKILL.md) for workflow
and the [docs-cli-workflow skill](../../.agents/skills/docs-cli-workflow/SKILL.md) to select
the `docs` CLI or direct editing.

## Requirements

- Page frontmatter supplies `title`, `description`, appropriate `menu`, and
  page-level `weight` when it appears in navigation.
- Do not add a body h1. Use semantic line feeds, active present-tense second
  person, long CLI options, and `python` rather than `py` fences.
- Use `lp` for line protocol. Add `{lint="false"}` only to intentional invalid
  examples.
- Do not hardcode production docs URLs when a relative link or `relref` works.
- Shared files have no frontmatter. A stub's `source:` must begin `/shared/`.
  Direct shared edits require touching every source stub; `docs edit` finds them.
- Use resource-ownership language for import/write/load guidance and write
  recommendations in InfluxData's first-person plural voice.

Run `yarn verify:changed -- <files>` to select manual checks. See
[content/example.md](../../content/example.md) for working shortcode examples.
