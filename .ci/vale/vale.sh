#!/bin/bash
set -euo pipefail

# Run Vale to lint files for writing style and consistency.
# Uses a local vale binary if available, otherwise falls back to Docker.
#
# If neither a compatible local binary nor a running Docker daemon is
# available (for example, in sandboxed agent sessions where the Docker daemon
# and GitHub release downloads are both unavailable), the check is skipped
# with a warning and exits 0 so pre-commit hooks don't force a full
# `git commit --no-verify` bypass. The pr-vale-check.yml workflow remains the
# authoritative gate and sets VALE_STRICT=1, which turns the skip into a
# failure instead.
#
# Example usage:
#
# Lint all added and modified files in the cloud-dedicated directory:
# git diff --name-only --diff-filter=d HEAD \
#   | grep "content/influxdb/cloud-dedicated" \
#   | xargs .ci/vale/vale.sh \
#       --minAlertLevel=suggestion \
#       --config=content/influxdb/cloud-dedicated/.vale.ini

VALE_VERSION="3.15.1"
VALE_MAJOR_MIN=3

if command -v vale &>/dev/null; then
  local_version=$(vale --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || true)
  local_major=${local_version%%.*}

  if [[ -z "$local_major" || "$local_major" -lt "$VALE_MAJOR_MIN" ]]; then
    echo "WARNING: local Vale version ($local_version) may be incompatible (expected v${VALE_MAJOR_MIN}.x+)." >&2
    echo "  Upgrade or install Vale: see https://vale.sh/docs/install/ (for Homebrew: brew upgrade vale)" >&2
    echo "  Falling back to Docker (jdkato/vale:v${VALE_VERSION})..." >&2
  else
    vale "$@"
    exit $?
  fi
fi

if command -v docker &>/dev/null && docker info &>/dev/null; then
  docker run \
    --rm \
    --label tag=influxdata-docs \
    --label stage=lint \
    --mount type=bind,src="$(pwd)",dst=/workdir \
    -w /workdir \
    --entrypoint /bin/vale \
    "jdkato/vale:v${VALE_VERSION}" \
    "$@"
  exit $?
fi

if [[ "${VALE_STRICT:-0}" == "1" ]]; then
  echo "ERROR: Vale is unavailable (no local binary >= v${VALE_MAJOR_MIN} and no Docker daemon) and VALE_STRICT=1 is set." >&2
  echo "  Install Vale: see https://vale.sh/docs/install/" >&2
  exit 1
fi

echo "WARNING: Skipping Vale — no local binary (>= v${VALE_MAJOR_MIN}) and no Docker daemon available." >&2
echo "  Style checks still run in CI (pr-vale-check.yml) and block merge on errors." >&2
echo "  To run Vale locally, install it: see https://vale.sh/docs/install/" >&2
exit 0
