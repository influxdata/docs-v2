#!/bin/bash

# Generate API reference documentation for all InfluxDB products.
#
# Pipeline:
#   1. post-process-specs.ts  — apply info/servers overlays + tag configs,
#      write resolved specs to _build/ (source specs are never mutated)
#   2. generate-openapi-articles.js — generate Hugo content pages + copy
#      resolved specs to static/openapi/ for download
#
# Specs must already be fetched and bundled (via getswagger.sh) before running.
#
# Usage:
#   sh generate-api-docs.sh       # Generate all products
#   sh generate-api-docs.sh -h    # Show help

set -e

function showHelp {
  echo "Usage: generate-api-docs.sh <options>"
  echo "Options:"
  echo "  -h  Show this help message"
}

while getopts "h" opt; do
  case ${opt} in
    h)
      showHelp
      exit 0
      ;;
    \?)
      echo "Invalid option: $OPTARG" 1>&2
      showHelp
      exit 22
      ;;
  esac
done

# ---------------------------------------------------------------------------
# Step 1: Post-process specs (info/servers overlays + tag configs)
# ---------------------------------------------------------------------------
# Writes resolved specs to api-docs/_build/. Source specs are never mutated.
# Runs from the repo root because post-process-specs reads .config.yml paths
# relative to the api-docs/ directory.

echo ""
echo "========================================"
echo "Step 1: Post-processing specs"
echo "========================================"
(cd .. && node api-docs/scripts/dist/post-process-specs.js)

# ---------------------------------------------------------------------------
# Step 2: Generate Hugo-native article data and content pages
# ---------------------------------------------------------------------------
# Discovers products from .config.yml, processes specs from _build/,
# generates tag-based article data and Hugo content pages.

echo ""
echo "========================================"
echo "Step 2: Generating article data and pages"
echo "========================================"
(cd .. && node api-docs/scripts/dist/generate-openapi-articles.js --skip-fetch)

echo ""
echo "========================================"
echo "Done"
echo "========================================"
