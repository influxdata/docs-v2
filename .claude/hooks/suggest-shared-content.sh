#!/bin/bash
# PostToolUse hook: nudge toward shared content for InfluxDB 3 searches.
#
# Most InfluxDB 3 prose lives in content/shared/influxdb3-*/; the product
# directories (content/influxdb3/core/, .../enterprise/) are usually thin
# stubs with `source:` references. When a Grep/Glob targets only those
# product directories, results can look incomplete (frontmatter stubs only).
#
# This hook is deterministic and scoped: it stays silent unless a search
# genuinely targeted core/ or enterprise/ WITHOUT also covering shared
# content. It never blocks — it only adds context for Claude.
#
# Exit codes:
#   0 = always (PostToolUse cannot block; the tool already ran)

set -euo pipefail

# Read hook input JSON from stdin
INPUT=$(cat)

# Collect the search-target fields: path, glob, and pattern cover both
# Grep (path/glob/pattern) and Glob (path/pattern).
TARGETS=$(echo "$INPUT" | jq -r '
  [.tool_input.path, .tool_input.glob, .tool_input.pattern]
  | map(select(. and . != "")) | join(" ")
' 2>/dev/null) || exit 0

[[ -z "$TARGETS" ]] && exit 0

# Did the search reference an InfluxDB 3 product directory?
if [[ "$TARGETS" != *content/influxdb3/core/* \
   && "$TARGETS" != *content/influxdb3/enterprise/* ]]; then
  exit 0
fi

# Did it already cover shared content? Then no reminder is needed.
if [[ "$TARGETS" == *content/shared/influxdb3* ]]; then
  exit 0
fi

# Relevant search that skipped shared content — surface a gentle reminder
# as additional context rather than an error.
REMINDER="Most InfluxDB 3 prose lives in content/shared/influxdb3-*/; \
content/influxdb3/core/ and .../enterprise/ are usually thin stubs with \
source: references. If these results look incomplete or only contain \
frontmatter, search content/shared/influxdb3-*/ as well."

jq -n --arg ctx "$REMINDER" '{
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: $ctx
  }
}'

exit 0
