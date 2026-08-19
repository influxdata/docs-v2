#!/bin/bash
set -euo pipefail

# Run remark-lint to check and auto-fix markdown formatting in instruction
# and repository documentation files. Uses a local npm install under
# .ci/remark-lint/ — no Docker. If Node or the install fails locally, the
# script exits non-zero and CI (.github/workflows/pr-remark-check.yml)
# catches any drift on the PR.
#
# Example usage:
#
# Lint a single file:
# .ci/remark/remark.sh README.md --frail --quiet
#
# Auto-fix staged instruction files:
# .ci/remark/remark.sh README.md DOCS-TESTING.md --output --quiet

REMARK_DIR="$(cd "$(dirname "$0")/../remark-lint" && pwd)"
LOCAL_REMARK="${REMARK_DIR}/node_modules/.bin/remark"

if ! command -v node >/dev/null 2>&1; then
  echo "remark.sh: Node is required (install Node 22 LTS)." >&2
  exit 1
fi

if [[ ! -x "$LOCAL_REMARK" ]]; then
  echo "Installing remark dependencies in .ci/remark-lint/ (first run only)..." >&2
  if command -v yarn >/dev/null 2>&1; then
    (cd "$REMARK_DIR" && yarn install --frozen-lockfile --silent)
  elif command -v npm >/dev/null 2>&1; then
    (cd "$REMARK_DIR" && npm install --no-audit --no-fund --silent)
  else
    echo "remark.sh: yarn or npm is required to install remark dependencies." >&2
    exit 1
  fi
fi

# remark's ESM plugin resolver imports plugins relative to the config file
# location. The root .remarkrc.yaml's plugins are only installed under
# .ci/remark-lint/node_modules/, so disable config discovery and pass the
# same plugin set + bullet setting on the CLI. Run remark from
# .ci/remark-lint/ so --use plugins resolve there; translate relative file
# paths to absolute paths so they still read correctly.
REPO_ROOT="$(pwd)"
args=()
for arg in "$@"; do
  case "$arg" in
    /*|-*)              args+=("$arg") ;;
    *.md|*.markdown)    args+=("${REPO_ROOT}/${arg}") ;;
    *)                  args+=("$arg") ;;
  esac
done

cd "$REMARK_DIR"
exec "$LOCAL_REMARK" \
  --no-config \
  --use remark-gfm \
  --use remark-frontmatter \
  --use remark-preset-lint-consistent \
  --setting 'bullet:"-"' \
  "${args[@]}"
