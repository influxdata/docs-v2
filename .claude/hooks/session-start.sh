#!/bin/bash
# SessionStart hook for Claude Code on the web.
#
# Installs the toolchain the pre-commit/pre-push hooks expect so that
# linting works without manual intervention in the ephemeral web container:
#
#   - Node dependencies (prettier, eslint, cypress lint hooks via Lefthook)
#   - ShellCheck >= 0.10.0 (the `shellcheck` Lefthook step; without a local
#     binary it falls back to Docker, which the web container doesn't have)
#
# Local clones manage their own toolchain, so this is a no-op outside the
# remote environment. Idempotent and non-interactive — safe to re-run.

set -euo pipefail

# Only run in Claude Code on the web (remote) environments.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

# --- Node dependencies -------------------------------------------------------
# Skip browser binaries the lint hooks don't need; --frozen-lockfile keeps the
# install reproducible. Caching means this only does real work on a cold start.
if [ ! -d "$PROJECT_DIR/node_modules" ]; then
  (cd "$PROJECT_DIR" &&
    CYPRESS_INSTALL_BINARY=0 \
    PUPPETEER_SKIP_DOWNLOAD=1 \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    yarn install --frozen-lockfile 2>&1 | tail -3) || true
fi

# --- ShellCheck --------------------------------------------------------------
# Pin must match .ci/shellcheck/shellcheck.sh (SHELLCHECK_VERSION).
SHELLCHECK_VERSION="0.10.0"

current_shellcheck=""
if command -v shellcheck >/dev/null 2>&1; then
  current_shellcheck=$(shellcheck --version 2>/dev/null | awk '/^version:/ {print $2}')
fi

if [ "$current_shellcheck" != "$SHELLCHECK_VERSION" ]; then
  tmp=$(mktemp -d)
  url="https://github.com/koalaman/shellcheck/releases/download/v${SHELLCHECK_VERSION}/shellcheck-v${SHELLCHECK_VERSION}.linux.x86_64.tar.xz"
  if curl -fsSL "$url" | tar -xJ -C "$tmp"; then
    install -m 0755 "$tmp/shellcheck-v${SHELLCHECK_VERSION}/shellcheck" /usr/local/bin/shellcheck
    echo "Installed shellcheck v${SHELLCHECK_VERSION}"
  else
    echo "WARNING: failed to download shellcheck v${SHELLCHECK_VERSION}" >&2
  fi
  rm -rf "$tmp"
fi
