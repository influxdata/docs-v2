#!/bin/bash
# Check for non-standard InfluxData support links.
#
# Allowed URLs:
#   https://support.influxdata.com              (Support home)
#   https://support.influxdata.com/s/contactsupport  (Contact Support)
#
# Usage:
#   check-support-links.sh [file ...]
#   - With args: check only the given files
#   - Without args: check all content/**/*.md

set -euo pipefail

# Step 1: find lines containing support.influxdata.com with any path
FIND_PATTERN='https://support\.influxdata\.com/'

# Step 2: exclude the one allowed path (/s/contactsupport not followed by more path)
ALLOW_PATTERN='https://support\.influxdata\.com/s/contactsupport([^[:alnum:]/]|$)'

# Run grep on explicit file args or default to find + grep
if [[ $# -gt 0 ]]; then
  md_files=()
  for f in "$@"; do
    [[ -f "$f" && "$f" == *.md ]] && md_files+=("$f")
  done
  if [[ ${#md_files[@]} -eq 0 ]]; then
    echo "No markdown files to check."
    exit 0
  fi
  MATCHES=$(grep -Hn "$FIND_PATTERN" "${md_files[@]}" || true)
else
  MATCHES=$(find content -name '*.md' -type f -print0 \
    | xargs -0 grep -Hn "$FIND_PATTERN" || true)
fi

# Filter out the allowed contact support URL
MATCHES=$(echo "$MATCHES" | grep -vE "$ALLOW_PATTERN" || true)

if [[ -n "$MATCHES" ]]; then
  echo "$MATCHES"
  echo ""
  echo "ERROR: Found non-standard support.influxdata.com URLs."
  echo "Allowed URLs:"
  echo "  https://support.influxdata.com"
  echo "  https://support.influxdata.com/s/contactsupport"
  echo "See DOCS-CONTRIBUTING.md for details."
  exit 1
fi
