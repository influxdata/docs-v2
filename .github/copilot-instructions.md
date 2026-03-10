# InfluxData Documentation Repository (docs-v2)

> **For GitHub Copilot and other AI coding agents**
>
> **Instruction resources**:
>
> - [.github/instructions/](instructions/) - **Pattern-specific** (auto-loaded by file type)
> - [AGENTS.md](../AGENTS.md) - Shared project guidelines (style, constraints, content structure)
> - [.github/LABEL_GUIDE.md](LABEL_GUIDE.md) - Label taxonomy and review pipeline

## Quick Reference

| Task             | Command                                               | Time    |
| ---------------- | ----------------------------------------------------- | ------- |
| Install          | `CYPRESS_INSTALL_BINARY=0 yarn install`               | \~4s    |
| Build            | `npx hugo --quiet`                                    | \~75s   |
| Dev Server       | `npx hugo server`                                     | \~92s   |
| Create Docs      | `docs create <draft> --products <keys>`               | varies  |
| Edit Docs        | `docs edit <url>`                                     | instant |
| Add Placeholders | `docs placeholders <file>`                            | instant |
| Audit Docs       | `docs audit --products <keys>`                        | varies  |
| Test All         | `yarn test:codeblocks:all`                            | 15-45m  |
| Lint             | `yarn lint`                                           | \~1m    |

**NEVER CANCEL** Hugo builds (\~75s) or test runs (15-45m).

## CLI Tools

```bash
docs --help                                     # Full reference
```

Non-blocking by default. Use `--wait` for interactive editing.

## Workflows

- **Content editing**: See [content-editing skill](../.claude/skills/content-editing/SKILL.md)
- **Testing**: See [DOCS-TESTING.md](../DOCS-TESTING.md)
- **Hugo templates**: See [hugo-template-dev skill](../.claude/skills/hugo-template-dev/SKILL.md)

## Product and Content Paths

Defined in [data/products.yml](../data/products.yml).

## Content Guidelines

- [DOCS-CONTRIBUTING.md](../DOCS-CONTRIBUTING.md) - Style, workflow, commit format
- [DOCS-SHORTCODES.md](../DOCS-SHORTCODES.md) - Shortcode reference
- [DOCS-FRONTMATTER.md](../DOCS-FRONTMATTER.md) - Frontmatter reference
- [content/example.md](../content/example.md) - Working shortcode examples

## File Pattern-Specific Instructions

Auto-loaded by GitHub Copilot based on changed files:

| Pattern                  | File                                                              | Description                                      |
| ------------------------ | ----------------------------------------------------------------- | ------------------------------------------------ |
| `content/**/*.md`        | [content.instructions.md](instructions/content.instructions.md)   | Content file guidelines, frontmatter, shortcodes |
| `content/**/*.md`        | [content-review.instructions.md](instructions/content-review.instructions.md) | Review criteria for content changes |
| `layouts/**/*.html`      | [layouts.instructions.md](instructions/layouts.instructions.md)   | Shortcode implementation patterns and testing    |
| `api-docs/**/*.yml`      | [api-docs.instructions.md](instructions/api-docs.instructions.md) | OpenAPI spec workflow                            |
| `assets/js/**/*.{js,ts}` | [assets.instructions.md](instructions/assets.instructions.md)     | TypeScript/JavaScript and CSS development        |
