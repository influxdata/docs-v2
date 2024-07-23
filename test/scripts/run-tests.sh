#!/bin/bash

# This script is used to run Pytest for the InfluxDB documentation.

# Required arguments:
#  - A space-separated list of file paths--the files to test--as unnamed arguments.

src_path=""

if [[ $CONTENT_PATH =~ ^content/. ]]; then
# Find the source content path in the container.
  src_path=$(find "/src/${CONTENT_PATH}" -type d)
fi

if [[ ! $src_path ]]; then
  echo "The CONTENT_PATH variable must reference a directory inside content/."
  exit 1
fi

runner="$1"
tests="${*:2}"

rm -rf /app/"${CONTENT_PATH}"/*
bash /src/test/scripts/prepare-content.sh $tests

if [[ $runner == "pytest" ]]; then
    pytest \
    -s \
    --codeblocks \
    --suppress-no-test-exit-code \
    --exitfirst \
    --envfile=/app/.env.test \
    $tests
fi
