#!/usr/bin/env bash
#
# check-no-test-fixtures.sh
#
# Assert that a production Hugo build emits no test-fixture pages. Test
# fixtures live under `__tests__/` (per-product shortcode regression
# pages, the version-detector component page, etc.) and must never ship
# to production, where AI retrievers and curl-based agents would index
# them. Production exclusion is enforced by a `render: never` cascade in
# config/production/hugo.yml; this script is the behavioral backstop that
# fails the build if that cascade is removed or stops matching. See
# influxdata/docs-v2#7241.
#
# Run this against the production build output (the same `public/` that
# check-render-artifacts.sh scans). It is a no-op cost on top of the
# existing build.
#
# Usage:
#   .ci/scripts/check-no-test-fixtures.sh [target]
#
# Arguments:
#   target   Directory to scan. Defaults to `public`.
#
# Exit codes:
#   0  No __tests__ output found.
#   1  At least one __tests__ artifact found (prints the offenders).
#   2  Target directory does not exist.

set -euo pipefail

TARGET="${1:-public}"

if [[ ! -d "$TARGET" ]]; then
  echo "::error::check-no-test-fixtures: target '$TARGET' does not exist. Did Hugo build succeed?"
  exit 2
fi

hits=$(find "$TARGET" -path '*__tests__*' -type f 2>/dev/null || true)

if [[ -z "$hits" ]]; then
  echo "✅ check-no-test-fixtures: no __tests__ output in '$TARGET'."
  exit 0
fi

count=$(printf '%s\n' "$hits" | wc -l | tr -d ' ')
echo "::error::Found $count test-fixture artifact(s) under '__tests__/' in the production build."
echo "   Cause: the production cascade in config/production/hugo.yml is no longer"
echo "   excluding __tests__ paths (render: never), so test fixtures would ship to"
echo "   production. See influxdata/docs-v2#7241."
echo "   Offending files:"
printf '%s\n' "$hits" | head -20 | sed 's/^/     /'
exit 1
