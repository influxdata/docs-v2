#!/bin/bash

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <RELEASE>"
  exit 1
fi

RELEASE="$1"
IMAGE="us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:$RELEASE"
WORKDIR=$(mktemp -d)

# Target directory relative to where the script is run
BASE_DIR="./static/downloads/clustered-release-artifacts"
TARGET_DIR="$BASE_DIR/$RELEASE"

echo "Creating release directory: $TARGET_DIR"
mkdir -p "$TARGET_DIR"

echo "Fetching manifest digest..."
DIGEST=$(DOCKER_CONFIG=/tmp/influxdbsecret crane manifest "$IMAGE" | jq -r '.layers[1].digest')

echo "Downloading and extracting assets..."
DOCKER_CONFIG=/tmp/influxdbsecret \
crane blob "$IMAGE@$DIGEST" | tar -xvzf - -C "$WORKDIR"

# Find the top-level extracted directory
SUBDIR=$(find "$WORKDIR" -mindepth 1 -maxdepth 1 -type d)

echo "Copying selected files to release directory..."
cp "$SUBDIR/app-instance-schema.json" "$TARGET_DIR/"
cp "$SUBDIR/example-customer.yml" "$TARGET_DIR/"

echo "Cleaning up temporary directory..."
rm -rf "$WORKDIR"

echo "Done. Selected assets for $RELEASE are in $TARGET_DIR"
