#!/usr/bin/env bash
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/setup.sh"
cd -- "$DOCS_WORKTREE"
mkdir -p "$HUGO_RESOURCEDIR"
# Serves the testing site with rebuilds.
exec hugo server --environment testing --port 1315 --bind 127.0.0.1 --disableFastRender --noHTTPCache "$@"
