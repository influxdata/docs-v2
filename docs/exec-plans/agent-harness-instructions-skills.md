# Agent harness instructions and skills migration

**Status:** Planned — not implemented

## Goal

Create one repo-owned source of truth for agent instructions and skills.
Use `.agents/` as the canonical location, then generate or link adapter files
for Codex, Claude Code, GitHub Copilot, and other agent harnesses.

This should reduce instruction drift across `AGENTS.md`, `CLAUDE.md`,
`.github/instructions/`, and `.claude/skills/` while preserving each harness's
native discovery behavior.

## Why now

The repo currently maintains overlapping guidance for different agents:

- `AGENTS.md` is the shared broad instruction file.
- `CLAUDE.md` points Claude to shared docs and `.claude/`.
- `.github/copilot-instructions.md` provides Copilot-specific repo guidance.
- `.github/instructions/*.instructions.md` provides Copilot path-specific
  guidance.
- `.claude/skills/*/SKILL.md` provides Claude project skills.

Codex, Claude Code, and GitHub Copilot now all support the open Agent Skills
shape, and Copilot also recognizes `.agents/skills`.
This makes `.agents/` a reasonable canonical authoring location.

## Decisions

- **Use `.agents/` as canonical.** Store reusable skills in `.agents/skills`
  and canonical path/topic instruction sources in `.agents/instructions`.
- **Keep `AGENTS.md` as the canonical repo-wide instruction file.** It is
  already the shared guide and is natively read by Codex and Copilot agents.
- **Use generated committed files for GitHub-facing adapters.** Keep
  `.github/copilot-instructions.md` and `.github/instructions/*.instructions.md`
  as real committed files, not symlinks, because GitHub-hosted Copilot and code
  review read files from the base branch.
- **Use a Claude import for repo-wide instructions.** Update `CLAUDE.md` to
  import `@AGENTS.md`, then keep only Claude-specific notes below it.
- **Use a symlink for Claude skills.** Replace `.claude/skills` with a symlink
  to `../.agents/skills` because Claude and Codex support symlinked skills in
  local environments.
- **Generate Claude path rules.** Generate `.claude/rules/*.md` from
  `.agents/instructions/*.md` using Claude's `paths` frontmatter.
- **Generate scoped `AGENTS.md` files only for major directories.** Codex has
  no direct path-glob instruction equivalent, so generate scoped files for
  high-signal directory roots such as `content/`, `layouts/`, `assets/`, and
  `api-docs/`.
- **Validate drift in hooks.** Use hooks to regenerate and validate adapter
  files, not to treat copied files as independent sources of truth.
- **Defer plugin extraction.** Prepare the canonical source so reusable skills
  can later be packaged for `influxdata/docs-tooling`, but do not build the
  plugin in this pass.

## Implementation plan

1. Move current `.claude/skills/*` directories to `.agents/skills/*`.
2. Replace `.claude/skills` with a symlink to `../.agents/skills`.
3. Normalize canonical skill frontmatter to the shared subset:
   `name` and `description`.
4. Create `.agents/instructions/*.md` as canonical path instruction sources.
   Include frontmatter fields:
   - `name`
   - `description`
   - `paths`
5. Migrate the current `.github/instructions/*.instructions.md` bodies into the
   canonical `.agents/instructions` files.
6. Extend `helper-scripts/build-agent-instructions.js` so it:
   - keeps generating `PLATFORM_REFERENCE.md` from `data/products.yml`;
   - generates `.github/instructions/{name}.instructions.md` with `applyTo`;
   - generates `.claude/rules/{name}.md` with `paths`;
   - generates scoped `AGENTS.md` files for major directory roots;
   - verifies or repairs the `.claude/skills` symlink.
7. Add `helper-scripts/validate-agent-instructions.js` to check:
   - canonical instruction frontmatter and glob shape;
   - generated adapters are up to date;
   - skills have unique hyphen-case names and descriptions;
   - `.claude/skills` is the expected symlink.
8. Add package scripts:
   - `build:agent:instructions` remains the generator entrypoint;
   - `validate:agent-instructions` runs drift and skill validation.
9. Update `lefthook.yml` so changes to `AGENTS.md`, `.agents/instructions/**`,
   `.agents/skills/**`, and `data/products.yml` regenerate and stage adapters.
10. Update navigation docs and instruction references to describe `.agents/` as
    canonical and `.github/` / `.claude/` as adapters.

## Explicitly out of scope

- Building the `influxdata/docs-tooling` plugin in this change.
- Migrating `.claude/agents/` or `.claude/commands/`.
- Changing product documentation content or Hugo runtime behavior.
- Reworking the repo-wide instruction content beyond references needed for the
  new canonical layout.

## How to update after migration

- Add or edit reusable workflows in `.agents/skills/<skill-name>/SKILL.md`.
- Add or edit path-specific guidance in `.agents/instructions/<name>.md`.
- Run `yarn build:agent:instructions` after changing canonical sources.
- Run `yarn validate:agent-instructions` before committing.
- Do not edit generated `.github/instructions/*.instructions.md` or
  `.claude/rules/*.md` directly.

## Verification

Planned checks for the implementation commit:

```bash
yarn build:agent:instructions
yarn build:agent:instructions
git diff --exit-code
yarn validate:agent-instructions
.ci/vale/vale.sh --config=.vale-instructions.ini --minAlertLevel=warning \
  AGENTS.md CLAUDE.md .agents/**/*.md .github/**/*.md .claude/rules/**/*.md
.ci/remark/remark.sh \
  AGENTS.md CLAUDE.md .agents/**/*.md .github/**/*.md .claude/rules/**/*.md \
  --quiet
```

Run `yarn lint` before final review if time permits.
Do not require a Hugo build unless the implementation changes site-rendered
content.
