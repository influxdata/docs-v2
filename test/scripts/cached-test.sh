#!/bin/bash

# Cache test results by content hash
# Usage: cached-test.sh <file_or_directory>
#
# This script caches successful test results based on the content hash.
# If the file hasn't changed since the last successful test, it skips retesting.

set -e

CACHE_DIR="${TEST_CACHE_DIR:-.test-cache}"
mkdir -p "$CACHE_DIR"

TARGET="$1"

if [[ -z "$TARGET" ]]; then
  echo "Usage: cached-test.sh <file_or_directory>"
  exit 1
fi

# Calculate hash based on content
calculate_hash() {
  local target="$1"

  if [[ -f "$target" ]]; then
    # Single file - hash its content
    sha256sum "$target" | cut -d' ' -f1
  elif [[ -d "$target" ]]; then
    # Directory - hash all markdown files
    find "$target" -name "*.md" -type f -exec sha256sum {} \; | \
      sort | sha256sum | cut -d' ' -f1
  else
    echo "Target not found: $target" >&2
    return 1
  fi
}

# Get content hash
CONTENT_HASH=$(calculate_hash "$TARGET")
CACHE_FILE="$CACHE_DIR/${CONTENT_HASH}.passed"
CACHE_META="$CACHE_DIR/${CONTENT_HASH}.meta"

echo "Target: $TARGET"
echo "Content hash: $CONTENT_HASH"

# Check cache
if [[ -f "$CACHE_FILE" ]]; then
  CACHE_AGE=$(($(date +%s) - $(stat -c %Y "$CACHE_FILE" 2>/dev/null || stat -f %m "$CACHE_FILE" 2>/dev/null)))
  CACHE_AGE_DAYS=$((CACHE_AGE / 86400))

  # Cache expires after 7 days
  if [[ $CACHE_AGE -lt 604800 ]]; then
    echo "✅ Cache hit! Tests passed $CACHE_AGE_DAYS day(s) ago"

    if [[ -f "$CACHE_META" ]]; then
      echo "Cache metadata:"
      cat "$CACHE_META"
    fi

    echo ""
    echo "Skipping tests (use TEST_CACHE_BYPASS=1 to force retest)"

    # Allow bypassing cache
    if [[ -n "$TEST_CACHE_BYPASS" ]]; then
      echo "Cache bypass enabled - running tests anyway"
    else
      exit 0
    fi
  else
    echo "Cache expired (older than 7 days) - will retest"
    rm -f "$CACHE_FILE" "$CACHE_META"
  fi
else
  echo "❌ Cache miss - running tests"
fi

# Run tests
echo ""
echo "Running tests for: $TARGET"

TEST_START=$(date +%s)

# Execute pytest with the target
if pytest \
  -ra \
  -s \
  --codeblocks \
  --suppress-no-test-exit-code \
  --exitfirst \
  --envfile=/app/.env.test \
  "$TARGET"; then

  TEST_END=$(date +%s)
  TEST_DURATION=$((TEST_END - TEST_START))

  # Cache successful result
  touch "$CACHE_FILE"

  # Save metadata
  cat > "$CACHE_META" << EOF
target: $TARGET
hash: $CONTENT_HASH
tested_at: $(date -Iseconds)
duration_seconds: $TEST_DURATION
pytest_version: $(pytest --version | head -n1)
EOF

  echo ""
  echo "✅ Tests passed! Result cached for 7 days"
  echo "   Cache file: $CACHE_FILE"
  echo "   Test duration: ${TEST_DURATION}s"

  exit 0
else
  EXIT_CODE=$?
  echo ""
  echo "❌ Tests failed - result NOT cached"
  exit $EXIT_CODE
fi
