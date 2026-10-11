#!/usr/bin/env bash
# Checks tools, local rendering, and HTTPS trust.
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/setup.sh"
cd -- "$DOCS_WORKTREE"
docs_nss_db="${DOCS_BROWSER_NSS_DB:-$HOME/.pki/nssdb}"
if [[ -f "$docs_nss_db/cert9.db" && ( ! -w "$docs_nss_db" || ! -w "$docs_nss_db/cert9.db" ) ]]; then
  echo "Chromium needs write access to its NSS database: $docs_nss_db" >&2
  exit 1
fi
docs_https_url="${DOCS_BROWSER_HTTPS_URL:-https://www.google.com/recaptcha/enterprise.js}"
if [[ "$docs_https_url" != https://* ]]; then
  echo "DOCS_BROWSER_HTTPS_URL must use HTTPS." >&2
  exit 1
fi
node --version
yarn --version
hugo version
"$PUPPETEER_EXECUTABLE_PATH" --version
cypress verify
node tools/cloud-environment/openai/browser-smoke.mjs
node tools/cloud-environment/openai/browser-smoke.mjs "$docs_https_url"
