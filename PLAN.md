# Design: lockfile-aware worktree dependency sharing

## Problem

The repo's `node_modules` is \~709 MB and the team runs many Claude Code
worktrees (15+ under `.claude/worktrees/` alone). Without sharing, each
worktree either re-runs a multi-minute `yarn install` or bloats disk by
hundreds of MB. The repo also keeps cloned external source repos (influxdb,
etc.) under `.cache/` for documentation analysis — re-cloning those per
worktree is similarly wasteful.

Claude Code's `worktree.symlinkDirectories` setting can symlink directories
from the main checkout into worktrees, but a blanket symlink of `node_modules`
is **incorrect** when a worktree's branch changes dependencies: the worktree
would run against master's `node_modules` despite a different `yarn.lock`
(e.g. Dependabot or build-tooling branches). A naive install guard that only
checks whether `node_modules` is "present" would see the symlink and silently
skip reinstalling — masking the mismatch.

Confirmed live: the `dar-584-float-precision` worktree's `yarn.lock` is
285,171 bytes vs master's 263,901 bytes. A blanket symlink there would serve
the wrong dependencies.

## Relationship to PR #7261

PR #7261 ("Add Claude Code hooks for git worktree safety and toolchain
setup", OPEN) replaces the old inline `SessionStart` install one-liner with
`.claude/hooks/session-start.sh`. That script is **remote-only** — its first
guard is `if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then exit 0; fi` — and
installs Node deps + ShellCheck in the ephemeral web container. It
deliberately does nothing locally ("local clones manage their own
toolchain").

Consequences for this plan:

- After #7261, **local** worktrees get no automatic `node_modules`. This
  plan's `symlinkDirectories` fills that gap (matching worktrees get the
  symlink; divergent ones get the install below), so the two changes are
  complementary, not competing.
- This plan's hook is **narrowed** to only the symlink-divergence case. It no
  longer needs a generic "missing node\_modules → install" branch: remote
  installs are owned by `session-start.sh`, and locally the symlink itself
  provides `node_modules` for matching worktrees.
