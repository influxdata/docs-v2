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



setup() {
  # Set up the environment for the tests.

  ## Store test configuration in /app/appdata.
  mkdir -p /app/appdata

  ## Parse YAML config files into dotenv files to be used by tests.
  ## You must source the parse_yaml function before you can use it.
  source /usr/local/bin/parse_yaml
  parse_yaml /src/data/products.yml > /app/appdata/.env.products
  chmod -R +x /app/appdata/

  ## Source non-sensitive environment variables for all test runners.
  set -a
  source /app/appdata/.env.*
  set +a

  # Miscellaneous test setup.
  # For macOS samples.
  mkdir -p ~/Downloads && rm -rf ~/Downloads/*
}

setup

if [[ $runner == "pytest" ]]; then
    pytest \
    -ra \
    -s \
    --codeblocks \
    --suppress-no-test-exit-code \
    --exitfirst \
    --envfile=/app/.env.test \
    $tests
fi
