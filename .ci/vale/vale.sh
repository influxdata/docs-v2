#!/bin/bash

# Run Vale to lint files for writing style and consistency

# Example usage:

# Lint all added and modified files in the cloud-dedicated directory and report suggestions, warnings, and errors.

# git diff --name-only --diff-filter=d HEAD | grep "content/influxdb/cloud-dedicated" | xargs .ci/vale/vale.sh --minAlertLevel=suggestion --config=content/influxdb/cloud-dedicated/.vale.ini

# Lint files provided as arguments
docker run \
  --rm \
  --label tag=influxdata-docs \
  --label stage=lint \
  --mount type=bind,src=$(pwd),dst=/workdir \
  -w /workdir \
  --entrypoint /bin/vale \
  jdkato/vale:latest \
  "$@"