- Division of labor:

  | Concern                                                | Owner                               | Environment     |
  | ------------------------------------------------------ | ----------------------------------- | --------------- |
  | Cold-start install + ShellCheck                        | `session-start.sh` (#7261)          | remote web only |
  | Worktree `node_modules` sharing + lockfile correctness | `sync-worktree-deps.sh` (this plan) | local worktrees |

**Status:** #7261 is **merged to master**. This work branches from current
master and adds a second entry to the `SessionStart` array in
`.claude/settings.json` against its merged state — no conflict to resolve.

## Goal

Share dependencies across worktrees for both disk and startup-time savings,
**without** ever silently serving stale/wrong dependencies to a worktree whose
`yarn.lock` has diverged from the source checkout.

## Approach

Two coordinated pieces in `.claude/settings.json`, committed to project
settings (benefits all contributors who use Claude Code worktrees; no-op for
those who don't):

1. `worktree.symlinkDirectories: ["node_modules", ".cache"]`
   - `node_modules` — symlinked for the disk/time win; correctness enforced by
     the hook below.
   - `.cache` — symlinked unconditionally. It holds external cloned source
     repos, which are branch-invariant, so sharing is purely beneficial and
     needs no guard.

2. A new `.claude/hooks/sync-worktree-deps.sh` (matching the existing
   `.claude/hooks/check-worktree-paths.sh` script pattern), registered as a
   **second** `SessionStart` hook entry alongside #7261's `session-start.sh`.
   It is `async: true` so a divergent install never blocks the session. It
   governs `node_modules` only, and acts only on a symlinked worktree.

### Hook logic

```bash
#!/usr/bin/env bash
set -euo pipefail

# Only act on a worktree whose node_modules is a symlink (created by
# worktree.symlinkDirectories). Everywhere else — the main checkout (real
# dir), the remote web container, a non-symlinked worktree — this is a no-op.
[ -L node_modules ] || exit 0

# Keep the symlink only if this worktree's lockfile matches the source
# checkout's. git-common-dir resolves to the main checkout's .git from any
# worktree, so its parent is the source checkout.
main_checkout="$(dirname "$(git rev-parse --git-common-dir)")"
cmp -s yarn.lock "$main_checkout/yarn.lock" && exit 0

# Diverged: drop the symlink and install this worktree's own dependencies.
rm -f node_modules              # removes the symlink only, never the target
CYPRESS_INSTALL_BINARY=0 PUPPETEER_SKIP_DOWNLOAD=1 \
  PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
  yarn install --frozen-lockfile 2>&1 | tail -3 || true
```

Safety:

- `rm -f node_modules` (no `-r`, no trailing slash) removes only the symlink,
  never master's directory.
- A real `node_modules` (main checkout) and the remote container both fail the
  `[ -L node_modules ]` test, so they exit immediately — no overlap with
  `session-start.sh`.
- `cmp -s` is microseconds, so the every-session cost is negligible.
- Divergent installs are download-free via yarn's shared global cache.

### Behavior matrix

| Worktree state             | Lockfile vs source | Result                           |
| -------------------------- | ------------------ | -------------------------------- |
| Symlinked `node_modules`   | identical          | keep symlink — 0 disk, 0 install |
| Symlinked `node_modules`   | differs            | drop symlink, `yarn install`     |
| Real `node_modules` (main) | n/a                | exit 0 (untouched)               |
| No symlink (remote, etc.)  | n/a                | exit 0 (owned by session-start)  |

Running on `SessionStart` (not just worktree create) makes it self-healing:
switching a worktree's branch later re-evaluates the lockfile next session.

## Additional fix

`.cache` is currently **not** matched by `.gitignore`. Since this design
formally relies on it for cloned source repos, add `.cache/` to `.gitignore`
to prevent accidental staging of cloned repositories.

## Out of scope

- Content-addressed node\_modules store keyed by lockfile hash (more disk
  efficient across many same-diverged worktrees, but more machinery).
- Migrating package managers (pnpm/yarn-berry PnP).
- Pre-creating or repairing the `.cache` symlink when `.cache` does not yet
  exist at worktree-creation time. Accepted behavior: such a worktree makes
  its own `.cache` and simply doesn't share until the symlink exists. Not
  broken, just not shared.

## Testing

- `shellcheck .claude/hooks/sync-worktree-deps.sh`.
- Pipe synthetic `SessionStart` input and run against real worktrees:
  - `dar-584-float-precision` (divergent lock) must trigger an install.
  - A worktree whose lock matches master must keep the symlink.
- Confirm `rm -f node_modules` on a symlink leaves master's `node_modules`
  intact.

***

# Worktree dependency sharing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Share `node_modules` and `.cache` across local Claude Code worktrees while guaranteeing a worktree whose `yarn.lock` diverges from master gets its own correct dependencies.

**Architecture:** Add `worktree.symlinkDirectories` to `.claude/settings.json` and a second `SessionStart` hook, `.claude/hooks/sync-worktree-deps.sh`, that keeps the symlinked `node_modules` only when the worktree's lockfile matches the source checkout's, otherwise drops the symlink and installs locally. Complements (does not replace) the merged `session-start.sh` from #7261, which is remote-only.

**Tech Stack:** Bash, `git rev-parse --git-common-dir`, yarn (classic), shellcheck, jq.

***

### Task 0: Branch from merged master

**Files:** none (git setup)

- [ ] **Step 1: Sync master and create the feature branch**

Run:

```bash
git fetch origin master
git switch master && git merge --ff-only origin/master
git switch -c chore-worktree-dep-sharing
```

Expected: master fast-forwards to include #7261 (so `.claude/hooks/session-start.sh` exists); new branch checked out.

- [ ] **Step 2: Confirm #7261 is present**

Run: `test -f .claude/hooks/session-start.sh && grep -c CLAUDE_CODE_REMOTE .claude/hooks/session-start.sh`
Expected: prints `1` (the remote-only guard is present).

***

### Task 1: The lockfile-aware hook script (TDD)

**Files:**

- Create: `.claude/hooks/sync-worktree-deps.sh`

- Test: `.claude/hooks/sync-worktree-deps.test.sh`

- [ ] **Step 1: Write the failing test**

Create `.claude/hooks/sync-worktree-deps.test.sh`:

```bash
#!/usr/bin/env bash
# Behavior test for sync-worktree-deps.sh. Mocks only yarn (the slow external
# boundary); everything else uses a real throwaway git repo + worktrees.
set -euo pipefail

HOOK="$(cd "$(dirname "$0")" && pwd)/sync-worktree-deps.sh"
tmp="$(mktemp -d)"
trap 'git -C "$tmp/main" worktree prune 2>/dev/null || true; rm -rf "$tmp"' EXIT

# --- source ("main") checkout with a real node_modules and a lockfile -------
main="$tmp/main"
mkdir -p "$main/node_modules"
git -C "$main" init -q
git -C "$main" config user.email t@example.com
git -C "$main" config user.name test
printf 'LOCK_A\n' > "$main/yarn.lock"
git -C "$main" add -A && git -C "$main" commit -qm init

# --- yarn shim: record the call, recreate node_modules like a real install --
shimdir="$tmp/bin"; mkdir -p "$shimdir"
cat > "$shimdir/yarn" <<'SHIM'
#!/usr/bin/env bash
echo "yarn $*" >> "$YARN_LOG"
mkdir -p node_modules
SHIM
chmod +x "$shimdir/yarn"

run_hook() { ( cd "$1" && PATH="$shimdir:$PATH" YARN_LOG="$2" bash "$HOOK" ); }

# --- Case 1: matching lockfile -> keep symlink, no install ------------------
wt1="$tmp/wt-match"
git -C "$main" worktree add -q "$wt1" -b match
printf 'LOCK_A\n' > "$wt1/yarn.lock"
ln -s "$main/node_modules" "$wt1/node_modules"
log1="$tmp/log1"; : > "$log1"
run_hook "$wt1" "$log1"
[ -L "$wt1/node_modules" ] || { echo "FAIL case1: symlink removed"; exit 1; }
[ ! -s "$log1" ]          || { echo "FAIL case1: yarn called"; exit 1; }
echo "PASS case1: matching lock keeps symlink"

# --- Case 2: divergent lockfile -> drop symlink, install --------------------
wt2="$tmp/wt-diff"
git -C "$main" worktree add -q "$wt2" -b diff
printf 'LOCK_B\n' > "$wt2/yarn.lock"
ln -s "$main/node_modules" "$wt2/node_modules"
log2="$tmp/log2"; : > "$log2"
run_hook "$wt2" "$log2"
[ ! -L "$wt2/node_modules" ] || { echo "FAIL case2: symlink kept"; exit 1; }
[ -s "$log2" ]               || { echo "FAIL case2: yarn not called"; exit 1; }
[ -d "$main/node_modules" ]  || { echo "FAIL case2: source node_modules gone"; exit 1; }
echo "PASS case2: divergent lock installs locally, source intact"

# --- Case 3: real node_modules (main checkout) -> no-op ---------------------
log3="$tmp/log3"; : > "$log3"
run_hook "$main" "$log3"
[ ! -s "$log3" ] || { echo "FAIL case3: yarn called in main checkout"; exit 1; }
echo "PASS case3: real node_modules untouched"

echo "ALL PASS"
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bash .claude/hooks/sync-worktree-deps.test.sh`
Expected: FAIL — the hook script doesn't exist yet (`bash: .../sync-worktree-deps.sh: No such file or directory`).

- [ ] **Step 3: Write the hook script**

Create `.claude/hooks/sync-worktree-deps.sh`:

```bash
#!/usr/bin/env bash
# SessionStart hook (local): keep a worktree's symlinked node_modules only
# while its lockfile matches the source checkout; otherwise install the
# worktree's own dependencies. Complements session-start.sh (remote-only).
#
# No-op unless node_modules is a symlink, so the main checkout, the remote
# web container, and non-symlinked worktrees all exit immediately.
set -euo pipefail

[ -L node_modules ] || exit 0

# git-common-dir resolves to the source checkout's .git from any worktree;
# its parent is the source checkout root.
main_checkout="$(dirname "$(git rev-parse --git-common-dir)")"

# Lockfile matches the source -> the shared symlink is correct; keep it.
cmp -s yarn.lock "$main_checkout/yarn.lock" && exit 0

# Diverged -> remove only the symlink (no -r, no trailing slash) and install.
rm -f node_modules
CYPRESS_INSTALL_BINARY=0 PUPPETEER_SKIP_DOWNLOAD=1 \
  PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
  yarn install --frozen-lockfile 2>&1 | tail -3 || true
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bash .claude/hooks/sync-worktree-deps.test.sh`
Expected: prints `PASS case1`, `PASS case2`, `PASS case3`, `ALL PASS`.

- [ ] **Step 5: Lint both scripts**

Run: `shellcheck .claude/hooks/sync-worktree-deps.sh .claude/hooks/sync-worktree-deps.test.sh`
Expected: no output, exit 0.

- [ ] **Step 6: Commit**

```bash
git add .claude/hooks/sync-worktree-deps.sh .claude/hooks/sync-worktree-deps.test.sh
git commit -m "feat(worktree): lockfile-aware node_modules sync hook"
```

***

### Task 2: Register the hook and enable symlinking

**Files:**

- Modify: `.claude/settings.json` (SessionStart array + new top-level `worktree` key)

- [ ] **Step 1: Add the second SessionStart entry**

In `.claude/settings.json`, the `SessionStart` array currently holds one entry ending:

```json
            "command": "bash .claude/hooks/session-start.sh",
            "timeout": 300,
            "statusMessage": "Installing dependencies and lint toolchain"
          }
        ]
      }
    ],
```

Add a second entry so the array reads:

```json
            "command": "bash .claude/hooks/session-start.sh",
            "timeout": 300,
            "statusMessage": "Installing dependencies and lint toolchain"
          }
        ]
      },
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/sync-worktree-deps.sh",
            "timeout": 300,
            "async": true,
            "statusMessage": "Syncing worktree dependencies"
          }
        ]
      }
    ],
```

- [ ] **Step 2: Add the top-level `worktree` key**

The file ends:

```json
  "enabledPlugins": {
    "github@claude-plugins-official": true
  }
}
```

Change it to:

```json
  "enabledPlugins": {
    "github@claude-plugins-official": true
  },
  "worktree": {
    "symlinkDirectories": ["node_modules", ".cache"]
  }
}
```

- [ ] **Step 3: Validate JSON and assert both hooks are registered**

Run:

```bash
jq -e '.worktree.symlinkDirectories == ["node_modules", ".cache"]' .claude/settings.json
jq -e '[.hooks.SessionStart[].hooks[].command] | index("bash .claude/hooks/sync-worktree-deps.sh") != null' .claude/settings.json
```

Expected: each prints `true` and exits 0. (A non-zero exit means malformed JSON or a missing entry.)

- [ ] **Step 4: Commit**

```bash
git add .claude/settings.json
git commit -m "feat(worktree): symlink node_modules/.cache, register sync hook"
```

***

### Task 3: Ignore the `.cache` clone directory

**Files:**

- Modify: `.gitignore`

- [ ] **Step 1: Add `.cache/` near the existing cache entries**

In `.gitignore`, find the line `.test-cache` and add `.cache/` immediately after it:

```
.test-cache
.cache/
```

- [ ] **Step 2: Verify the pattern matches**

Run: `git check-ignore -v .cache/influxdb`
Expected: prints a match line referencing `.gitignore` and the `.cache/` pattern (exit 0).

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: gitignore .cache/ (worktree-shared source clones)"
```

***

### Task 4: Smoke-test against a real worktree

**Files:** none (verification)

- [ ] **Step 1: Confirm the hook is a no-op in the main checkout**

Run: `bash .claude/hooks/sync-worktree-deps.sh && echo "exit-ok"`
Expected: prints `exit-ok` and does nothing — the main checkout's `node_modules` is a real directory, so the script exits at the `[ -L node_modules ]` guard. (Verify untouched: `test -d node_modules && ! test -L node_modules && echo intact`.)

- [ ] **Step 2: Confirm divergence detection against a live worktree**

Using the known-divergent worktree from the spec:

```bash
( cd /Users/ja/.worktrees/docs-v2/dar-584-float-precision &&
  main="$(dirname "$(git rev-parse --git-common-dir)")" &&
  cmp -s yarn.lock "$main/yarn.lock" && echo "MATCH (would keep symlink)" || echo "DIVERGE (would install)" )
```

Expected: prints `DIVERGE (would install)` — confirming the guard correctly identifies a real divergent branch (its lockfile differs from master's, per the spec).
