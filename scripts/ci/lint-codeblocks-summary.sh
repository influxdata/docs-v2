#!/bin/bash
# Summarize a lint-codeblocks log into a human-readable report.
#
# Usage:
#   # Summarize an existing log
#   scripts/ci/lint-codeblocks-summary.sh /tmp/lint.log
#
#   # Pipe lint output through the summarizer
#   node scripts/ci/lint-codeblocks.mjs content/**/*.md 2>&1 \
#     | scripts/ci/lint-codeblocks-summary.sh
#
# The full lint log is consumed (stdin or file path); the summary is
# written to stdout. Exit status is 0 if no ::error annotations, 1 if
# any are present — matching the lint script's own contract so this
# wrapper can stand in for the raw command in CI when only the summary
# is wanted.

set -uo pipefail

if [[ $# -gt 1 ]]; then
  echo "Usage: $0 [log-file]" >&2
  echo "  Reads from stdin if no file is given." >&2
  exit 2
fi

# Buffer to a temp file so we can grep/awk over it multiple times.
TMP=$(mktemp -t lint-summary.XXXXXX)
trap 'rm -f "$TMP"' EXIT

if [[ $# -eq 1 ]]; then
  cat -- "$1" > "$TMP"
else
  cat > "$TMP"
fi

# --- Counts ---------------------------------------------------------------
err_count=$(grep -c '^::error' "$TMP" || true)
warn_count=$(grep -c '^::warning' "$TMP" || true)
notice_count=$(grep -c '^::notice' "$TMP" || true)

passed=$(grep -c '✓' "$TMP" || true)
failed=$(grep -c '✗' "$TMP" || true)
skipped=$(grep -cE 'skipped \(out of scope\)' "$TMP" || true)

files_processed=$(grep -c '^::group::' "$TMP" || true)
files_with_annotations=$(grep -E '^::error|^::warning' "$TMP" \
  | sed 's/.*file=//' \
  | sed 's/,line=.*//' \
  | sort -u \
  | wc -l \
  | tr -d ' ')

# --- Output ---------------------------------------------------------------
printf '## Lint code blocks — summary\n\n'

printf '| Category | Count |\n'
printf '|---|---|\n'
printf '| Files processed | %s |\n' "$files_processed"
printf '| Files with annotations | %s |\n' "$files_with_annotations"
printf '| Blocks passed | %s |\n' "$passed"
printf '| Blocks failed | %s |\n' "$failed"
printf '| Blocks skipped (out of scope) | %s |\n' "$skipped"
printf '\n'

printf '### Annotations\n\n'
printf '| Severity | Count | Effect on PR |\n'
printf '|---|---|---|\n'
# shellcheck disable=SC2016 # `::error::` etc. are GitHub workflow command
# literals, not shell expansions — single quotes are intentional.
printf '| `::error::` (JSON / YAML / TOML) | **%s** | Blocks CI |\n' "$err_count"
# shellcheck disable=SC2016
printf '| `::warning::` (bash / python / javascript) | %s | Informational |\n' "$warn_count"
# shellcheck disable=SC2016
printf '| `::notice::` (normalization fired) | %s | Informational |\n' "$notice_count"
printf '\n'

# Failures by language: column 4 of "  ✗ line N  LANG  failed: ..." lines.
printf '### Failures by language\n\n'
printf '| Language | Failed |\n'
printf '|---|---|\n'
grep '^  ✗' "$TMP" \
  | awk '{print $4}' \
  | sort \
  | uniq -c \
  | sort -rn \
  | awk '{ printf "| %s | %s |\n", $2, $1 }'
printf '\n'

# Top files with ::error annotations (the blocking ones).
top_err_files=$(grep '^::error' "$TMP" \
  | sed 's/.*file=//' \
  | sed 's/,line=.*//' \
  | sort | uniq -c | sort -rn | head -15)

if [[ -n "$top_err_files" ]]; then
  printf '### Top files with blocking errors\n\n'
  printf '| Errors | File |\n'
  printf '|---|---|\n'
  echo "$top_err_files" | awk '{ count=$1; $1=""; sub(/^ /, ""); printf "| %s | %s |\n", count, $0 }'
  printf '\n'

  printf '### First 10 ::error samples\n\n'
  grep '^::error' "$TMP" | head -10 | sed 's/^/    /'
  printf '\n'
fi

# Notice samples (normalization rules that fired).
if [[ "$notice_count" -gt 0 ]]; then
  printf '### Notice samples (first 10)\n\n'
  grep '^::notice' "$TMP" | head -10 | sed 's/^/    /'
  printf '\n'
fi

# Match the lint script's exit contract so this can wrap the raw command.
[[ "$err_count" -eq 0 ]]
