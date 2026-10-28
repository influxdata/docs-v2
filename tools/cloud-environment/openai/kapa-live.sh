#!/usr/bin/env bash
# Runs headed Chromium on an isolated virtual display for live Kapa checks.
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/setup.sh"
cd -- "$DOCS_WORKTREE"
for docs_command in Xvfb xvfb-run xauth; do
  if ! command -v "$docs_command" >/dev/null; then
    echo "Missing $docs_command. Install xvfb and xauth in the base environment through Edit Environment." >&2
    exit 1
  fi
done
bash tools/cloud-environment/openai/maintenance.sh
# xvfb-run owns and cleans up its display; no shared DISPLAY or PID is required.
exec xvfb-run -a -s '-screen 0 1280x1024x24' \
  yarn test:e2e:kapa-live --headed --browser "$PUPPETEER_EXECUTABLE_PATH" "$@"
