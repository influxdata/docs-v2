#!/bin/bash

# Script to generate release notes for InfluxDB v3.x releases
# Usage: ./generate-release-notes.sh <from_version> <to_version> <repo_path>

set -e

# Default values
REPO_PATH="${3:-/Users/ja/Documents/github/influxdb}"
FROM_VERSION="${1:-v3.1.0}"
TO_VERSION="${2:-v3.2.0}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Generating release notes for ${TO_VERSION}${NC}"
echo -e "Repository: ${REPO_PATH}"
echo -e "From: ${FROM_VERSION} To: ${TO_VERSION}\n"

# Function to extract PR number from commit message
extract_pr_number() {
    echo "$1" | grep -oE '#[0-9]+' | head -1 | sed 's/#//'
}

# Get the release date
RELEASE_DATE=$(git -C "$REPO_PATH" log -1 --format=%ai "$TO_VERSION" | cut -d' ' -f1)
echo -e "${GREEN}Release Date: ${RELEASE_DATE}${NC}\n"

# Collect commits by category
echo -e "${YELLOW}Analyzing commits...${NC}"

# Features
echo -e "\n${GREEN}Features:${NC}"
FEATURES=$(git -C "$REPO_PATH" log --format="%h %s" "${FROM_VERSION}..${TO_VERSION}" | grep -E "^[a-f0-9]+ feat:" | sed 's/^[a-f0-9]* feat: //')

# Fixes
echo -e "\n${GREEN}Bug Fixes:${NC}"
FIXES=$(git -C "$REPO_PATH" log --format="%h %s" "${FROM_VERSION}..${TO_VERSION}" | grep -E "^[a-f0-9]+ fix:" | sed 's/^[a-f0-9]* fix: //')

# Breaking changes
echo -e "\n${GREEN}Breaking Changes:${NC}"
BREAKING=$(git -C "$REPO_PATH" log --format="%h %s" "${FROM_VERSION}..${TO_VERSION}" | grep -iE "^[a-f0-9]+ .*(BREAKING|breaking change)" | sed 's/^[a-f0-9]* //')

# Performance improvements
echo -e "\n${GREEN}Performance:${NC}"
PERF=$(git -C "$REPO_PATH" log --format="%h %s" "${FROM_VERSION}..${TO_VERSION}" | grep -E "^[a-f0-9]+ perf:" | sed 's/^[a-f0-9]* perf: //')

# Generate markdown output
OUTPUT_FILE="release-notes-${TO_VERSION}.md"
cat > "$OUTPUT_FILE" << EOF
## ${TO_VERSION} {date="${RELEASE_DATE}"}

### Features

EOF

# Add features
if [ -n "$FEATURES" ]; then
    while IFS= read -r line; do
        PR=$(extract_pr_number "$line")
        # Clean up the commit message
        CLEAN_LINE=$(echo "$line" | sed -E 's/ \(#[0-9]+\)$//')
        if [ -n "$PR" ]; then
            echo "- $CLEAN_LINE ([#$PR](https://github.com/influxdata/influxdb/pull/$PR))" >> "$OUTPUT_FILE"
        else
            echo "- $CLEAN_LINE" >> "$OUTPUT_FILE"
        fi
    done <<< "$FEATURES"
else
    echo "- No new features in this release" >> "$OUTPUT_FILE"
fi

# Add bug fixes
cat >> "$OUTPUT_FILE" << EOF

### Bug Fixes

EOF

if [ -n "$FIXES" ]; then
    while IFS= read -r line; do
        PR=$(extract_pr_number "$line")
        CLEAN_LINE=$(echo "$line" | sed -E 's/ \(#[0-9]+\)$//')
        if [ -n "$PR" ]; then
            echo "- $CLEAN_LINE ([#$PR](https://github.com/influxdata/influxdb/pull/$PR))" >> "$OUTPUT_FILE"
        else
            echo "- $CLEAN_LINE" >> "$OUTPUT_FILE"
        fi
    done <<< "$FIXES"
else
    echo "- No bug fixes in this release" >> "$OUTPUT_FILE"
fi

# Add breaking changes if any
if [ -n "$BREAKING" ]; then
    cat >> "$OUTPUT_FILE" << EOF

### Breaking Changes

EOF
    while IFS= read -r line; do
        PR=$(extract_pr_number "$line")
        CLEAN_LINE=$(echo "$line" | sed -E 's/ \(#[0-9]+\)$//')
        if [ -n "$PR" ]; then
            echo "- $CLEAN_LINE ([#$PR](https://github.com/influxdata/influxdb/pull/$PR))" >> "$OUTPUT_FILE"
        else
            echo "- $CLEAN_LINE" >> "$OUTPUT_FILE"
        fi
    done <<< "$BREAKING"
fi

# Add performance improvements if any
if [ -n "$PERF" ]; then
    cat >> "$OUTPUT_FILE" << EOF

### Performance Improvements

EOF
    while IFS= read -r line; do
        PR=$(extract_pr_number "$line")
        CLEAN_LINE=$(echo "$line" | sed -E 's/ \(#[0-9]+\)$//')
        if [ -n "$PR" ]; then
            echo "- $CLEAN_LINE ([#$PR](https://github.com/influxdata/influxdb/pull/$PR))" >> "$OUTPUT_FILE"
        else
            echo "- $CLEAN_LINE" >> "$OUTPUT_FILE"
        fi
    done <<< "$PERF"
fi

echo -e "\n${GREEN}Release notes generated in: ${OUTPUT_FILE}${NC}"
echo -e "${YELLOW}Please review and edit the generated notes before adding to documentation.${NC}"