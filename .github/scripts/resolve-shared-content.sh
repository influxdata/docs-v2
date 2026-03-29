#!/bin/bash
# Resolve shared content files to their consuming product pages.
#
# Usage:
#   echo "content/shared/foo.md" | ./resolve-shared-content.sh
#   ./resolve-shared-content.sh < changed_files.txt
#   ./resolve-shared-content.sh changed_files.txt
#
# For shared files (content/shared/*), finds all pages with matching
# `source:` frontmatter and outputs those instead. Non-shared files
# pass through unchanged.

set -euo pipefail

# Read input from file argument or stdin
if [[ $# -gt 0 && -f "$1" ]]; then
  INPUT=$(cat "$1")
else
  INPUT=$(cat)
fi

# Process each file
while IFS= read -r file; do
  [[ -z "$file" ]] && continue

  if [[ "$file" == content/shared/* ]]; then
    # Extract the shared path portion (e.g., /shared/influxdb3-cli/foo.md)
    SHARED_PATH="${file#content}"

    # Find all files that source this shared content
    # The source frontmatter looks like: source: /shared/path/to/file.md
    CONSUMERS=$(grep -rl "^source: ${SHARED_PATH}$" content/ 2>/dev/null | grep -v '^content/shared/' || true)

    if [[ -n "$CONSUMERS" ]]; then
      echo "$CONSUMERS"
    else
      # No consumers found - output the shared file itself
      # (Vale can still lint it with default config)
      echo "$file"
    fi
  else
    # Non-shared file - pass through
    echo "$file"
  fi
done <<< "$INPUT" | sort -u
