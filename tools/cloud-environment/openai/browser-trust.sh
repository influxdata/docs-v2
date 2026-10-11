#!/usr/bin/env bash
# Explicit setup step. Never call to bypass a rejected approval.
set -euo pipefail
: "${DOCS_PROXY_CA_FILE:?Set DOCS_PROXY_CA_FILE to the platform-provided PEM CA certificate}"
command -v certutil >/dev/null
command -v openssl >/dev/null
openssl x509 -in "$DOCS_PROXY_CA_FILE" -noout >/dev/null
docs_nss_db="${DOCS_BROWSER_NSS_DB:-$HOME/.pki/nssdb}"
mkdir -p "$docs_nss_db"
if [[ ! -f "$docs_nss_db/cert9.db" ]]; then
  certutil -N --empty-password -d "sql:$docs_nss_db"
fi
certutil -A -d "sql:$docs_nss_db" -n docs-cloud-proxy -t 'C,,' -i "$DOCS_PROXY_CA_FILE"
echo "Imported proxy CA. Verify an allowed HTTPS origin in Chromium before claiming browser trust works."
