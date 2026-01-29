#!/bin/bash

# Test runner for docs CLI tests
# Run with: bash scripts/docs-cli/__tests__/run-tests.sh

echo "🧪 Running docs CLI tests..."
echo ""

FAILED=0

# Unit tests
echo "━━━ Unit Tests ━━━"
echo ""

node scripts/docs-cli/__tests__/editor-resolver.test.js
[ $? -ne 0 ] && FAILED=1

node scripts/docs-cli/__tests__/process-manager.test.js
[ $? -ne 0 ] && FAILED=1

# Integration tests (catches import path errors)
echo ""
echo "━━━ Integration Tests ━━━"

node scripts/docs-cli/__tests__/cli-integration.test.js
[ $? -ne 0 ] && FAILED=1

# Summary
echo ""
if [ $FAILED -eq 0 ]; then
  echo "✅ All tests passed!"
  exit 0
else
  echo "❌ Some tests failed"
  exit 1
fi
