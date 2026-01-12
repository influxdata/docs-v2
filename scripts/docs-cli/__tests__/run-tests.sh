#!/bin/bash

# Simple test runner for docs CLI unit tests
# Run with: bash scripts/docs-cli/__tests__/run-tests.sh

echo "🧪 Running docs CLI unit tests..."
echo ""

# Run each test file
node scripts/docs-cli/__tests__/editor-resolver.test.js
EDITOR_RESULT=$?

node scripts/docs-cli/__tests__/process-manager.test.js
PROCESS_RESULT=$?

# Summary
if [ $EDITOR_RESULT -eq 0 ] && [ $PROCESS_RESULT -eq 0 ]; then
  echo "✅ All unit tests passed!"
  exit 0
else
  echo "❌ Some tests failed"
  exit 1
fi
