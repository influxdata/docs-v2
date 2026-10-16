#!/bin/bash
# Automatically updates version numbers in products.yml

set -e

PRODUCT=""
VERSION=""
QUAY_TAG=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --product) PRODUCT="$2"; shift 2 ;;
    --version) VERSION="$2"; shift 2 ;;
    --quay-tag) QUAY_TAG="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# Core and Enterprise images on Quay are tagged by release commit SHA.
# latest_quay_tag must change with latest_patch (enforced by
# .ci/scripts/check-quay-tag.js in pr-release-check.yml).
if [[ -n "$QUAY_TAG" ]]; then
  if [[ "$PRODUCT" != "core" && "$PRODUCT" != "enterprise" ]]; then
    echo "❌ --quay-tag applies only to core and enterprise"; exit 1
  fi
  if [[ ! "$QUAY_TAG" =~ ^[0-9a-f]{40}$ ]]; then
    echo "❌ --quay-tag must be a full 40-character commit SHA"; exit 1
  fi
fi

# Update products.yml using yq
yq eval -i ".influxdb3_${PRODUCT}.latest_patch = \"${VERSION}\"" data/products.yml
if [[ -n "$QUAY_TAG" ]]; then
  yq eval -i ".influxdb3_${PRODUCT}.latest_quay_tag = \"${QUAY_TAG}\"" data/products.yml
elif [[ "$PRODUCT" == "core" || "$PRODUCT" == "enterprise" ]]; then
  echo "⚠️  No --quay-tag given: set influxdb3_${PRODUCT}.latest_quay_tag to the ${VERSION} release commit SHA"
fi

# Update Docker compose examples
find compose-examples/ -name "*.yml" -exec sed -i "s/influxdb:3-${PRODUCT}:[0-9.]+/influxdb:3-${PRODUCT}:${VERSION}/g" {} \;

echo "✅ Updated version to ${VERSION} for ${PRODUCT}"