#!/bin/bash
# Docker utility functions shared across helper scripts

# Color codes
export RED='\033[0;31m'
export GREEN='\033[0;32m'
export YELLOW='\033[1;33m'
export BLUE='\033[0;34m'
export NC='\033[0m' # No Color

# Check if Docker is running
check_docker_running() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running${NC}"
        echo "Please start Docker Desktop or Docker Engine"
        return 1
    fi
    return 0
}

# Check if a container exists
container_exists() {
    local container_name=$1
    docker ps -a --format '{{.Names}}' | grep -q "^${container_name}$"
}

# Check if a container is running
container_running() {
    local container_name=$1
    docker ps --format '{{.Names}}' | grep -q "^${container_name}$"
}

# Pull Docker image with retry logic
pull_image() {
    local image=$1
    local max_retries=3
    local retry_count=0
    
    echo -e "${BLUE}Pulling image: $image${NC}"
    
    while [ $retry_count -lt $max_retries ]; do
        if docker pull "$image"; then
            echo -e "${GREEN}✓ Successfully pulled $image${NC}"
            return 0
        fi
        
        retry_count=$((retry_count + 1))
        if [ $retry_count -lt $max_retries ]; then
            echo -e "${YELLOW}Retry $retry_count/$max_retries...${NC}"
            sleep 2
        fi
    done
    
    echo -e "${RED}✗ Failed to pull $image after $max_retries attempts${NC}"
    return 1
}

# Load authentication token from secret file
load_auth_token() {
    local product=$1
    local token_var_name=$2
    
    local secret_file="$HOME/.env.influxdb3-${product}-admin-token"
    
    if [ -f "$secret_file" ] && [ -s "$secret_file" ]; then
        local token=$(cat "$secret_file")
        eval "export $token_var_name='$token'"
        return 0
    else
        echo -e "${YELLOW}Warning: No token found in $secret_file${NC}"
        return 1
    fi
}

# Start container if not running
ensure_container_running() {
    local container_name=$1
    local service_name=${2:-$container_name}
    
    if ! container_running "$container_name"; then
        echo -e "${YELLOW}Starting $container_name...${NC}"
        
        if docker compose up -d "$service_name"; then
            # Wait for container to be ready
            local max_wait=30
            local waited=0
            
            while [ $waited -lt $max_wait ]; do
                if container_running "$container_name"; then
                    echo -e "${GREEN}✓ $container_name is running${NC}"
                    return 0
                fi
                sleep 1
                waited=$((waited + 1))
            done
            
            echo -e "${RED}✗ Timeout waiting for $container_name to start${NC}"
            return 1
        else
            echo -e "${RED}✗ Failed to start $container_name${NC}"
            return 1
        fi
    fi
    
    return 0
}

# Execute command in container
exec_in_container() {
    local container_name=$1
    shift
    local command="$@"
    
    if ! container_running "$container_name"; then
        echo -e "${RED}Error: Container $container_name is not running${NC}"
        return 1
    fi
    
    docker exec "$container_name" $command
}

# Get container health status
container_health() {
    local container_name=$1
    
    if ! container_exists "$container_name"; then
        echo "not_found"
        return
    fi
    
    local status=$(docker inspect --format='{{.State.Status}}' "$container_name" 2>/dev/null)
    echo "${status:-unknown}"
}

# Wait for container to be healthy
wait_for_healthy() {
    local container_name=$1
    local timeout=${2:-60}
    
    echo -e "${BLUE}Waiting for $container_name to be healthy...${NC}"
    
    local elapsed=0
    while [ $elapsed -lt $timeout ]; do
        local health=$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null || echo "no_health_check")
        
        if [ "$health" = "healthy" ] || [ "$health" = "no_health_check" ]; then
            echo -e "${GREEN}✓ $container_name is ready${NC}"
            return 0
        fi
        
        sleep 2
        elapsed=$((elapsed + 2))
        echo -n "."
    done
    
    echo -e "\n${RED}✗ Timeout waiting for $container_name to be healthy${NC}"
    return 1
}

# Validate Docker image tag format
validate_image_tag() {
    local product=$1
    local version=$2
    
    # Check version format
    if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] && [ "$version" != "local" ]; then
        echo -e "${RED}Error: Invalid version format: $version${NC}"
        echo "Expected format: X.Y.Z (e.g., 3.2.0) or 'local'"
        return 1
    fi
    
    # Check product name
    case "$product" in
        core|enterprise|clustered|cloud-dedicated)
            return 0
            ;;
        *)
            echo -e "${RED}Error: Invalid product: $product${NC}"
            echo "Valid products: core, enterprise, clustered, cloud-dedicated"
            return 1
            ;;
    esac
}

# Get the correct Docker image name for a product
get_docker_image() {
    local product=$1
    local version=$2
    
    case "$product" in
        core|enterprise)
            echo "influxdb:${version}-${product}"
            ;;
        clustered)
            echo "us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:${version}"
            ;;
        cloud-dedicated)
            # Cloud Dedicated typically uses the same image as clustered
            echo "us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:${version}"
            ;;
        *)
            return 1
            ;;
    esac
}