#!/bin/bash

# Manage test result cache
# Usage: manage-test-cache.sh <command>
#
# Commands:
#   stats    - Show cache statistics
#   clean    - Remove expired cache entries (>7 days)
#   clear    - Remove all cache entries
#   list     - List all cached results

set -e

CACHE_DIR="${TEST_CACHE_DIR:-.test-cache}"
COMMAND="$1"

if [[ ! -d "$CACHE_DIR" ]]; then
  mkdir -p "$CACHE_DIR"
  echo "Created cache directory: $CACHE_DIR"
fi

show_stats() {
  echo "Test Cache Statistics"
  echo "===================="
  echo ""
  echo "Cache directory: $CACHE_DIR"

  if [[ ! -d "$CACHE_DIR" ]] || [[ -z "$(ls -A "$CACHE_DIR" 2>/dev/null)" ]]; then
    echo "Status: Empty"
    return
  fi

  local total_entries=$(find "$CACHE_DIR" -name "*.passed" -type f | wc -l)
  local total_size=$(du -sh "$CACHE_DIR" 2>/dev/null | cut -f1)
  local now=$(date +%s)
  local expired=0
  local valid=0

  while IFS= read -r cache_file; do
    local age=$((now - $(stat -c %Y "$cache_file" 2>/dev/null || stat -f %m "$cache_file" 2>/dev/null)))
    if [[ $age -gt 604800 ]]; then
      ((expired++))
    else
      ((valid++))
    fi
  done < <(find "$CACHE_DIR" -name "*.passed" -type f)

  echo "Total entries: $total_entries"
  echo "Valid entries: $valid"
  echo "Expired entries: $expired"
  echo "Total size: $total_size"
  echo ""

  if [[ $expired -gt 0 ]]; then
    echo "Run 'manage-test-cache.sh clean' to remove expired entries"
  fi
}

list_cache() {
  echo "Cached Test Results"
  echo "==================="
  echo ""

  if [[ ! -d "$CACHE_DIR" ]] || [[ -z "$(ls -A "$CACHE_DIR" 2>/dev/null)" ]]; then
    echo "No cached results"
    return
  fi

  local now=$(date +%s)

  while IFS= read -r cache_file; do
    local hash=$(basename "$cache_file" .passed)
    local meta_file="${CACHE_DIR}/${hash}.meta"
    local age=$((now - $(stat -c %Y "$cache_file" 2>/dev/null || stat -f %m "$cache_file" 2>/dev/null)))
    local age_days=$((age / 86400))
    local status="✅"

    if [[ $age -gt 604800 ]]; then
      status="⏰ EXPIRED"
    fi

    echo "Hash: $hash"
    echo "Status: $status"
    echo "Age: $age_days days"

    if [[ -f "$meta_file" ]]; then
      echo "Metadata:"
      sed 's/^/  /' "$meta_file"
    fi

    echo ""
  done < <(find "$CACHE_DIR" -name "*.passed" -type f | sort -r)
}

clean_cache() {
  echo "Cleaning expired cache entries..."

  if [[ ! -d "$CACHE_DIR" ]]; then
    echo "No cache directory found"
    return
  fi

  local now=$(date +%s)
  local removed=0

  while IFS= read -r cache_file; do
    local age=$((now - $(stat -c %Y "$cache_file" 2>/dev/null || stat -f %m "$cache_file" 2>/dev/null)))

    if [[ $age -gt 604800 ]]; then
      local hash=$(basename "$cache_file" .passed)
      rm -f "$cache_file" "${CACHE_DIR}/${hash}.meta"
      ((removed++))
      echo "Removed expired entry: $hash"
    fi
  done < <(find "$CACHE_DIR" -name "*.passed" -type f)

  echo ""
  echo "Removed $removed expired entries"
}

clear_cache() {
  echo "Clearing all cache entries..."

  if [[ ! -d "$CACHE_DIR" ]]; then
    echo "No cache directory found"
    return
  fi

  local count=$(find "$CACHE_DIR" -name "*.passed" -type f | wc -l)

  read -p "Are you sure you want to remove all $count cached results? (y/N) " -n 1 -r
  echo

  if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$CACHE_DIR"/*
    echo "✅ Cache cleared"
  else
    echo "Cancelled"
  fi
}

case "$COMMAND" in
  stats)
    show_stats
    ;;
  list)
    list_cache
    ;;
  clean)
    clean_cache
    ;;
  clear)
    clear_cache
    ;;
  *)
    echo "Usage: manage-test-cache.sh <command>"
    echo ""
    echo "Commands:"
    echo "  stats    - Show cache statistics"
    echo "  clean    - Remove expired cache entries (>7 days)"
    echo "  clear    - Remove all cache entries"
    echo "  list     - List all cached results"
    exit 1
    ;;
esac
