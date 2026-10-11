#!/usr/bin/env bash
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/setup.sh"
cd -- "$DOCS_WORKTREE"
mkdir -p "$HUGO_RESOURCEDIR"
# Keep this process running between edits. Hugo watches and rebuilds the site.
exec hugo server --environment testing --port 1315 --bind 127.0.0.1 --disableFastRender --noHTTPCache "$@"
