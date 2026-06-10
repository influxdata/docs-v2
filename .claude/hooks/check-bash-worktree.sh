#!/bin/bash
# PreToolUse hook: block Bash commands that escape the current worktree.
#
# Catches absolute paths (and `cd <abspath>`) that point at the main clone
# instead of the active worktree. Exits 0 in the primary clone or when the
# command stays inside the worktree.
#
# Exit codes:
#   0 = allow
#   2 = block (path targets the main clone)

set -euo pipefail

INPUT=$(cat)

GIT_DIR=$(git rev-parse --git-dir 2>/dev/null) || exit 0
GIT_COMMON_DIR=$(git rev-parse --git-common-dir 2>/dev/null) || exit 0
GIT_DIR=$(cd "$GIT_DIR" && pwd)
GIT_COMMON_DIR=$(cd "$GIT_COMMON_DIR" && pwd)

# Not a worktree — nothing to enforce
if [[ "$GIT_DIR" == "$GIT_COMMON_DIR" ]]; then
  exit 0
fi

MAIN_REPO=$(cd "$GIT_COMMON_DIR/.." && pwd)
WORKTREE_ROOT=$(git rev-parse --show-toplevel)

CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)
[[ -z "$CMD" ]] && exit 0

# Extract every whitespace-separated token that looks like an absolute path.
# We compare each against MAIN_REPO/WORKTREE_ROOT instead of regexing the whole
# command — fewer false positives, easier to report which token tripped.
TOKENS=$(echo "$CMD" | grep -oE '/[^[:space:];|&<>"'\'']+' || true)

while IFS= read -r TOKEN; do
  [[ -z "$TOKEN" ]] && continue
  # Strip trailing punctuation that's not part of a path
  TOKEN=${TOKEN%[,.:;]}

  # Token must be exactly MAIN_REPO or start with MAIN_REPO/, AND must NOT be
  # under WORKTREE_ROOT (which is itself a subpath of MAIN_REPO).
  if [[ "$TOKEN" == "$MAIN_REPO" || "$TOKEN" == "$MAIN_REPO"/* ]]; then
    if [[ "$TOKEN" != "$WORKTREE_ROOT" && "$TOKEN" != "$WORKTREE_ROOT"/* ]]; then
      cat <<MSG
Bash command references the main clone, not the current worktree.

  Command:        $CMD
  Offending path: $TOKEN
  Main clone:     $MAIN_REPO
  Worktree:       $WORKTREE_ROOT

Use paths under the worktree, or relative paths from cwd.
MSG
      exit 2
    fi
  fi
done <<< "$TOKENS"

exit 0
