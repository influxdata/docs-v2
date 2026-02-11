#!/bin/bash
# Run Vale on files with appropriate product-specific configs.
#
# Usage:
#   ./vale-check.sh file1.md file2.md ...
#   ./vale-check.sh < files.txt
#   ./vale-check.sh --files files.txt
#
# Groups files by their Vale config, runs Vale once per group,
# and outputs combined JSON results.
#
# Exit codes:
#   0 - No errors (warnings/suggestions allowed)
#   1 - One or more errors found

set -euo pipefail

# Parse arguments
FILES=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --files)
      shift
      while IFS= read -r f; do
        [[ -n "$f" ]] && FILES+=("$f")
      done < "$1"
      shift
      ;;
    *)
      FILES+=("$1")
      shift
      ;;
  esac
done

# Read from stdin if no files provided
if [[ ${#FILES[@]} -eq 0 ]]; then
  while IFS= read -r f; do
    [[ -n "$f" ]] && FILES+=("$f")
  done
fi

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "No files to check" >&2
  exit 0
fi

# Map file to Vale config
get_vale_config() {
  local file="$1"
  case "$file" in
    content/influxdb3/cloud-dedicated/*)  echo "content/influxdb3/cloud-dedicated/.vale.ini" ;;
    content/influxdb3/cloud-serverless/*) echo "content/influxdb3/cloud-serverless/.vale.ini" ;;
    content/influxdb/v2/*)                echo "content/influxdb/v2/.vale.ini" ;;
    content/*)                            echo ".vale.ini" ;;
    *)                                    echo ".vale-instructions.ini" ;;
  esac
}

# Group files by config
declare -A CONFIG_GROUPS
for file in "${FILES[@]}"; do
  config=$(get_vale_config "$file")
  CONFIG_GROUPS["$config"]+="$file"$'\n'
done

# Run Vale for each config group and collect results
ALL_RESULTS='{"files": {}, "errors": 0, "warnings": 0, "suggestions": 0}'
TOTAL_ERRORS=0

for config in "${!CONFIG_GROUPS[@]}"; do
  files="${CONFIG_GROUPS[$config]}"
  # Remove trailing newline and convert to array
  mapfile -t file_array <<< "${files%$'\n'}"

  echo "Running Vale with config: $config (${#file_array[@]} files)" >&2

  # Run Vale via Docker
  RESULT=$(docker run --rm \
    -v "$(pwd)":/workdir \
    -w /workdir \
    jdkato/vale:latest \
    --config="$config" \
    --output=JSON \
    --minAlertLevel=suggestion \
    "${file_array[@]}" 2>/dev/null || true)

  if [[ -n "$RESULT" && "$RESULT" != "null" ]]; then
    # Merge results - Vale outputs {filepath: [alerts...]}
    # Count errors in this batch
    BATCH_ERRORS=$(echo "$RESULT" | jq '[.[][].Severity] | map(select(. == "error")) | length')
    BATCH_WARNINGS=$(echo "$RESULT" | jq '[.[][].Severity] | map(select(. == "warning")) | length')
    BATCH_SUGGESTIONS=$(echo "$RESULT" | jq '[.[][].Severity] | map(select(. == "suggestion")) | length')

    TOTAL_ERRORS=$((TOTAL_ERRORS + BATCH_ERRORS))

    # Merge file results into ALL_RESULTS
    ALL_RESULTS=$(echo "$ALL_RESULTS" | jq --argjson new "$RESULT" \
      --argjson e "$BATCH_ERRORS" \
      --argjson w "$BATCH_WARNINGS" \
      --argjson s "$BATCH_SUGGESTIONS" \
      '.files += $new | .errors += $e | .warnings += $w | .suggestions += $s')
  fi
done

# Output combined results
echo "$ALL_RESULTS"

# Exit with error if any errors found
if [[ $TOTAL_ERRORS -gt 0 ]]; then
  exit 1
fi
exit 0
