#!/usr/bin/env bash
#
# check-render-artifacts.sh
#
# Scan built Hugo HTML for forbidden render artifacts — patterns that
# should be impossible on a correctly built page. Their presence signals
# a rendering bug (whitespace leak in a render hook, broken shortcode
# template, etc.) that would otherwise ship to production as visibly
# broken content.
#
# The canonical example is influxdata/docs-v2#7079, where a whitespace
# leak in the `placeholders`/`callout` branch of render-codeblock.html
# caused Goldmark to HTML-escape highlighted code blocks into literal
# `<pre><code>&lt;div class=&quot;highlight&quot;…` fragments on every
# page that used either attribute. Every pattern in this script is a
# fingerprint of that class of bug.
#
# Usage:
#   .ci/scripts/check-render-artifacts.sh [target]
#
# Arguments:
#   target   Directory or file to scan. Defaults to `public`.
#
# Exit codes:
#   0  No forbidden patterns found.
#   1  At least one forbidden pattern found. The script prints every
#      offending file and the pattern that matched.
#   2  Target directory/file does not exist.
#
# Run this immediately after `npx hugo --quiet` in CI so that any
# regression fails the build before downstream jobs (Cypress, Vale,
# link-check) waste time.
#
# Known gaps / possible future additions:
#
#   - `{{<` / `{{%`   : Indicates an unrendered Hugo shortcode. Currently
#                      excluded because legitimate docs contain Helm and
#                      Go template examples that use `{{` syntax inside
#                      code fences, producing unavoidable false positives.
#                      Could be re-added as a scoped regex that requires
#                      the delimiters to appear outside `<code>` / `<pre>`.
#
#   - `ZgotmplZ`      : Hugo's context-escape sentinel. Currently excluded
#                      because a pre-existing bug emits it into
#                      `data-influxdb-urls="#ZgotmplZ"` on ~4600 pages.
#                      Re-add after that bug is fixed.

set -euo pipefail

TARGET="${1:-public}"

if [[ ! -e "$TARGET" ]]; then
  echo "::error::check-render-artifacts: target '$TARGET' does not exist. Did Hugo build succeed?"
  exit 2
fi

# Forbidden patterns, format: "PATTERN|DESCRIPTION"
#
# Every pattern below is HTML-escaped chroma output (`<div class="highlight">`,
# `<pre tabindex="0">`, `<span class="line">`). Goldmark only produces those
# escaped forms when it has interpreted legitimate chroma HTML as plain-text
# content — i.e. when a render hook or wrapper shortcode leaked whitespace and
# Goldmark re-wrapped the highlighted output as an indented code block.
PATTERNS=(
  "&lt;div class=&quot;highlight&quot;|Goldmark re-wrapped highlighted code as an indented code block (see #7079). Likely cause: whitespace leak in a render hook (layouts/_default/_markup/render-*.html) or a wrapper shortcode template."
  "&lt;pre tabindex=&quot;0&quot;|Escaped chroma <pre> wrapper — same class of bug as #7079."
  "&lt;span class=&quot;line&quot;&gt;&lt;span class=&quot;cl&quot;|Escaped chroma line span — same class of bug as #7079."
)

failed=0
total_hits=0

for entry in "${PATTERNS[@]}"; do
  pattern="${entry%%|*}"
  description="${entry#*|}"

  if [[ -d "$TARGET" ]]; then
    hits=$(grep -rlF --include='*.html' "$pattern" "$TARGET" 2>/dev/null || true)
  else
    hits=$(grep -lF "$pattern" "$TARGET" 2>/dev/null || true)
  fi

  if [[ -n "$hits" ]]; then
    count=$(printf '%s\n' "$hits" | wc -l | tr -d ' ')
    total_hits=$((total_hits + count))
    failed=1

    echo "::error::Found forbidden render artifact in $count file(s): '$pattern'"
    echo "   Cause: $description"
    echo "   First 10 affected files:"
    printf '%s\n' "$hits" | head -10 | sed 's/^/     /'
    echo ""
  fi
done

# Flattened-markdown patterns. These appear when a template extracts a
# "teaser" from a structured markdown description and joins multiple
# lines into a single paragraph before passing to `markdownify`. The
# canonical case is influxdata/docs-v2#7122, where the API section
# children partial flattened a numbered list with embedded code fences
# into one <p>. Unlike the chroma patterns above, these are regex
# matches and require `grep -rlE`.
#
# Patterns are intentionally strict (3+ ordered-list markers) to keep
# false positives near zero on prose that legitimately enumerates.
PATTERNS_REGEX=(
  "<p[^>]*>.*\\s[0-9]+\\.\\s.*\\s[0-9]+\\.\\s.*\\s[0-9]+\\.|Flattened ordered list in prose — three or more 'N.' markers in one paragraph. Likely cause: a template joined multi-line markdown with ' ' before markdownify (see #7122)."
  "<p[^>]*>[^<]*\`\`\`|Raw markdown code fence inside a prose paragraph. Likely cause: a template passed a description containing code fences to markdownify after flattening newlines."
)

for entry in "${PATTERNS_REGEX[@]}"; do
  pattern="${entry%%|*}"
  description="${entry#*|}"

  if [[ -d "$TARGET" ]]; then
    hits=$(grep -rlE --include='*.html' "$pattern" "$TARGET" 2>/dev/null || true)
  else
    hits=$(grep -lE "$pattern" "$TARGET" 2>/dev/null || true)
  fi

  if [[ -n "$hits" ]]; then
    count=$(printf '%s\n' "$hits" | wc -l | tr -d ' ')
    total_hits=$((total_hits + count))
    failed=1

    echo "::error::Found forbidden render artifact in $count file(s): '$pattern'"
    echo "   Cause: $description"
    echo "   First 10 affected files:"
    printf '%s\n' "$hits" | head -10 | sed 's/^/     /'
    echo ""
  fi
done

if [[ $failed -eq 0 ]]; then
  echo "✅ check-render-artifacts: no forbidden patterns found in '$TARGET'."
  exit 0
fi

echo "❌ check-render-artifacts: found $total_hits rendering artifact(s) across the built site."
echo ""
echo "See the '::error::' lines above for the specific patterns and their causes."
echo "Two canonical cases:"
echo "  - Chroma re-escape (&lt;div class=&quot;highlight&quot; etc.): whitespace"
echo "    leak in a render hook. Fix: add {{- ... -}} trimming. See #7079."
echo "  - Flattened markdown in prose (numbered-list markers or code fences"
echo "    inside <p>): a template joined multi-line markdown with ' ' before"
echo "    markdownify. Fix: stop at paragraph boundaries. See #7122."
exit 1
