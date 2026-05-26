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
# Install failure is intentionally non-fatal: an async SessionStart hook must
# never block the session, so a broken lockfile leaves node_modules absent and
# surfaces when a build/test command runs, not here.
rm -f node_modules
CYPRESS_INSTALL_BINARY=0 PUPPETEER_SKIP_DOWNLOAD=1 \
  PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
  yarn install --frozen-lockfile 2>&1 | tail -3 || true
