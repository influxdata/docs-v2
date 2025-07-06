#!/bin/bash

# Script to generate release notes for InfluxDB v3.x releases
# Usage: ./generate-release-notes.sh [--no-fetch] [--pull] <from_version> <to_version> <primary_repo_path> [additional_repo_paths...]
# 
# Options:
#   --no-fetch    Skip fetching latest commits from remote
#   --pull        Pull latest changes (implies fetch) - use with caution as it may change your working directory
#
# Example: ./generate-release-notes.sh v3.1.0 v3.2.0 /path/to/influxdb /path/to/influxdb_pro /path/to/influxdb_iox
# Example: ./generate-release-notes.sh --no-fetch v3.1.0 v3.2.0 /path/to/influxdb
# Example: ./generate-release-notes.sh --pull v3.1.0 v3.2.0 /path/to/influxdb /path/to/influxdb_pro

set -e

# Parse command line options
FETCH_COMMITS=true
PULL_COMMITS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-fetch)
            FETCH_COMMITS=false
            shift
            ;;
        --pull)
            PULL_COMMITS=true
            FETCH_COMMITS=true
            shift
            ;;
        -*)
            echo "Unknown option $1"
            exit 1
            ;;
        *)
            break
            ;;
    esac
done

# Parse remaining arguments
FROM_VERSION="${1:-v3.1.0}"
TO_VERSION="${2:-v3.2.0}"
PRIMARY_REPO="${3:-${HOME}/Documents/github/influxdb}"

# Function to validate git tag
validate_git_tag() {
    local version="$1"
    local repo_path="$2"
    
    if [ "$version" = "local" ]; then
        return 0  # Special case for development
    fi
    
    if [ ! -d "$repo_path" ]; then
        echo -e "${RED}Error: Repository not found: $repo_path${NC}"
        return 1
    fi
    
    if ! git -C "$repo_path" tag --list | grep -q "^${version}$"; then
        echo -e "${RED}Error: Version tag '$version' does not exist in repository $repo_path${NC}"
        echo -e "${YELLOW}Available tags (most recent first):${NC}"
        git -C "$repo_path" tag --list --sort=-version:refname | head -10 | sed 's/^/  /'
        return 1
    fi
    
    return 0
}

