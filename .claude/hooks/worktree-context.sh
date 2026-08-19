#!/bin/bash
# UserPromptSubmit hook: inject worktree awareness into every user turn.
#
# Fires on every user prompt so the rule survives compaction and attention
# decay in long sessions. Silent when running in the primary clone.
#
# Exit codes:
#   0 = continue (stdout is appended to the prompt context)

set -euo pipefail

GIT_DIR=$(git rev-parse --git-dir 2>/dev/null) || exit 0
GIT_COMMON_DIR=$(git rev-parse --git-common-dir 2>/dev/null) || exit 0
GIT_DIR=$(cd "$GIT_DIR" && pwd)
GIT_COMMON_DIR=$(cd "$GIT_COMMON_DIR" && pwd)

# Primary clone — no worktree rules apply
if [[ "$GIT_DIR" == "$GIT_COMMON_DIR" ]]; then
  exit 0
fi

WORKTREE_ROOT=$(git rev-parse --show-toplevel)
MAIN_REPO=$(cd "$GIT_COMMON_DIR/.." && pwd)

cat <<EOF
[worktree-context] Active git worktree: $WORKTREE_ROOT
Do NOT cd, read, or resolve paths to the main clone at: $MAIN_REPO
Treat the current working directory as the repo root. Use relative paths.
EOF
