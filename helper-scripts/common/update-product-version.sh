#!/bin/bash
# Automatically updates version numbers in products.yml

set -e

PRODUCT=""
VERSION=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --product) PRODUCT="$2"; shift 2 ;;
    --version) VERSION="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# Update products.yml using yq
yq eval -i ".influxdb3_${PRODUCT}.latest_patch = \"${VERSION}\"" data/products.yml

# Update Docker compose examples
find compose-examples/ -name "*.yml" -exec sed -i "s/influxdb:3-${PRODUCT}:[0-9.]+/influxdb:3-${PRODUCT}:${VERSION}/g" {} \;

echo "✅ Updated version to ${VERSION} for ${PRODUCT}"