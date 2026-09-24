---
name: docs-cli-workflow
description: "Guides when to use the docs create/edit CLI tools versus direct file editing for InfluxData documentation. Use when deciding whether to scaffold new pages with docs create, open existing pages with docs edit, or edit Markdown files directly."
---

# docs CLI workflow

| Need                            | Use                                     |
| ------------------------------- | --------------------------------------- |
| Scaffold a page from a draft    | `docs create <draft> --products <keys>` |
| Locate or edit an existing page | `docs edit <url-or-path> --list`        |
| Edit shared content safely      | `docs edit <url-or-path>`               |
| Small known correction          | Direct edit                             |

Prerequisites: identify the product key in `data/products.yml` and inspect the
target before changing it. Commands are non-blocking by default; use `--wait`
only for an interactive editor. Use `docs --help` for options.

Load [references/cli-examples.md](references/cli-examples.md) only when command
selection needs examples or edge cases. Route content validation to
`../docs-testing/SKILL.md`.
