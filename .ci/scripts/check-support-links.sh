#!/bin/bash
# Check for non-standard InfluxData support links.
#
# Allowed URLs:
#   https://support.influxdata.com/s/                (Support home)
#   https://support.influxdata.com/s/contactsupport  (Contact Support)
#
# Usage:
#   check-support-links.sh [file ...]
#   - With args: check only the given files
#   - Without args: check all content/**/*.md

set -euo pipefail

# Each support.influxdata.com URL, up to the first character that ends a link
URL_PATTERN='https?://support\.influxdata\.com[^][:space:]()<>"`'"'"']*'

# The full URL must be exactly one of the allowed forms
ALLOW_PATTERN='^https://support\.influxdata\.com/s/(contactsupport)?[.,;:]?$'

if [[ $# -gt 0 ]]; then
  md_files=()
  for f in "$@"; do
    [[ -f "$f" && "$f" == *.md ]] && md_files+=("$f")
  done
  if [[ ${#md_files[@]} -eq 0 ]]; then
    echo "No markdown files to check."
    exit 0
  fi
else
  md_files=()
  while IFS= read -r -d '' f; do
    md_files+=("$f")
  done < <(find content -name '*.md' -type f -print0)
fi

# file:line:url for every support URL found
URLS=$(grep -HnoE "$URL_PATTERN" "${md_files[@]}" || true)

MATCHES=""
while IFS= read -r entry; do
  [[ -z "$entry" ]] && continue
  url="${entry#*:*:}"
  if ! [[ "$url" =~ $ALLOW_PATTERN ]]; then
    MATCHES+="$entry"$'\n'
  fi
done <<< "$URLS"

if [[ -n "$MATCHES" ]]; then
  printf '%s' "$MATCHES"
  echo ""
  echo "ERROR: Found non-standard support.influxdata.com URLs."
  echo "Allowed URLs:"
  echo "  https://support.influxdata.com/s/"
  echo "  https://support.influxdata.com/s/contactsupport"
  echo "See DOCS-CONTRIBUTING.md for details."
  exit 1
fi
