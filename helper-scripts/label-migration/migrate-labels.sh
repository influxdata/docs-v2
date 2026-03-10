#!/usr/bin/env bash
set -euo pipefail

# Migrate issues and PRs from old labels to new labels.
# For each mapping, finds all issues with the old label and adds the new label.
# Does NOT remove old labels — that happens in delete-labels.sh after verification.
#
# Usage:
#   ./migrate-labels.sh              # Migrate labels in influxdata/docs-v2
#   ./migrate-labels.sh --dry-run    # Print what would happen without executing
#   REPO=owner/repo ./migrate-labels.sh  # Target a different repo

REPO="${REPO:-influxdata/docs-v2}"
DRY_RUN=false

if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "=== DRY RUN — no issues will be modified ==="
  echo
fi

migrate_label() {
  local old_label="$1"
  local new_label="$2"
  local note="${3:-}"

  echo "--- $old_label → $new_label"
  if [[ -n "$note" ]]; then
    echo "    Note: $note"
  fi

  # Get all open and closed issues/PRs with the old label
  local numbers
  numbers=$(gh issue list \
    --repo "$REPO" \
    --label "$old_label" \
    --state all \
    --json number \
    --jq '.[].number' 2>/dev/null || true)

  if [[ -z "$numbers" ]]; then
    echo "    No issues found with label '$old_label'"
    echo
    return
  fi

  local count
  count=$(echo "$numbers" | wc -l | tr -d ' ')
  echo "    Found $count issue(s)"

  for num in $numbers; do
    if $DRY_RUN; then
      echo "    Would add '$new_label' to #$num"
    else
      if gh issue edit "$num" \
        --repo "$REPO" \
        --add-label "$new_label" 2>/dev/null; then
        echo "    ✓ #$num"
      else
        echo "    ✗ #$num (failed)"
      fi
    fi
  done
  echo
}

# Flag issues that need manual review instead of automatic migration
flag_for_review() {
  local old_label="$1"
  local reason="$2"

  echo "--- ⚠ $old_label — NEEDS MANUAL REVIEW"
  echo "    Reason: $reason"

  local numbers
  numbers=$(gh issue list \
    --repo "$REPO" \
    --label "$old_label" \
    --state all \
    --json number,title \
    --jq '.[] | "#\(.number) \(.title)"' 2>/dev/null || true)

  if [[ -z "$numbers" ]]; then
    echo "    No issues found"
  else
    echo "$numbers" | while IFS= read -r line; do
      echo "    $line"
    done
  fi
  echo
}

echo "Repository: $REPO"

migrate_label "alerts"                                   "product:v2"
migrate_label "InfluxDB v2"                              "product:v2"
migrate_label "InfluxDB 3 Core and Enterprise"           "product:v3-monolith"

echo "=== Done ==="
echo
echo "Next steps:"
echo "  1. Review any issues flagged above"
echo "  2. Verify a sample of migrated issues in the GitHub UI"
echo "  3. Once satisfied, run delete-labels.sh to remove old labels"
