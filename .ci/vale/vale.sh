#!/bin/bash
set -euo pipefail

# Run Vale to lint files for writing style and consistency.
# Uses a local vale binary if available, otherwise falls back to Docker.
#
# Example usage:
#
# Lint all added and modified files in the cloud-dedicated directory:
# git diff --name-only --diff-filter=d HEAD \
#   | grep "content/influxdb/cloud-dedicated" \
#   | xargs .ci/vale/vale.sh \
#       --minAlertLevel=suggestion \
#       --config=content/influxdb/cloud-dedicated/.vale.ini

VALE_VERSION="3.13.1"
VALE_MAJOR_MIN=3

if command -v vale &>/dev/null; then
  local_version=$(vale --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || true)
  local_major=${local_version%%.*}

  if [[ -z "$local_major" || "$local_major" -lt "$VALE_MAJOR_MIN" ]]; then
    echo "WARNING: local Vale version ($local_version) may be incompatible (expected v${VALE_MAJOR_MIN}.x+)." >&2
    echo "  Upgrade: brew install vale  (or see https://vale.sh/docs/install/)" >&2
    echo "  Falling back to Docker (jdkato/vale:v${VALE_VERSION})..." >&2
  else
    vale "$@"
    exit $?
  fi
fi

docker run \
  --rm \
  --label tag=influxdata-docs \
  --label stage=lint \
  --mount type=bind,src="$(pwd)",dst=/workdir \
  -w /workdir \
  --entrypoint /bin/vale \
  "jdkato/vale:v${VALE_VERSION}" \
  "$@"
