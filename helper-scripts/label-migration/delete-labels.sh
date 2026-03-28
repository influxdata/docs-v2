#!/usr/bin/env bash
set -euo pipefail

# Delete old labels after migration is verified.
# DESTRUCTIVE — requires interactive confirmation for each batch.
#
# Run this ONLY after:
#   1. create-labels.sh has been run
#   2. migrate-labels.sh has been run
#   3. A sample of migrated issues has been manually verified
#
# Usage:
#   ./delete-labels.sh              # Delete labels (with confirmation prompts)
#   ./delete-labels.sh --dry-run    # Print what would be deleted
#   REPO=owner/repo ./delete-labels.sh  # Target a different repo

REPO="${REPO:-influxdata/docs-v2}"
DRY_RUN=false

if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "=== DRY RUN — no labels will be deleted ==="
  echo
fi

delete_label() {
  local name="$1"

  if $DRY_RUN; then
    printf "  Would delete: %s\n" "$name"
    return
  fi

  if gh label delete "$name" \
    --repo "$REPO" \
    --yes 2>/dev/null; then
    printf "  ✓ Deleted: %s\n" "$name"
  else
    printf "  - Skipped: %s (not found or already deleted)\n" "$name"
  fi
}

confirm_batch() {
  local batch_name="$1"

  if $DRY_RUN; then
    return 0
  fi

  echo
  read -r -p "Delete $batch_name labels? [y/N] " response
  case "$response" in
    [yY][eE][sS]|[yY]) return 0 ;;
    *) echo "  Skipped."; return 1 ;;
  esac
}

echo "Repository: $REPO"
echo
echo "⚠  This script deletes labels. Run migrate-labels.sh first."
echo

# --- Old product labels (migrated to product:* labels) ---
echo "=== Old product labels ==="
if confirm_batch "old product"; then
  delete_label "InfluxDB 3 Core and Enterprise"
  delete_label "InfluxDB v3"
  delete_label "Processing engine"
  delete_label "InfluxDB v2"
  delete_label "InfluxDB v1"
  delete_label "Enterprise 1.x"
  delete_label "Chronograf 1.x"
  delete_label "Kapacitor"
  delete_label "Flux"
  delete_label "InfluxDB 3 Explorer"
  delete_label "InfluxDB Cloud Dedicated"
  delete_label "InfluxDB Cloud Serverless"
  delete_label "InfluxDB Clustered"
  delete_label "InfluxDB Cloud"
  delete_label "Telegraf"
fi
echo

# --- Old release labels (migrated to release:pending) ---
echo "=== Old release labels ==="
if confirm_batch "old release"; then
  delete_label "Pending Release"
  delete_label "release/influxdb3"
fi
echo

# --- Old source tracking labels ---
echo "=== Old source tracking labels ==="
if confirm_batch "old source tracking"; then
  delete_label "sync-plugin-docs"
fi
echo

# --- Renamed labels ---
echo "=== Renamed labels (old names) ==="
if confirm_batch "renamed label (old names)"; then
  delete_label "AI assistant tooling"
  delete_label "ci:testing-and-validation"
fi
echo

# --- Unused/generic labels ---
echo "=== Unused/generic labels ==="
echo "These labels have inconsistent naming or overlap with the new taxonomy."
if confirm_batch "unused/generic"; then
  delete_label "bug"
  delete_label "priority"
  delete_label "documentation"
  delete_label "Proposal"
  delete_label "Research Phase"
  delete_label "ready-for-collaboration"
  delete_label "ui"
  delete_label "javascript"
  delete_label "dependencies"
  delete_label "integration-demo-blog"
  delete_label "API"
  delete_label "Docker"
  delete_label "Grafana"
  delete_label "Ask AI"
fi
echo

echo "=== Done ==="
echo
echo "Labels NOT deleted (kept intentionally or not in scope):"
echo "  - release:pending, release:ready, release/telegraf, release/v1"
echo "  - good-first-issue, user feedback, validation-failed"
echo "  - duplicate, enhancement, help wanted, question, wontfix"
echo "  - design, security, security/misc, Epic, feat, fix, chore"
echo "  - And others not in the migration scope"
echo
echo "Review remaining labels with: gh label list -R $REPO"
