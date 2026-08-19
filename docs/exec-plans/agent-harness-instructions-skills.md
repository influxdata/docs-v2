# Agent harness instructions and skills migration

**Status:** Implemented on `chore/agent-instructions-skills-plan`

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

## Implementation status

Completed in this branch:

1. Moved project skills from `.claude/skills/*` to `.agents/skills/*`.
2. Replaced `.claude/skills` with a symlink to `../.agents/skills`.
3. Created canonical path instruction sources in `.agents/instructions/` with
   `name`, `description`, and `paths` frontmatter.
4. Migrated current `.github/instructions/*.instructions.md` content into the
   canonical `.agents/instructions/*.md` files.
5. Extended `helper-scripts/build-agent-instructions.js` so it:
   - keeps generating `PLATFORM_REFERENCE.md` from `data/products.yml`;
   - generates `.github/instructions/{name}.instructions.md` with `applyTo`;
   - generates `.claude/rules/{name}.md` with Claude `paths` frontmatter;
   - generates scoped `AGENTS.md` files for `api-docs/`, `assets/`,
     `content/`, and `layouts/`;
   - verifies the `.claude/skills` symlink target;
   - normalizes generated trailing newlines to prevent validation drift.
6. Added `helper-scripts/validate-agent-instructions.js` to validate canonical
   instruction files, skill metadata, generator drift, and the Claude skills
   symlink.
7. Added and wired package scripts:
   - `yarn build:agent:instructions`
   - `yarn validate:agent-instructions`
8. Updated `lefthook.yml` so relevant changes regenerate and validate adapter
   files.
9. Updated repo guidance and references so `.agents/` is documented as the
   canonical source and `.github/` / `.claude/` are adapters.

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

## Remaining follow-up

- Decide whether to extract a reusable subset of `.agents/skills` into a
  separate plugin-oriented repository for `influxdata/docs-tooling`, or to keep
  plugin packaging logic in this repo and publish from canonical sources later.
- If plugin extraction proceeds, keep `.agents/` as the source of truth and add
  packaging/export automation rather than introducing another authored skill
  tree.

## Verification

Checks used for this migration:

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

`yarn lint` also ran as a final aggregate hook check.
No Hugo build is required because this change affects agent metadata and helper
scripts, not site-rendered content.
