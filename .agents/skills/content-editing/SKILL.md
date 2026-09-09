---
name: content-editing
description: "Create, edit, and validate InfluxData documentation. Manages Hugo shared content across InfluxDB products, runs Vale style linting and Hugo builds, validates frontmatter and code blocks, and fact-checks via the documentation MCP server. Use when creating new doc pages, editing markdown .md files, managing shared content, running Vale or Hugo builds, or testing InfluxDB, Telegraf, or Flux documentation."
---

# Content editing

Use this skill for Markdown content. It routes work; it does not replace the
frontmatter, shortcode, or contributor references.

| Situation               | Do this                                     | Load when needed                                             |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------------ |
| New page or direct edit | Choose `docs` CLI or direct edit            | `../docs-cli-workflow/SKILL.md`                              |
| Shared source           | Find and update every source stub           | [references/shared-content.md](references/shared-content.md) |
| Technical claim         | Verify against the documentation search MCP | [references/fact-checking.md](references/fact-checking.md)   |
| Validation              | Run the changed-file verifier               | `../docs-testing/SKILL.md`                                   |

Prerequisites: identify the product from `data/products.yml`; read applicable
frontmatter and shortcode references; preserve semantic line feeds. Shared files
contain no frontmatter and product stubs use `source: /shared/...`.

```sh
docs edit <url-or-path> --list
yarn verify:changed -- <changed-content-files>
```

Load `references/shared-content.md` only for shared sources. Load
`references/fact-checking.md` only when verifying a technical claim. For full
human guidance, see [DOCS-CONTRIBUTING.md](../../../DOCS-CONTRIBUTING.md).
