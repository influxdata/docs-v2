#!/bin/bash
# Check for non-standard InfluxData support links.
#
# Allowed URLs:
#   https://support.influxdata.com/s/                (Support home)
#   https://support.influxdata.com/s/contactsupport  (Contact Support)
#
# Allowed Markdown links:
#   [contact InfluxData Support](https://support.influxdata.com/s/contactsupport)
#   [Contact InfluxData Support](https://support.influxdata.com/s/contactsupport)
#   [InfluxData Support](https://support.influxdata.com/s/)
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

# Each Markdown link (on one line) to support.influxdata.com
LINK_PATTERN='\[[^]]*\]\(https?://support\.influxdata\.com[^)]*\)'

# The full Markdown link must be exactly one of the allowed forms
ALLOW_LINK_PATTERN='^(\[[cC]ontact InfluxData Support\]\(https://support\.influxdata\.com/s/contactsupport\)|\[InfluxData Support\]\(https://support\.influxdata\.com/s/\))$'

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

URL_MATCHES=""
while IFS= read -r entry; do
  [[ -z "$entry" ]] && continue
  url="${entry#*:*:}"
  if ! [[ "$url" =~ $ALLOW_PATTERN ]]; then
    URL_MATCHES+="$entry"$'\n'
  fi
done <<< "$URLS"

# file:line:link for every Markdown support link found
LINKS=$(grep -HnoE "$LINK_PATTERN" "${md_files[@]}" || true)

LINK_MATCHES=""
while IFS= read -r entry; do
  [[ -z "$entry" ]] && continue
  link="${entry#*:*:}"
  if ! [[ "$link" =~ $ALLOW_LINK_PATTERN ]]; then
    LINK_MATCHES+="$entry"$'\n'
  fi
done <<< "$LINKS"

status=0

if [[ -n "$URL_MATCHES" ]]; then
  printf '%s' "$URL_MATCHES"
  echo ""
  echo "ERROR: Found non-standard support.influxdata.com URLs."
  echo "Allowed URLs:"
  echo "  https://support.influxdata.com/s/"
  echo "  https://support.influxdata.com/s/contactsupport"
  echo ""
  status=1
fi

if [[ -n "$LINK_MATCHES" ]]; then
  printf '%s' "$LINK_MATCHES"
  echo ""
  echo "ERROR: Found non-standard InfluxData Support link text."
  echo "Allowed links:"
  echo "  [contact InfluxData Support](https://support.influxdata.com/s/contactsupport)"
  echo "  [InfluxData Support](https://support.influxdata.com/s/)  (names Support without asking the reader to contact it)"
  echo ""
  status=1
fi

if [[ $status -ne 0 ]]; then
  echo "See DOCS-CONTRIBUTING.md for details."
fi

exit $status
