#!/bin/bash
# Shared helpers for the worktree-guard PreToolUse hooks.
#
# Decides whether an absolute path belongs to a git worktree OTHER than the
# current one (the main clone counts as a worktree here). The boundaries are
# derived from `git worktree list`, never from an assumed path prefix, so the
# guard works for any layout: worktrees nested under the main clone
# (<repo>/.claude/worktrees/x), sibling directories (<repo>.worktrees/x), or
# anywhere else the user prefers.
#
# This file is sourced, not executed. It defines functions only.

# Print the current worktree root, or fail if not in a git repo.
wt_current_root() {
  git rev-parse --show-toplevel 2>/dev/null
}

# Print every worktree root (one per line), main clone first.
wt_all_roots() {
  git worktree list --porcelain 2>/dev/null | awk '/^worktree /{print substr($0, 10)}'
}

# Are we inside a *linked* worktree (not the main clone)? The main clone is
# always the first entry of `git worktree list`. Returns 0 when linked.
wt_in_linked_worktree() {
  local current main
  current=$(wt_current_root) || return 1
  [[ -z "$current" ]] && return 1
  main=$(wt_all_roots | head -n1)
  [[ -n "$main" && "$current" != "$main" ]]
}

# Return 0 if $1 (an absolute path) lives in a worktree DIFFERENT from the
# current one; return 1 otherwise (inside the current worktree, or not inside
# any worktree at all -- e.g. /tmp, /usr, an external clone).
#
# Uses longest-prefix matching so a worktree nested inside the main clone
# correctly claims its own files instead of the main clone claiming them.
wt_path_escapes() {
  local target=$1 current root match=""
  current=$(wt_current_root) || return 1
  [[ -z "$current" ]] && return 1

  while IFS= read -r root; do
    [[ -z "$root" ]] && continue
    if [[ "$target" == "$root" || "$target" == "$root"/* ]]; then
      (( ${#root} > ${#match} )) && match=$root
    fi
  done < <(wt_all_roots)

  # Not under any worktree -> external path, not our concern.
  [[ -z "$match" ]] && return 1
  # Under the current worktree -> fine.
  [[ "$match" == "$current" ]] && return 1
  # Under some other worktree (or the main clone) -> escape.
  return 0
}
