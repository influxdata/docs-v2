# InfluxData Documentation (docs-v2)

This is the harness-neutral repository contract for Codex, Claude Code, Pi, and
other agents. Use this file and `.agents/` as the source of truth. Claude rules,
Copilot instructions, and scoped `AGENTS.md` files are generated adapters.

## Agent assets

- Path-specific rules: `.agents/instructions/`.
- Reusable workflows: `.agents/skills/`.

After editing `AGENTS.md` or `.agents/**`, run:

```sh
yarn build:agent:instructions
yarn validate:agent-instructions
```

- Keep `.claude/skills` as a symlink to `.agents/skills`.
- Do not add a Pi-specific configuration; Pi uses this contract and skills.

## Work safely

- Work from the current worktree; never hardcode a path to another clone.

- Preserve unrelated working-tree changes.

- Never cancel Hugo builds or code-block tests. Give Hugo at least 180 seconds
  and long code-block suites 30 minutes.

- For InfluxDB 3 content, search these paths in parallel:
  - `content/shared/influxdb3-*/`
  - `content/influxdb3/core/`
  - `content/influxdb3/enterprise/`

- Use `python`, not `py`, for code block language identifiers.

## Choose checks

`git commit` runs staged-file hooks. Do not manually run `yarn lint` before a
commit unless diagnosing a hook failure. Use the changed-file verifier to plan
or run only manual checks:

```sh
yarn verify:changed -- <path> [<path> ...]
yarn verify:changed -- --staged
yarn verify:changed -- --run <path> [<path> ...]
```

Use `npx hugo --quiet` for a full build, `npx hugo server` for local serving,
and `yarn test:codeblocks:all` only when runnable examples require it.
See the [docs-testing skill](.agents/skills/docs-testing/SKILL.md) for routing.

## Content contract

- Shared content files under `content/shared/` have no frontmatter; consuming
  pages provide metadata through `source:`.
- Shared directories contain prose; product directories are often
  thin stubs with `source:` references to the shared content.
- Product names and versions come from `data/products.yml`.
- Use semantic line feeds, active present-tense second person, long CLI options,
  and no body h1 in content. Follow the Google developer documentation style.

## Repository conventions

- Use `type(scope): description` commit subjects. Non-trivial commits include
  What changed, Why, Impact, and Verification.

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

- `PLAN.md` and `HANDOVER.md` are ephemeral and blocked on the default branch.

## Detailed references

- [Content rules](content/AGENTS.md), [layouts](layouts/AGENTS.md),
  [assets](assets/AGENTS.md), and [API docs](api-docs/AGENTS.md).
- [DOCS-CONTRIBUTING.md](DOCS-CONTRIBUTING.md),
  [DOCS-FRONTMATTER.md](DOCS-FRONTMATTER.md),
  [DOCS-SHORTCODES.md](DOCS-SHORTCODES.md), and
  [DOCS-TESTING.md](DOCS-TESTING.md).
