#!/bin/bash
# Check that bundled-CLI InfluxDB 3 content does not resolve a separate CLI
# version with {{< latest-patch cli=true >}}.
#
# latest-patch with cli=true reads products.influxdb.latest_cli — the InfluxDB
# v1/v2 `influx` CLI version. In Core, Enterprise, and Cloud, the influxdb3 CLI
# ships with the server and shares its version, so there is no separate CLI
# version to resolve. Because latest-patch is a valid shortcode, this mistake
# renders the wrong (v2) version instead of failing the build — so a lint is the
# only thing that catches it.
#
# Scope — products whose CLI is bundled with the server:
#   - content/influxdb3/{core,enterprise,cloud}/  (product trees)
#   - content/shared/influxdb3-*/                 (shared source they render from)
#
# Out of scope (cli=true is legitimate there): InfluxDB v1/v2 and Cloud
# Serverless use the separately versioned v2 `influx` CLI. Cloud Dedicated and
# Clustered use influxctl via {{< latest-influxctl >}}, which this check does
# not match.
#
# Usage:
#   check-v3-cli-version.sh [file ...]
#   - With args: check only the given files (used by lefthook on staged files)
#   - Without args: check all bundled-CLI InfluxDB 3 content

set -euo pipefail

# Matches a latest-patch shortcode ({{< or {{%) that sets the cli parameter,
# e.g. {{< latest-patch cli=true >}} or {{% latest-patch product="x" cli=true %}}.
# [^}]* stays on one line (grep is line-oriented); latest-patch is always
# invoked on a single line. A whitespace before cli keeps it a distinct arg.
shortcode_re='\{\{[<%]-?[[:space:]]*latest-patch[^}]*[[:space:]]cli[[:space:]]*='

# True when a path is bundled-CLI InfluxDB 3 content this rule governs.
is_bundled_cli_content() {
  case "$1" in
    content/influxdb3/core/*) return 0 ;;
    content/influxdb3/enterprise/*) return 0 ;;
    content/influxdb3/cloud/*) return 0 ;;
    content/shared/influxdb3-*) return 0 ;;
    *) return 1 ;;
  esac
}

md_files=()
if [[ $# -gt 0 ]]; then
  for f in "$@"; do
    [[ -f "$f" && "$f" == *.md ]] && is_bundled_cli_content "$f" && md_files+=("$f")
  done
else
  # Portable across bash 3.2 (macOS system bash) — mapfile is bash 4+.
  # Read NUL-delimited paths so unusual filenames don't split incorrectly.
  while IFS= read -r -d '' f; do
    md_files+=("$f")
  done < <(find content/influxdb3/core content/influxdb3/enterprise \
                content/influxdb3/cloud content/shared \
                -name "*.md" -type f -print0)
fi

if [[ ${#md_files[@]} -eq 0 ]]; then
  echo "No bundled-CLI InfluxDB 3 markdown files to check."
  exit 0
fi

violations=()
for file in "${md_files[@]}"; do
  is_bundled_cli_content "$file" || continue
  while IFS= read -r match; do
    violations+=("$file:$match")
  done < <(grep -nE "$shortcode_re" "$file" || true)
done

if [[ ${#violations[@]} -eq 0 ]]; then
  exit 0
fi

echo "❌ Found {{< latest-patch cli=true >}} in bundled-CLI InfluxDB 3 content:"
for v in "${violations[@]}"; do
  echo "   $v"
done
echo ""
echo "   cli=true renders the v1/v2 influx CLI version, which is wrong for the"
echo "   influxdb3 CLI. In Core, Enterprise, and Cloud, the influxdb3 CLI ships"
echo "   with the server and shares its version — use {{< latest-patch >}}"
echo "   (the server/product version) without cli=true."
exit 1
