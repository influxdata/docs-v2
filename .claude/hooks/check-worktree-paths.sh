#!/bin/bash
# PreToolUse hook: block file reads/edits that escape the current worktree.
#
# When running in a linked git worktree, a Read/Glob/Grep that targets a
# DIFFERENT worktree (the main clone or a sibling worktree) is almost always
# a mistake -- you meant the copy in the current worktree. Boundaries are
# derived from `git worktree list`, so this works regardless of where
# worktrees live (nested under the main clone, sibling dirs, anywhere).
#
# Output protocol (https://code.claude.com/docs/en/hooks):
#   exit 0, no output -> allow
#   exit 2 + stderr   -> block; stderr is shown to Claude

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=lib/worktree-paths.sh
source "$SCRIPT_DIR/lib/worktree-paths.sh"

INPUT=$(cat)

# Only guard inside a linked worktree; the main clone has nowhere to escape to.
wt_in_linked_worktree || exit 0
CURRENT=$(wt_current_root)

# Extract file paths from tool input (covers Read, Glob, Grep).
PATHS=$(echo "$INPUT" | jq -r '
  [.tool_input.file_path, .tool_input.path] | map(select(. and . != "")) | .[]
' 2>/dev/null) || exit 0
[[ -z "$PATHS" ]] && exit 0

while IFS= read -r FILE_PATH; do
  # Relative paths resolve from the current worktree -> always safe.
  [[ "$FILE_PATH" != /* ]] && continue

  if wt_path_escapes "$FILE_PATH"; then
    cat >&2 <<MSG
Path targets a different git worktree, not the current one.

  Blocked path:     $FILE_PATH
  Current worktree: $CURRENT

Use a relative path or one under the current worktree root.
MSG
    exit 2
  fi
done <<< "$PATHS"

exit 0
