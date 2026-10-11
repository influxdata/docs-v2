#!/usr/bin/env bash
# Readiness checks only. Does not install dependencies or start a server.
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/setup.sh"
cd -- "$DOCS_WORKTREE"
node --version
yarn --version
hugo version
"$PUPPETEER_EXECUTABLE_PATH" --version
cypress verify
node tools/cloud-environment/openai/browser-smoke.mjs
