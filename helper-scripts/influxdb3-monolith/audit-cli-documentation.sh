#!/bin/bash
# Audit CLI documentation against current CLI help output
# Usage: ./audit-cli-documentation.sh [core|enterprise|both] [version]
# Example: ./audit-cli-documentation.sh core 3.2.0

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parse arguments
PRODUCT=${1:-both}
VERSION=${2:-local}

echo -e "${BLUE}🔍 InfluxDB 3 CLI Documentation Audit${NC}"
echo "======================================="
echo "Product: $PRODUCT"
echo "Version: $VERSION"
echo ""

# Set up output directory
OUTPUT_DIR="helper-scripts/output/cli-audit"
mkdir -p "$OUTPUT_DIR"

# Load tokens from secret files
load_tokens() {
    SECRET_CORE_FILE="$HOME/.env.influxdb3-core-admin-token"
    SECRET_ENT_FILE="$HOME/.env.influxdb3-enterprise-admin-token"
    
    if [ -f "$SECRET_CORE_FILE" ] && [ -s "$SECRET_CORE_FILE" ]; then
        INFLUXDB3_CORE_TOKEN=$(cat "$SECRET_CORE_FILE")
    fi
    if [ -f "$SECRET_ENT_FILE" ] && [ -s "$SECRET_ENT_FILE" ]; then
        INFLUXDB3_ENTERPRISE_TOKEN=$(cat "$SECRET_ENT_FILE")
    fi
}

# Get current CLI help for a product
extract_current_cli() {
    local product=$1
    local output_file=$2
    
    load_tokens
    
    if [ "$VERSION" == "local" ]; then
        local container_name="influxdb3-${product}"
        
        echo -n "Extracting current CLI help from ${container_name}..."
        
        # Check if container is running
        if ! docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
            echo -e " ${RED}✗${NC}"
            echo "Error: Container ${container_name} is not running."
            echo "Start it with: docker compose up -d influxdb3-${product}"
            return 1
        fi
        
        # Extract comprehensive help
        docker exec "${container_name}" influxdb3 --help > "$output_file" 2>&1
        
        # Extract all subcommand help
        for cmd in create delete disable enable query show test update write; do
            echo "" >> "$output_file"
            echo "===== influxdb3 $cmd --help =====" >> "$output_file"
            docker exec "${container_name}" influxdb3 $cmd --help >> "$output_file" 2>&1 || true
        done
        
        # Extract detailed subcommand help
        local subcommands=(
            "create database"
            "create token admin"
            "create token"
            "create trigger"
            "create last_cache"
            "create distinct_cache"
            "create table"
            "show databases"
            "show tokens"
            "show system"
            "delete database"
            "delete table"
            "delete trigger"
            "update database"
            "test wal_plugin"
            "test schedule_plugin"
        )
        
        for subcmd in "${subcommands[@]}"; do
            echo "" >> "$output_file"
            echo "===== influxdb3 $subcmd --help =====" >> "$output_file"
            docker exec "${container_name}" influxdb3 $subcmd --help >> "$output_file" 2>&1 || true
        done
        
        echo -e " ${GREEN}✓${NC}"
    else
        # Use specific version image
        local image="influxdb:${VERSION}-${product}"
        
        echo -n "Extracting CLI help from ${image}..."
        
        if ! docker pull "${image}" > /dev/null 2>&1; then
            echo -e " ${RED}✗${NC}"
            echo "Error: Failed to pull image ${image}"
            return 1
        fi
        
        # Extract help from specific version
        docker run --rm "${image}" influxdb3 --help > "$output_file" 2>&1
        
        # Extract subcommand help
        for cmd in create delete disable enable query show test update write; do
            echo "" >> "$output_file"
            echo "===== influxdb3 $cmd --help =====" >> "$output_file"
            docker run --rm "${image}" influxdb3 $cmd --help >> "$output_file" 2>&1 || true
        done
        
        echo -e " ${GREEN}✓${NC}"
    fi
}

# Parse CLI help to extract structured information
parse_cli_help() {
    local help_file=$1
    local parsed_file=$2
    
    echo "# CLI Commands and Options" > "$parsed_file"
    echo "" >> "$parsed_file"
    
    local current_command=""
    local in_options=false
    
    while IFS= read -r line; do
        # Detect command headers
        if echo "$line" | grep -q "^===== influxdb3.*--help ====="; then
            current_command=$(echo "$line" | sed 's/^===== //' | sed 's/ --help =====//')
            echo "## $current_command" >> "$parsed_file"
            echo "" >> "$parsed_file"
            in_options=false
        # Detect options sections
        elif echo "$line" | grep -q "^Options:"; then
            echo "### Options:" >> "$parsed_file"
            echo "" >> "$parsed_file"
            in_options=true
        # Parse option lines
        elif [ "$in_options" = true ] && echo "$line" | grep -qE "^\s*-"; then
            # Extract option and description
            option=$(echo "$line" | grep -oE '\-\-[a-z][a-z0-9-]*' | head -1)
            short_option=$(echo "$line" | grep -oE '\s-[a-zA-Z],' | sed 's/[, ]//g')
            description=$(echo "$line" | sed 's/^[[:space:]]*-[^[:space:]]*[[:space:]]*//' | sed 's/^[[:space:]]*--[^[:space:]]*[[:space:]]*//')
            
            if [ -n "$option" ]; then
                if [ -n "$short_option" ]; then
                    echo "- \`$short_option, $option\`: $description" >> "$parsed_file"
                else
                    echo "- \`$option\`: $description" >> "$parsed_file"
                fi
            fi
        # Reset options flag for new sections
        elif echo "$line" | grep -qE "^[A-Z][a-z]+:$"; then
            in_options=false
        fi
    done < "$help_file"
}

