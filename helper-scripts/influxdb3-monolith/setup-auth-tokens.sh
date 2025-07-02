#!/bin/bash
# Set up authentication tokens for InfluxDB 3 Core and Enterprise containers
# Usage: ./setup-auth-tokens.sh [core|enterprise|both]

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parse arguments
TARGET=${1:-both}

echo -e "${BLUE}🔐 InfluxDB 3 Authentication Setup${NC}"
echo "=================================="
echo ""

# Check for and load existing secret files
SECRET_CORE_FILE="$HOME/.env.influxdb3-core-admin-token"
SECRET_ENT_FILE="$HOME/.env.influxdb3-enterprise-admin-token"

if [ -f "$SECRET_CORE_FILE" ]; then
    echo "✅ Found existing Core token secret file"
else
    echo "📝 Creating new Core token secret file: $SECRET_CORE_FILE"
    touch "$SECRET_CORE_FILE"
fi

if [ -f "$SECRET_ENT_FILE" ]; then
    echo "✅ Found existing Enterprise token secret file"
else
    echo "📝 Creating new Enterprise token secret file: $SECRET_ENT_FILE"
    touch "$SECRET_ENT_FILE"
fi

echo ""

# Function to setup auth for a product
setup_auth() {
    local product=$1
    local container_name="influxdb3-${product}"
    local port
    local secret_file
    
    case "$product" in
        "core")
            port="8282"
            secret_file="$SECRET_CORE_FILE"
            ;;
        "enterprise")
            port="8181"
            secret_file="$SECRET_ENT_FILE"
            ;;
    esac
    
    echo -e "${BLUE}Setting up $(echo ${product} | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}') authentication...${NC}"
    
    # Check if token already exists in secret file
    if [ -s "$secret_file" ]; then
        local existing_token=$(cat "$secret_file")
        echo "✅ Token already exists in secret file"
        echo "   Token: ${existing_token:0:20}..."
        
        # Test if the token works
        echo -n "🧪 Testing existing token..."
        if docker exec "${container_name}" influxdb3 show databases --token "${existing_token}" --host "http://localhost:${port}" > /dev/null 2>&1; then
            echo -e " ${GREEN}✓ Working${NC}"
            return 0
        else
            echo -e " ${YELLOW}⚠ Not working, will create new token${NC}"
        fi
    fi
    
    # Check if container is running
    if ! docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
        echo "🚀 Starting ${container_name} container..."
        if ! docker compose up -d "${container_name}"; then
            echo -e "${RED}❌ Failed to start container${NC}"
            return 1
        fi
        
        echo -n "⏳ Waiting for container to be ready..."
        sleep 5
        echo -e " ${GREEN}✓${NC}"
    else
        echo "✅ Container ${container_name} is running"
    fi
    
    # Create admin token
    echo "🔑 Creating admin token..."
    
    local token_output
    if token_output=$(docker exec "${container_name}" influxdb3 create token --admin 2>&1); then
        # Extract the token from the "Token: " line
        local new_token=$(echo "$token_output" | grep "^Token: " | sed 's/^Token: //' | tr -d '\r\n')
        
        echo -e "✅ ${GREEN}Token created successfully!${NC}"
        echo "   Token: ${new_token:0:20}..."
        
        # Update secret file
        echo "${new_token}" > "$secret_file"
        
        echo "📝 Updated secret file: $secret_file"
        
        # Test the new token
        echo -n "🧪 Testing new token..."
        if docker exec "${container_name}" influxdb3 show databases --token "${new_token}" --host "http://localhost:${port}" > /dev/null 2>&1; then
            echo -e " ${GREEN}✓ Working${NC}"
        else
            echo -e " ${YELLOW}⚠ Test failed, but token was created${NC}"
        fi
        
    else
        echo -e "${RED}❌ Failed to create token${NC}"
        echo "Error output: $token_output"
        return 1
    fi
    
    echo ""
}

# Main execution
case "$TARGET" in
    "core")
        setup_auth "core"
        ;;
    "enterprise")
        setup_auth "enterprise"
        ;;
    "both")
        setup_auth "core"
        setup_auth "enterprise"
        ;;
    *)
        echo "Usage: $0 [core|enterprise|both]"
        exit 1
        ;;
esac

echo -e "${GREEN}🎉 Authentication setup complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Restart containers to load new secrets:"
echo "   docker compose down && docker compose up -d influxdb3-core influxdb3-enterprise"
echo "2. Test CLI commands with authentication:"
echo "   ./detect-cli-changes.sh core 3.1.0 local"
echo "   ./detect-cli-changes.sh enterprise 3.1.0 local"
echo ""
echo "📄 Your secret files now contain:"

# Show Core tokens
if [ -f "$SECRET_CORE_FILE" ] && [ -s "$SECRET_CORE_FILE" ]; then
    token_preview=$(head -c 20 "$SECRET_CORE_FILE")
    echo "  $SECRET_CORE_FILE: ${token_preview}..."
fi

# Show Enterprise tokens  
if [ -f "$SECRET_ENT_FILE" ] && [ -s "$SECRET_ENT_FILE" ]; then
    token_preview=$(head -c 20 "$SECRET_ENT_FILE")
    echo "  $SECRET_ENT_FILE: ${token_preview}..."
fi