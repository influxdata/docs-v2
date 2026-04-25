#!/bin/bash
# Check that source: frontmatter values use the canonical /shared/... form.
#
# The source: key points to a shared content file. The canonical form is:
#   source: /shared/path/to/file.md
#
# Non-canonical forms found in the repo (e.g. /content/shared/..., shared/...)
# confuse canonical-source resolution and can cause content to be silently
# skipped during linting. This check flags them so they can be corrected.
#
# Usage:
#   check-source-paths.sh [file ...]
#   - With args: check only the given files
#   - Without args: check all content/**/*.md

set -euo pipefail

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
  mapfile -t md_files < <(find content/ -name "*.md" -type f)
fi

violations=()

for file in "${md_files[@]}"; do
  # Extract source: value from frontmatter only (between the first --- pair).
  # awk enters frontmatter mode on the first line if it's ---, exits on the
  # next ---, and prints the source: value if found.
  source_val=$(awk '
    NR==1 && /^---[[:space:]]*$/ { in_fm=1; next }
    in_fm && /^---[[:space:]]*$/ { exit }
    in_fm && /^source:/ {
      sub(/^source:[[:space:]]*/, "")
      # Strip optional surrounding quotes
      gsub(/^["'"'"']|["'"'"']$/, "")
      print
      exit
    }
  ' "$file")

  if [[ -z "$source_val" ]]; then
    continue
  fi

  if [[ "$source_val" != /shared/* ]]; then
    violations+=("$file: source: $source_val")
  fi
done

if [[ ${#violations[@]} -eq 0 ]]; then
  exit 0
fi

echo "❌ Non-canonical source: paths found (must start with /shared/):"
for v in "${violations[@]}"; do
  echo "   $v"
done
echo ""
echo "   Correct form: source: /shared/path/to/file.md"
echo "   See DOCS-CONTRIBUTING.md § Shared Content for details."
exit 1
