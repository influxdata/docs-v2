#!/bin/bash

# Generate API reference documentation for all InfluxDB products.
#
# Pipeline:
#   1. tsc  — compile TypeScript scripts to dist/ (skip with --no-build)
#   2. post-process-specs.ts  — apply info/servers overlays + tag configs,
#      write resolved specs to _build/ (source specs are never mutated)
#   3. generate-openapi-articles.js — generate Hugo content pages + copy
#      resolved specs to static/openapi/ for download
#
# Specs must already be fetched and bundled (via getswagger.sh) before running.
#
# Generated content pages are always overwritten. To preserve specific files,
# pass --preserve=<glob> (forwarded to generate-openapi-articles).
#
# Usage:
#   sh generate-api-docs.sh                       # Rebuild scripts + regenerate
#   sh generate-api-docs.sh --no-build            # Skip TypeScript rebuild
#   sh generate-api-docs.sh --preserve='path/*'   # Preserve matching files
#   sh generate-api-docs.sh -h                    # Show help

set -e

# Resolve repo root from script location so the script runs from anywhere.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

BUILD_SCRIPTS=1
FORWARD_ARGS=()

function showHelp {
  cat <<EOF
Usage: generate-api-docs.sh [options]

Options:
  --no-build             Skip TypeScript compilation of scripts (faster reruns)
  --preserve=<pattern>   Preserve files matching glob pattern (forwarded to
                         generate-openapi-articles; repeatable)
  -h, --help             Show this help message
EOF
}

for arg in "$@"; do
  case "$arg" in
    -h|--help)
      showHelp
      exit 0
      ;;
    --no-build)
      BUILD_SCRIPTS=0
      ;;
    --preserve=*)
      FORWARD_ARGS+=("$arg")
      ;;
    *)
      echo "Unknown option: $arg" 1>&2
      showHelp
      exit 22
      ;;
  esac
done

# ---------------------------------------------------------------------------
# Step 1: Compile TypeScript scripts (skip with --no-build)
# ---------------------------------------------------------------------------
if [ "$BUILD_SCRIPTS" -eq 1 ]; then
  echo ""
  echo "========================================"
  echo "Step 1: Compiling TypeScript scripts"
  echo "========================================"
  (cd "${REPO_ROOT}" && yarn build:api-docs:scripts)
else
  echo ""
  echo "(Skipping TypeScript build — --no-build)"
fi

# ---------------------------------------------------------------------------
# Step 2: Post-process specs (info/servers overlays + tag configs)
# ---------------------------------------------------------------------------
# Writes resolved specs to api-docs/_build/. Source specs are never mutated.
# Runs from the repo root because post-process-specs reads .config.yml paths
# relative to the api-docs/ directory.

echo ""
echo "========================================"
echo "Step 2: Post-processing specs"
echo "========================================"
(cd "${REPO_ROOT}" && node api-docs/scripts/dist/post-process-specs.js)

# ---------------------------------------------------------------------------
# Step 3: Generate Hugo-native article data and content pages
# ---------------------------------------------------------------------------
# Discovers products from .config.yml, processes specs from _build/,
# generates tag-based article data and Hugo content pages.

echo ""
echo "========================================"
echo "Step 3: Generating article data and pages"
echo "========================================"
(cd "${REPO_ROOT}" && node api-docs/scripts/dist/generate-openapi-articles.js --skip-fetch "${FORWARD_ARGS[@]}")

echo ""
echo "========================================"
echo "Done"
echo "========================================"