# Collect additional repositories (all arguments after the third)
ADDITIONAL_REPOS=()
shift 3 2>/dev/null || true
while [ $# -gt 0 ]; do
    ADDITIONAL_REPOS+=("$1")
    shift
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Validate version tags
echo -e "${YELLOW}Validating version tags...${NC}"
if ! validate_git_tag "$FROM_VERSION" "$PRIMARY_REPO"; then
    echo -e "${RED}From version validation failed${NC}"
    exit 1
fi

if ! validate_git_tag "$TO_VERSION" "$PRIMARY_REPO"; then
    echo -e "${RED}To version validation failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Version tags validated successfully${NC}\n"

echo -e "${BLUE}Generating release notes for ${TO_VERSION}${NC}"
echo -e "Primary Repository: ${PRIMARY_REPO}"
if [ ${#ADDITIONAL_REPOS[@]} -gt 0 ]; then
    echo -e "Additional Repositories:"
    for repo in "${ADDITIONAL_REPOS[@]}"; do
        echo -e "  - ${repo}"
    done
fi
echo -e "From: ${FROM_VERSION} To: ${TO_VERSION}\n"

# Function to extract PR number from commit message
extract_pr_number() {
    echo "$1" | grep -oE '#[0-9]+' | head -1 | sed 's/#//'
}

# Function to get commits from a repository
get_commits_from_repo() {
    local repo_path="$1"
    local pattern="$2"
    local format="${3:-%h %s}"
    
    if [ -d "$repo_path" ]; then
        git -C "$repo_path" log --format="$format" "${FROM_VERSION}..${TO_VERSION}" 2>/dev/null | grep -E "$pattern" || true
    fi
}

# Function to analyze API-related commits
analyze_api_changes() {
    local repo_path="$1"
    local repo_name="$2"
    
    if [ ! -d "$repo_path" ]; then
        return
    fi
    
    # Look for API-related file changes
    local api_files=$(git -C "$repo_path" diff --name-only "${FROM_VERSION}..${TO_VERSION}" 2>/dev/null | grep -E "(api|handler|endpoint|route)" | head -10 || true)
    
    # Look for specific API endpoint patterns in commit messages and diffs
    local api_commits=$(git -C "$repo_path" log --format="%h %s" "${FROM_VERSION}..${TO_VERSION}" 2>/dev/null | \
        grep -iE "(api|endpoint|/write|/query|/ping|/health|/metrics|v1|v2|v3)" || true)
    
    if [ -n "$api_files" ] || [ -n "$api_commits" ]; then
        echo "  Repository: $repo_name"
        if [ -n "$api_files" ]; then
            echo "    Modified API files:"
            echo "$api_files" | while read -r file; do
                echo "      - $file"
            done
        fi
        if [ -n "$api_commits" ]; then
            echo "    API-related commits:"
            echo "$api_commits" | while read -r commit; do
                echo "      - $commit"
            done
        fi
        echo
    fi
}

# Get the release date
RELEASE_DATE=$(git -C "$PRIMARY_REPO" log -1 --format=%ai "$TO_VERSION" | cut -d' ' -f1)
echo -e "${GREEN}Release Date: ${RELEASE_DATE}${NC}\n"

# Create array of all repositories
ALL_REPOS=("$PRIMARY_REPO")
for repo in "${ADDITIONAL_REPOS[@]}"; do
    ALL_REPOS+=("$repo")
done

# Fetch latest commits from all repositories (if enabled)
if [ "$FETCH_COMMITS" = true ]; then
    if [ "$PULL_COMMITS" = true ]; then
        echo -e "${YELLOW}Pulling latest changes from all repositories...${NC}"
        echo -e "${RED}Warning: This will modify your working directories!${NC}"
    else
        echo -e "${YELLOW}Fetching latest commits from all repositories...${NC}"
    fi
    
    for repo in "${ALL_REPOS[@]}"; do
        if [ -d "$repo" ]; then
            repo_name=$(basename "$repo")
            
            if [ "$PULL_COMMITS" = true ]; then
                echo -e "  Pulling changes in $repo_name..."
                if git -C "$repo" pull origin 2>/dev/null; then
                    echo -e "    ${GREEN}✓${NC} Successfully pulled changes in $repo_name"
                else
                    echo -e "    ${RED}✗${NC} Failed to pull changes in $repo_name (trying fetch only)"
                    if git -C "$repo" fetch origin 2>/dev/null; then
                        echo -e "    ${GREEN}✓${NC} Successfully fetched from $repo_name"
                    else
                        echo -e "    ${RED}✗${NC} Failed to fetch from $repo_name (continuing with local commits)"
                    fi
                fi
            else
                echo -e "  Fetching from $repo_name..."
                if git -C "$repo" fetch origin 2>/dev/null; then
                    echo -e "    ${GREEN}✓${NC} Successfully fetched from $repo_name"
                else
                    echo -e "    ${RED}✗${NC} Failed to fetch from $repo_name (continuing with local commits)"
                fi
            fi
        else
            echo -e "    ${RED}✗${NC} Repository not found: $repo"
        fi
    done
else
    echo -e "${YELLOW}Skipping fetch (using local commits only)${NC}"
fi

# Collect commits by category from all repositories
echo -e "\n${YELLOW}Analyzing commits across all repositories...${NC}"

# Initialize variables
FEATURES=""
FIXES=""
BREAKING=""
PERF=""
API_CHANGES=""

# Collect commits from all repositories
for repo in "${ALL_REPOS[@]}"; do
    if [ -d "$repo" ]; then
        repo_name=$(basename "$repo")
        echo -e "  Analyzing $repo_name..."
        
        # Features
        repo_features=$(get_commits_from_repo "$repo" "^[a-f0-9]+ feat:" | sed "s/^[a-f0-9]* feat: /- [$repo_name] /")
        if [ -n "$repo_features" ]; then
            FEATURES="$FEATURES$repo_features"$'\n'
        fi
        
        # Fixes
        repo_fixes=$(get_commits_from_repo "$repo" "^[a-f0-9]+ fix:" | sed "s/^[a-f0-9]* fix: /- [$repo_name] /")
        if [ -n "$repo_fixes" ]; then
            FIXES="$FIXES$repo_fixes"$'\n'
        fi
        
        # Breaking changes
        repo_breaking=$(get_commits_from_repo "$repo" "^[a-f0-9]+ .*(BREAKING|breaking change)" | sed "s/^[a-f0-9]* /- [$repo_name] /")
        if [ -n "$repo_breaking" ]; then
            BREAKING="$BREAKING$repo_breaking"$'\n'
        fi
        
        # Performance improvements
        repo_perf=$(get_commits_from_repo "$repo" "^[a-f0-9]+ perf:" | sed "s/^[a-f0-9]* perf: /- [$repo_name] /")
        if [ -n "$repo_perf" ]; then
            PERF="$PERF$repo_perf"$'\n'
        fi
        
        # API changes
        repo_api=$(get_commits_from_repo "$repo" "(api|endpoint|/write|/query|/ping|/health|/metrics|v1|v2|v3)" | sed "s/^[a-f0-9]* /- [$repo_name] /")
        if [ -n "$repo_api" ]; then
            API_CHANGES="$API_CHANGES$repo_api"$'\n'
        fi
    fi
done

# Analyze API changes in detail
echo -e "\n${YELLOW}Analyzing HTTP API changes...${NC}"
for repo in "${ALL_REPOS[@]}"; do
    repo_name=$(basename "$repo")
    analyze_api_changes "$repo" "$repo_name"
done

# Generate markdown output
OUTPUT_FILE="release-notes-${TO_VERSION}.md"
cat > "$OUTPUT_FILE" << EOF
## ${TO_VERSION} {date="${RELEASE_DATE}"}

### Features

EOF

# Add features
if [ -n "$FEATURES" ]; then
    echo "$FEATURES" | while IFS= read -r line; do
        if [ -n "$line" ]; then
            PR=$(extract_pr_number "$line")
            # Clean up the commit message
            CLEAN_LINE=$(echo "$line" | sed -E 's/ \(#[0-9]+\)$//')
            if [ -n "$PR" ]; then
                echo "$CLEAN_LINE ([#$PR](https://github.com/influxdata/influxdb/pull/$PR))" >> "$OUTPUT_FILE"
            else
                echo "$CLEAN_LINE" >> "$OUTPUT_FILE"
            fi
        fi
    done
else
    echo "- No new features in this release" >> "$OUTPUT_FILE"
fi

# Add bug fixes
cat >> "$OUTPUT_FILE" << EOF

### Bug Fixes

EOF

if [ -n "$FIXES" ]; then
    echo "$FIXES" | while IFS= read -r line; do
        if [ -n "$line" ]; then
            PR=$(extract_pr_number "$line")
            CLEAN_LINE=$(echo "$line" | sed -E 's/ \(#[0-9]+\)$//')
            if [ -n "$PR" ]; then
                echo "$CLEAN_LINE ([#$PR](https://github.com/influxdata/influxdb/pull/$PR))" >> "$OUTPUT_FILE"
            else
                echo "$CLEAN_LINE" >> "$OUTPUT_FILE"
            fi
        fi
    done
else
    echo "- No bug fixes in this release" >> "$OUTPUT_FILE"
fi

# Add breaking changes if any
if [ -n "$BREAKING" ]; then
    cat >> "$OUTPUT_FILE" << EOF

### Breaking Changes

EOF
    echo "$BREAKING" | while IFS= read -r line; do
        if [ -n "$line" ]; then
            PR=$(extract_pr_number "$line")
            CLEAN_LINE=$(echo "$line" | sed -E 's/ \(#[0-9]+\)$//')
            if [ -n "$PR" ]; then
                echo "$CLEAN_LINE ([#$PR](https://github.com/influxdata/influxdb/pull/$PR))" >> "$OUTPUT_FILE"
            else
                echo "$CLEAN_LINE" >> "$OUTPUT_FILE"
            fi
        fi
    done
fi

# Add performance improvements if any
if [ -n "$PERF" ]; then
    cat >> "$OUTPUT_FILE" << EOF

### Performance Improvements

EOF
    echo "$PERF" | while IFS= read -r line; do
        if [ -n "$line" ]; then
            PR=$(extract_pr_number "$line")
            CLEAN_LINE=$(echo "$line" | sed -E 's/ \(#[0-9]+\)$//')
            if [ -n "$PR" ]; then
                echo "$CLEAN_LINE ([#$PR](https://github.com/influxdata/influxdb/pull/$PR))" >> "$OUTPUT_FILE"
            else
                echo "$CLEAN_LINE" >> "$OUTPUT_FILE"
            fi
        fi
    done
fi

# Add HTTP API changes if any
if [ -n "$API_CHANGES" ]; then
    cat >> "$OUTPUT_FILE" << EOF

### HTTP API Changes

EOF
    echo "$API_CHANGES" | while IFS= read -r line; do
        if [ -n "$line" ]; then
            PR=$(extract_pr_number "$line")
            CLEAN_LINE=$(echo "$line" | sed -E 's/ \(#[0-9]+\)$//')
            if [ -n "$PR" ]; then
                echo "$CLEAN_LINE ([#$PR](https://github.com/influxdata/influxdb/pull/$PR))" >> "$OUTPUT_FILE"
            else
                echo "$CLEAN_LINE" >> "$OUTPUT_FILE"
            fi
        fi
    done
fi

# Add API analysis summary
cat >> "$OUTPUT_FILE" << EOF

### API Analysis Summary

The following endpoints may have been affected in this release:
- v1 API endpoints: \`/write\`, \`/query\`, \`/ping\`
- v2 API endpoints: \`/api/v2/write\`, \`/api/v2/query\`
- v3 API endpoints: \`/api/v3/*\`
- System endpoints: \`/health\`, \`/metrics\`

Please review the commit details above and consult the API documentation for specific changes.

EOF

echo -e "\n${GREEN}Release notes generated in: ${OUTPUT_FILE}${NC}"
echo -e "${YELLOW}Please review and edit the generated notes before adding to documentation.${NC}"
echo -e "${BLUE}API changes have been automatically detected and included.${NC}"