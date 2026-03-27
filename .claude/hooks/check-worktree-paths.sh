#!/bin/bash
# PreToolUse hook: block file reads that escape the current worktree.
#
# When running in a git worktree, any Read/Glob/Grep targeting the main
# clone (instead of the worktree) is almost certainly a mistake. This
# hook detects that condition deterministically using git's own plumbing.
#
# Exit codes:
#   0 = allow (not in a worktree, or path is fine)
#   2 = block (path targets the main clone)

set -euo pipefail

# Read hook input JSON from stdin
INPUT=$(cat)

# Are we in a worktree? Compare git-dir to git-common-dir.
GIT_DIR=$(git rev-parse --git-dir 2>/dev/null) || exit 0
GIT_COMMON_DIR=$(git rev-parse --git-common-dir 2>/dev/null) || exit 0

# Normalize both to absolute paths for comparison
GIT_DIR=$(cd "$GIT_DIR" && pwd)
GIT_COMMON_DIR=$(cd "$GIT_COMMON_DIR" && pwd)

# Not a worktree — nothing to enforce
if [[ "$GIT_DIR" == "$GIT_COMMON_DIR" ]]; then
  exit 0
fi

# Resolve the main clone root and the worktree root
MAIN_REPO=$(cd "$GIT_COMMON_DIR/.." && pwd)
WORKTREE_ROOT=$(git rev-parse --show-toplevel)

# Extract file paths from tool input (covers Read, Glob, Grep)
PATHS=$(echo "$INPUT" | jq -r '
  [.tool_input.file_path, .tool_input.path] | map(select(. and . != "")) | .[]
' 2>/dev/null)

# No paths to check
if [[ -z "$PATHS" ]]; then
  exit 0
fi

while IFS= read -r FILE_PATH; do
  # Skip relative paths — they resolve from the worktree
  [[ "$FILE_PATH" != /* ]] && continue

  # Block if path is under the main clone but NOT under the worktree
  if [[ "$FILE_PATH" == "$MAIN_REPO"/* && "$FILE_PATH" != "$WORKTREE_ROOT"/* ]]; then
    cat <<MSG
Path targets the main clone, not the current worktree.

  Blocked path: $FILE_PATH
  Main clone:   $MAIN_REPO
  Worktree:     $WORKTREE_ROOT

Use a relative path or one under the worktree root.
MSG
    exit 2
  fi
done <<< "$PATHS"

exit 0
