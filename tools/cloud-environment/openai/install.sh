#!/usr/bin/env bash
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/setup.sh"
cd -- "$DOCS_WORKTREE"
mkdir -p "$DOCS_CACHE_ROOT/bin" "$DOCS_ENVIRONMENT_ARTIFACTS" "$HUGO_RESOURCEDIR"
command -v corepack >/dev/null
corepack enable --install-directory "$DOCS_CACHE_ROOT/bin"
# packageManager pins Yarn; the lockfile and install hooks remain authoritative.
yarn install --frozen-lockfile
if [[ ! -x "$PUPPETEER_EXECUTABLE_PATH" ]]; then
  echo "Install Chromium and its system dependencies in the base environment, or set PUPPETEER_EXECUTABLE_PATH." >&2
  exit 1
fi
cypress install
cypress verify
if [[ "${DOCS_CONFIGURE_BROWSER_TRUST:-0}" == 1 ]]; then
  bash tools/cloud-environment/openai/browser-trust.sh
fi
bash tools/cloud-environment/openai/maintenance.sh
