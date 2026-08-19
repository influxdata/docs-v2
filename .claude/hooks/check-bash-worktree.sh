#!/bin/bash
# PreToolUse hook: block Bash commands that escape the current worktree.
#
# Catches absolute path tokens (and `cd <abspath>`) that point at a DIFFERENT
# git worktree -- the main clone or a sibling worktree -- instead of the
# active one. Boundaries come from `git worktree list`, so any worktree layout
# works. Exits 0 in the main clone or when the command stays inside the
# current worktree.
#
# Output protocol (https://code.claude.com/docs/en/hooks):
#   exit 0, no output -> allow
#   exit 2 + stderr   -> block; stderr is shown to Claude

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=lib/worktree-paths.sh
source "$SCRIPT_DIR/lib/worktree-paths.sh"

INPUT=$(cat)

wt_in_linked_worktree || exit 0
CURRENT=$(wt_current_root)

CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null) || exit 0
[[ -z "$CMD" ]] && exit 0

# Pull every separator-delimited token that looks like an absolute path, then
# test each against the worktree boundaries. Comparing tokens (vs regexing the
# whole command) keeps false positives down and reports which token tripped.
TOKENS=$(echo "$CMD" | grep -oE '/[^[:space:];|&<>"'\'']+' || true)

while IFS= read -r TOKEN; do
  [[ -z "$TOKEN" ]] && continue
  # Strip trailing punctuation that isn't part of a path.
  TOKEN=${TOKEN%[,.:;]}

  if wt_path_escapes "$TOKEN"; then
    cat >&2 <<MSG
Bash command references a different git worktree, not the current one.

  Command:          $CMD
  Offending path:   $TOKEN
  Current worktree: $CURRENT

Use paths under the current worktree, or relative paths from cwd.
MSG
    exit 2
  fi
done <<< "$TOKENS"

exit 0
