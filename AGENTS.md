# InfluxData Documentation (docs-v2)

Shared startup guidance for all AI assistants working in this repository.

## Canonical agent resources

- `AGENTS.md` is the shared repo-wide instruction file.
- `.agents/skills/` contains reusable Agent Skills shared by Codex, Claude
  Code, GitHub Copilot, and other compatible harnesses.
- `.agents/instructions/` contains canonical path-specific instruction sources.
- `.github/instructions/*.instructions.md`, `.claude/rules/*.md`, and scoped
  `AGENTS.md` files under major directories are generated adapters.
- `.claude/skills` is a symlink to `.agents/skills`.

After editing `AGENTS.md` or `.agents/**`, run:

```bash
yarn build:agent:instructions
yarn validate:agent-instructions
```

## Core commands

| Task             | Command                                 | Notes                                         |
| ---------------- | --------------------------------------- | --------------------------------------------- |
| Install          | `CYPRESS_INSTALL_BINARY=0 yarn install` | Use in network-restricted environments        |
| Build            | `npx hugo --quiet`                      | \~75s; never cancel                           |
| Dev server       | `npx hugo server`                       | \~92s; serves on port 1313                    |
| Test code blocks | `yarn test:codeblocks:all`              | 15-45m; never cancel                          |
| Lint             | `yarn lint`                             | Runs pre-commit and pre-push hook validations |

## docs CLI

Scaffold and manage documentation with the `docs` CLI (`docs --help` for full
reference). Non-blocking by default; use `--wait` for interactive editing.

- `docs create <draft> --products <keys>` — scaffold new pages
- `docs edit <url|path>` — open existing pages
- `docs placeholders <file>` — add placeholder syntax to code blocks
- `docs audit --products <keys>` — audit coverage

See [README.md](README.md) and the
[docs-cli-workflow skill](.agents/skills/docs-cli-workflow/SKILL.md) for details.

## Worktree and path rules

- This repo uses git worktrees. The current working directory is the repo root.
- Never hardcode paths back to the main clone under `/Users/*/docs-v2/`.
- Scripts that need `PROJECT_ROOT` derive it from `SCRIPT_DIR`; agents should
  use the current working directory, not the main clone path.

## Search rules

- For InfluxDB 3 content, search these paths in parallel:
  - `content/shared/influxdb3-*/`
  - `content/influxdb3/core/`
  - `content/influxdb3/enterprise/`
- Use Grep and Glob for local content searches.
- Run independent searches in parallel rather than one broad sequential search.

## Constraints

- Never cancel Hugo builds or code block test runs.
- Use timeouts of at least 180s for Hugo and 30m for long tests.
- Use `python`, not `py`, for code block language identifiers.
- Shared content files under `content/shared/` have no frontmatter; consuming
  pages provide metadata through `source:`.
- For InfluxDB 3, shared directories contain the prose; product directories are
  usually thin stubs with `source:` references.
- Product names and versions come from `data/products.yml`.
- Commit format is `type(scope): description`.
- Network-restricted environments may fail on Cypress downloads, Docker builds,
  or Alpine package installs.

## Dependency management

- **Dependabot is managed org-wide by the security team** for all influxdata
  repos. Do not stand up a parallel dependency-update mechanism, and treat a
  repo-level `.github/dependabot.yml` (if present) as supplementary to the org
  config, not the source of truth.
- Pin third-party GitHub Actions by full commit SHA (with a version comment) so
  Dependabot can keep the pins current. `.github/workflows/pr-lockfile-lint.yml`
  is the reference example.
- Coordinate with the security team before changing dependency automation;
  org-wide Dependabot security updates do not automatically include scheduled
  `github-actions` version updates.

## Documentation style

- Follow the Google Developer Documentation Style Guide.
- Use semantic line feeds: one sentence per line.
- Do not add `#` h1 headings in content; `title` frontmatter generates the h1.
- Prefer active voice, present tense, and second person.
- Use long options in CLI examples.
- Keep code blocks within 80 characters where practical.

## Documentation search (MCP)

A hosted InfluxDB documentation search server is configured for this repo.
Use it to verify technical accuracy, check API syntax, and find related docs.
Harness-specific setup (Claude Code: `.mcp.json`) lives in each harness's own
instruction file.

## Plans and design docs

- Implementation plans → `PLAN.md` at the repo root. Tracked on feature
  branches; a required PR check blocks `PLAN.md` and `HANDOVER.md` from merging
  to the default branch — remove or promote them before merge.
- Design specs → an existing docs location (`DOCS-*.md` or product `content/`
  frontmatter) only if useful post-merge; otherwise keep them in the session or
  alongside `PLAN.md` and remove before merge.

## Where detailed guidance lives

- `content/AGENTS.md`: frontmatter, shortcodes, shared content, and doc editing
  workflow.
- `layouts/AGENTS.md`: Hugo template and shortcode guidance.
- `assets/AGENTS.md`: JS, CSS, and TypeScript guidance.
- `api-docs/AGENTS.md`: API reference generation workflow.
- `DOCS-TESTING.md`: content validation workflow (human contributor reference).
- `.agents/skills/docs-testing/SKILL.md`: agent testing decision guide — maps
  changed file types to exact test commands, documents what CI runs automatically,
  and flags coverage gaps.
- `DOCS-SHORTCODES.md`: shortcode reference.
- `DOCS-FRONTMATTER.md`: frontmatter reference.
- `DOCS-CONTRIBUTING.md`: contribution and commit conventions.
