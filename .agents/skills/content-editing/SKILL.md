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
| Shared source           | Identify and review every consumer; refresh the local preview when needed | [references/shared-content.md](references/shared-content.md) |
| Technical claim         | Verify against the documentation search MCP | [references/fact-checking.md](references/fact-checking.md)   |
| Validation              | Run the changed-file verifier               | `../docs-testing/SKILL.md`                                   |

Prerequisites: resolve the exact product key from `data/products.yml`; read
applicable frontmatter and shortcode references; preserve semantic line feeds.
Treat `Cloud` alone as ambiguous and ask the operator for the product or edition
before editing. Shared files contain no frontmatter and product stubs use
`source: /shared/...`.

```sh
docs edit <url-or-path> --list
yarn verify:changed -- <changed-content-files>
```

Load `references/shared-content.md` only for shared sources. Load
`references/fact-checking.md` only when verifying a technical claim. For full
human guidance, see [DOCS-CONTRIBUTING.md](../../../DOCS-CONTRIBUTING.md).

## Examples that continue across sections

Review each continuing section as if the reader arrived from search or an anchor link.
When it reuses values from an earlier example, make its first sentence name the
example and link to the section that defines it.
For example: "The following steps create a trigger in the example cluster from
[Start the nodes](#start-the-nodes)."

Describe what the reader must supply before giving the example value.
Specify the entire input format, including prefixes and separators.
For example: "Set `--node-spec` to `nodes:` followed by the process node's ID.
In the example cluster, use `nodes:process0`."
In a checklist, use "The process node (`process0` in the example) has mode
`[process]`" instead of using the example ID as the only description.

Before finishing, check that every reused example value has enough context to
adapt it to another setup and that each setup link resolves to its defining section.
