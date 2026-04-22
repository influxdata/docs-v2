#!/bin/bash

# This script is used to run Pytest for the InfluxDB documentation.
# Supports both container (default) and host-runner execution.
#
# Environment variables (with container defaults):
#   REPO_ROOT  - Path to the docs-v2 repo (default: /src)
#   WORK_DIR   - Scratch directory for preprocessed content (default: /app)
#   SHARED_DIR - Directory for shared logs/URLs (default: /shared)
#   ENV_FILE   - Path to .env.test credentials file (default: $WORK_DIR/.env.test)

# Required arguments:
#  - A space-separated list of file paths--the files to test--as unnamed arguments.

REPO_ROOT="${REPO_ROOT:-/src}"
WORK_DIR="${WORK_DIR:-/app}"
SHARED_DIR="${SHARED_DIR:-/shared}"
ENV_FILE="${ENV_FILE:-${WORK_DIR}/.env.test}"

src_path=""

if [[ $CONTENT_PATH =~ ^content/. ]]; then
  src_path=$(find "${REPO_ROOT}/${CONTENT_PATH}" -type d)
fi

if [[ ! $src_path ]]; then
  echo "The CONTENT_PATH variable must reference a directory inside content/."
  exit 1
fi

runner="$1"
tests="${*:2}"

rm -rf "${WORK_DIR:?}/${CONTENT_PATH:?}"/*
bash "${REPO_ROOT}/test/scripts/prepare-content.sh" "$tests"

setup() {
  # Set up the environment for the tests.

  ## Store test configuration in $WORK_DIR/appdata.
  mkdir -p "${WORK_DIR}/appdata"

  ## Parse YAML config files into dotenv files to be used by tests.
  ## You must source the parse_yaml function before you can use it.
  source /usr/local/bin/parse_yaml
  parse_yaml "${REPO_ROOT}/data/products.yml" > "${WORK_DIR}/appdata/.env.products"
  chmod -R +x "${WORK_DIR}/appdata/"

  ## Source non-sensitive environment variables for all test runners.
  set -a
  # shellcheck disable=SC1090
  source "${WORK_DIR}"/appdata/.env.*
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
    --envfile="${ENV_FILE}" \
    --override-ini="log_file=${SHARED_DIR}/tests_run.log" \
    "$tests"
fi
