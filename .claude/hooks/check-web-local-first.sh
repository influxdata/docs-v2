#!/bin/bash
# PreToolUse hook: keep documentation lookups local-first.
#
# docs.influxdata.com is generated from this repository's content/ files,
# so fetching those pages returns a stale, rendered copy of content that is
# already on disk. Block WebFetch against that host and point Claude at the
# local Read/Grep/Glob tools instead.
#
# Every other host -- code.claude.com, github.com, third-party docs and
# APIs -- is genuinely external and passes through untouched. This replaces
# an earlier LLM "prompt" hook that guessed per-URL and false-positived on
# external documentation (e.g. code.claude.com).
#
# WebSearch is intentionally not gated: a search query has no host to match
# deterministically, and blanket-blocking it was the source of the friction.
#
# Output protocol (https://code.claude.com/docs/en/hooks):
#   exit 0, no output                 -> no decision; normal permission flow
#   JSON permissionDecision "deny"    -> block the tool call with a reason

set -euo pipefail

INPUT=$(cat)

# Only WebFetch carries a URL. Anything without one passes through.
URL=$(printf '%s' "$INPUT" | jq -r '.tool_input.url // empty' 2>/dev/null) || exit 0
[[ -z "$URL" ]] && exit 0

# Host = strip scheme, any user@creds, path, and :port; then lowercase.
HOST=${URL#*://}
HOST=${HOST#*@}
HOST=${HOST%%/*}
HOST=${HOST%%:*}
HOST=$(printf '%s' "$HOST" | tr '[:upper:]' '[:lower:]')

if [[ "$HOST" == "docs.influxdata.com" ]]; then
  jq -n --arg url "$URL" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: (
        "\($url) is InfluxData published documentation, generated from this " +
        "repository. Read the source locally instead: Grep or Glob under " +
        "content/ for the text, or Read the matching content/**/*.md file. " +
        "WebFetch is for genuinely external resources (GitHub, third-party " +
        "docs/APIs, code.claude.com, or URLs the user provided)."
      )
    }
  }'
  exit 0
fi

exit 0
