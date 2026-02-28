#!/bin/bash
set -euo pipefail

# Run ShellCheck to lint shell scripts for common issues.
# Uses a local shellcheck binary if available, otherwise falls back to Docker.
#
# Example usage:
#
# Lint a single script:
#   .ci/shellcheck/shellcheck.sh test/scripts/init-influxdb3.sh
#
# Lint all staged shell scripts (used by Lefthook):
#   .ci/shellcheck/shellcheck.sh scripts/deploy-staging.sh test/scripts/*.sh

SHELLCHECK_VERSION="0.10.0"
SHELLCHECK_MAJOR_MIN=0
SHELLCHECK_MINOR_MIN=9

if command -v shellcheck &>/dev/null; then
  local_version=$(shellcheck --version 2>/dev/null \
    | grep -oE 'version: [0-9.]+' \
    | grep -oE '[0-9.]+' || true)
  local_major=${local_version%%.*}
  local_rest=${local_version#*.}
  local_minor=${local_rest%%.*}

  if [[ -z "$local_major" ]] ||
     [[ "$local_major" -lt "$SHELLCHECK_MAJOR_MIN" ]] ||
     [[ "$local_major" -eq "$SHELLCHECK_MAJOR_MIN" && "${local_minor:-0}" -lt "$SHELLCHECK_MINOR_MIN" ]]; then
    echo "WARNING: local ShellCheck version ($local_version) may be incompatible (expected v${SHELLCHECK_MAJOR_MIN}.${SHELLCHECK_MINOR_MIN}.x+)." >&2
    echo "  Upgrade: brew install shellcheck  (or see https://www.shellcheck.net/)" >&2
    echo "  Falling back to Docker (koalaman/shellcheck:v${SHELLCHECK_VERSION})..." >&2
  else
    shellcheck "$@"
    exit $?
  fi
fi

# Docker fallback — mount repo read-only, run from workdir
docker run \
  --rm \
  --label tag=influxdata-docs \
  --label stage=lint \
  --mount type=bind,src="$(pwd)",dst=/workdir,readonly \
  -w /workdir \
  "koalaman/shellcheck:v${SHELLCHECK_VERSION}" \
  "$@"
