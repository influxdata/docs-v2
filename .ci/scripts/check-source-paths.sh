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
  # Portable across bash 3.2 (macOS system bash) — `mapfile`/`readarray` is
  # bash 4+. Read NUL-delimited paths so filenames with embedded newlines
  # (rare but possible) don't split incorrectly.
  md_files=()
  while IFS= read -r -d '' f; do
    md_files+=("$f")
  done < <(find content/ -name "*.md" -type f -print0)
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
      sub(/[[:space:]]+$/, "")
      # Quote-aware extraction:
      #   "value"[ws]?[# trailing comment]   → keep inner text verbatim
      #   'value'[ws]?[# trailing comment]   → keep inner text verbatim
      #   value   [ws]+[# trailing comment]  → strip trailing comment
      #
      # For quoted values, whitespace before # is optional (matches the
      # lenient behavior of js-yaml and the JS regex in
      # scripts/lib/content-utils.js getSourceFromFrontmatter — both
      # accept `source: "/shared/foo.md"#note`).
      #
      # For unquoted plain scalars, whitespace before # is REQUIRED —
      # foo#bar is a literal value, foo #bar has trailing comment #bar.
      #
      # Quotes are only stripped when both ends match — malformed quoting
      # (missing closing quote) falls through to the unquoted branch,
      # leaving the leading quote intact so the canonical-form check
      # below flags it as a violation rather than silently "repairing"
      # broken YAML.
      if (match($0, /^"[^"]*"([[:space:]]*#.*)?$/)) {
        sub(/^"/, "")
        sub(/"([[:space:]]*#.*)?$/, "")
      } else if (match($0, /^'"'"'[^'"'"']*'"'"'([[:space:]]*#.*)?$/)) {
        sub(/^'"'"'/, "")
        sub(/'"'"'([[:space:]]*#.*)?$/, "")
      } else {
        sub(/[[:space:]]+#.*$/, "")
        sub(/[[:space:]]+$/, "")
      }
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
