#!/bin/bash
# Run lint-codeblocks and emit a human-readable summary instead of the
# full per-file ::group:: log.
#
# Usage:
#   scripts/ci/lint-codeblocks-pretty.sh content/**/*.md
#
# Exit status mirrors lint-codeblocks: 0 if no parse errors, 1 if any
# JSON / YAML / TOML block fails. Non-blocking warnings (bash, python,
# javascript) appear in the summary but don't change the exit code.

set -uo pipefail

DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
ROOT=$(cd -- "$DIR/../.." && pwd)

LOG=$(mktemp -t lint-codeblocks.XXXXXX)
trap 'rm -f "$LOG"' EXIT

node "$ROOT/scripts/ci/lint-codeblocks.mjs" "$@" > "$LOG" 2>&1
LINT_EXIT=$?

"$DIR/lint-codeblocks-summary.sh" "$LOG"

# Lint exit code is authoritative — the summary just reports it.
exit "$LINT_EXIT"
