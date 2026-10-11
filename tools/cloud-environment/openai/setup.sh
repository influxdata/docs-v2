#!/usr/bin/env bash
# Source to configure the current shell; execute to install the environment.
docs_setup_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DOCS_WORKTREE="$(cd -- "$docs_setup_dir/../../.." && pwd)" || return 1 2>/dev/null || exit 1
export DOCS_WORKTREE
export DOCS_CACHE_ROOT="${DOCS_CACHE_ROOT:-/workspace/.cache}"
export DOCS_ENVIRONMENT_ARTIFACTS="${DOCS_ENVIRONMENT_ARTIFACTS:-/workspace/environment-artifacts/docs-v2}"
export COREPACK_HOME="${COREPACK_HOME:-$DOCS_CACHE_ROOT/corepack}"
export YARN_CACHE_FOLDER="${YARN_CACHE_FOLDER:-$DOCS_CACHE_ROOT/yarn}"
export npm_config_cache="${npm_config_cache:-$DOCS_CACHE_ROOT/npm}"
export HUGO_CACHEDIR="${HUGO_CACHEDIR:-$DOCS_CACHE_ROOT/hugo}"
export HUGO_RESOURCEDIR="${HUGO_RESOURCEDIR:-$DOCS_ENVIRONMENT_ARTIFACTS/resources}"
export PUPPETEER_CACHE_DIR="${PUPPETEER_CACHE_DIR:-$DOCS_CACHE_ROOT/puppeteer}"
export CYPRESS_CACHE_FOLDER="${CYPRESS_CACHE_FOLDER:-$DOCS_CACHE_ROOT/cypress}"
export XDG_CACHE_HOME="${XDG_CACHE_HOME:-$DOCS_CACHE_ROOT/xdg}"
export PUPPETEER_SKIP_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH="${PUPPETEER_EXECUTABLE_PATH:-/usr/bin/chromium}"
export NODE_USE_ENV_PROXY=1
export PATH="$DOCS_CACHE_ROOT/bin:$DOCS_WORKTREE/node_modules/.bin:$PATH"
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  exec bash "$docs_setup_dir/install.sh" "$@"
fi
unset docs_setup_dir