# Find documentation files for a product
find_docs() {
    local product=$1
    
    case "$product" in
        "core")
            echo "content/influxdb3/core/reference/cli/influxdb3"
            ;;
        "enterprise")
            echo "content/influxdb3/enterprise/reference/cli/influxdb3"
            ;;
    esac
}

# Audit documentation against CLI
audit_docs() {
    local product=$1
    local cli_file=$2
    local audit_file=$3
    
    local docs_path=$(find_docs "$product")
    local shared_path="content/shared/influxdb3-cli"
    
    echo "# CLI Documentation Audit - $product" > "$audit_file"
    echo "Generated: $(date)" >> "$audit_file"
    echo "" >> "$audit_file"
    
    # Check for missing documentation
    echo "## Missing Documentation" >> "$audit_file"
    echo "" >> "$audit_file"
    
    local missing_count=0
    
    # Extract commands from CLI help
    grep "^===== influxdb3.*--help =====" "$cli_file" | while read -r line; do
        local command=$(echo "$line" | sed 's/^===== influxdb3 //' | sed 's/ --help =====//')
        local expected_file=""
        
        # Map command to expected documentation file
        case "$command" in
            "create database") expected_file="create/database.md" ;;
            "create token") expected_file="create/token/_index.md" ;;
            "create token admin") expected_file="create/token/admin.md" ;;
            "create trigger") expected_file="create/trigger.md" ;;
            "create table") expected_file="create/table.md" ;;
            "create last_cache") expected_file="create/last_cache.md" ;;
            "create distinct_cache") expected_file="create/distinct_cache.md" ;;
            "show databases") expected_file="show/databases.md" ;;
            "show tokens") expected_file="show/tokens.md" ;;
            "delete database") expected_file="delete/database.md" ;;
            "delete table") expected_file="delete/table.md" ;;
            "query") expected_file="query.md" ;;
            "write") expected_file="write.md" ;;
            *) continue ;;
        esac
        
        if [ -n "$expected_file" ]; then
            # Check both product-specific and shared docs
            local product_file="$docs_path/$expected_file"
            local shared_file="$shared_path/$expected_file"
            
            if [ ! -f "$product_file" ] && [ ! -f "$shared_file" ]; then
                echo "- **Missing**: Documentation for \`influxdb3 $command\`" >> "$audit_file"
                echo "  - Expected: \`$product_file\` or \`$shared_file\`" >> "$audit_file"
                missing_count=$((missing_count + 1))
            fi
        fi
    done
    
    if [ "$missing_count" -eq 0 ]; then
        echo "No missing documentation files detected." >> "$audit_file"
    fi
    
    echo "" >> "$audit_file"
    
    # Check for outdated options in existing docs
    echo "## Potentially Outdated Documentation" >> "$audit_file"
    echo "" >> "$audit_file"
    
    local outdated_count=0
    
    # This would require more sophisticated parsing of markdown files
    # For now, we'll note this as a manual review item
    echo "**Manual Review Needed**: Compare the following CLI options with existing documentation:" >> "$audit_file"
    echo "" >> "$audit_file"
    
    # Extract all options from CLI help
    grep -E "^\s*(-[a-zA-Z],?\s*)?--[a-z][a-z0-9-]*" "$cli_file" | sort -u | while read -r option_line; do
        local option=$(echo "$option_line" | grep -oE '\--[a-z][a-z0-9-]*')
        if [ -n "$option" ]; then
            echo "- \`$option\`" >> "$audit_file"
        fi
    done
    
    echo "" >> "$audit_file"
    echo "## Summary" >> "$audit_file"
    echo "- Missing documentation files: $missing_count" >> "$audit_file"
    echo "- Manual review recommended for option accuracy" >> "$audit_file"
    echo "" >> "$audit_file"
    
    echo "📄 Audit complete: $audit_file"
}

# Main execution
case "$PRODUCT" in
    "core")
        CLI_FILE="$OUTPUT_DIR/current-cli-core-${VERSION}.txt"
        AUDIT_FILE="$OUTPUT_DIR/documentation-audit-core-${VERSION}.md"
        
        extract_current_cli "core" "$CLI_FILE"
        audit_docs "core" "$CLI_FILE" "$AUDIT_FILE"
        ;;
    "enterprise")
        CLI_FILE="$OUTPUT_DIR/current-cli-enterprise-${VERSION}.txt"
        AUDIT_FILE="$OUTPUT_DIR/documentation-audit-enterprise-${VERSION}.md"
        
        extract_current_cli "enterprise" "$CLI_FILE"
        audit_docs "enterprise" "$CLI_FILE" "$AUDIT_FILE"
        ;;
    "both")
        # Core
        CLI_FILE_CORE="$OUTPUT_DIR/current-cli-core-${VERSION}.txt"
        AUDIT_FILE_CORE="$OUTPUT_DIR/documentation-audit-core-${VERSION}.md"
        
        extract_current_cli "core" "$CLI_FILE_CORE"
        audit_docs "core" "$CLI_FILE_CORE" "$AUDIT_FILE_CORE"
        
        # Enterprise
        CLI_FILE_ENT="$OUTPUT_DIR/current-cli-enterprise-${VERSION}.txt"
        AUDIT_FILE_ENT="$OUTPUT_DIR/documentation-audit-enterprise-${VERSION}.md"
        
        extract_current_cli "enterprise" "$CLI_FILE_ENT"
        audit_docs "enterprise" "$CLI_FILE_ENT" "$AUDIT_FILE_ENT"
        ;;
    *)
        echo "Usage: $0 [core|enterprise|both] [version]"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ CLI documentation audit complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Review the audit reports in: $OUTPUT_DIR"
echo "2. Update missing documentation files"
echo "3. Verify options match current CLI behavior"
echo "4. Update examples and usage patterns"