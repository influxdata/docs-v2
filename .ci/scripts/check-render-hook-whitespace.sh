#!/usr/bin/env bash
#
# check-render-hook-whitespace.sh
#
# Pre-commit lint for Hugo render hooks (layouts/_default/_markup/render-*.html).
#
# Enforces the invariant that every action tag inside a render hook must
# use `{{- ... -}}` whitespace trimming. Bare `{{ ... }}` actions leak
# their surrounding indent and trailing newline into the rendered output,
# which causes Goldmark to interpret the result as an indented code block
# and HTML-escape any leading HTML (see influxdata/docs-v2#7079 for the
# canonical failure mode).
#
# The only exception is template comments (`{{/* ... */}}`), which
# produce no output regardless of trimming.
#
# Usage:
#   .ci/scripts/check-render-hook-whitespace.sh [file...]
#
# Typical invocation from lefthook pre-commit:
#   glob: "layouts/_default/_markup/render-*.html"
#   run: .ci/scripts/check-render-hook-whitespace.sh {staged_files}
#
# Exit codes:
#   0  All action tags in the provided files are whitespace-trimmed.
#   1  At least one bare `{{ ... }}` action was found.

set -euo pipefail

if [[ $# -eq 0 ]]; then
  exit 0
fi

failed=0

for file in "$@"; do
  [[ -f "$file" ]] || continue

  # Match any line whose first non-whitespace `{{` is not followed by `-`
  # (i.e. a bare opening action), AND whose matching `}}` is not preceded
  # by `-` (bare closing action).
  #
  # Exclude template comments `{{/* ... */}}` since they produce no
  # output and are unaffected by whitespace.
  #
  # Exclude lines where `{{` appears only inside a string literal (e.g.
  # `print "...{{..."`), detected by requiring the action to start the
  # line (after optional whitespace).
  offenders=$(grep -nE '^\s*\{\{[^-/]' "$file" | grep -vE '\{\{/\*' || true)

  # Also catch bare closing actions: `... }}` without the leading `-}}`.
  # Only warn on lines that also start with an action (avoid false
  # positives from string literals spanning multiple lines).
  closing_offenders=$(grep -nE '[^-]\}\}\s*$' "$file" | grep -E '^\s*\{\{' | grep -vE '\{\{-' || true)

  all_offenders=$(printf '%s\n%s\n' "$offenders" "$closing_offenders" | grep -v '^$' | sort -u || true)

  if [[ -n "$all_offenders" ]]; then
    failed=1
    echo "❌ $file: found bare {{ ... }} action tag(s) in a render hook."
    echo "   Every action inside layouts/_default/_markup/render-*.html must"
    echo "   use whitespace-trimming delimiters ({{- ... -}}) to prevent"
    echo "   leaked whitespace from breaking Goldmark's HTML-block detection."
    echo "   See influxdata/docs-v2#7079 for the canonical failure."
    echo ""
    printf '%s\n' "$all_offenders" | sed 's/^/     /'
    echo ""
  fi
done

if [[ $failed -eq 1 ]]; then
  echo "Fix: rewrite each offending action with {{- ... -}} trimming."
  echo "Example: '{{ \$x := foo }}' → '{{- \$x := foo -}}'"
  exit 1
fi

exit 0
