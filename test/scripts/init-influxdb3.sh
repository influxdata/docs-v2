#!/bin/bash
# Initialize InfluxDB 3 Core or Enterprise for documentation testing.
#
# Usage:
#   ./test/scripts/init-influxdb3.sh core        # Initialize Core (per-worktree)
#   ./test/scripts/init-influxdb3.sh enterprise  # Initialize Enterprise (shared)
#   ./test/scripts/init-influxdb3.sh all         # Initialize both
#
# This script:
#   1. Creates required directories
#   2. Generates authentication tokens (if not existing)
#   3. Starts the requested service(s)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Shared data location for Enterprise (outside worktrees)
# This location persists data, tokens, and license across all worktrees
INFLUXDB3_HOME="$HOME/influxdata-docs/.influxdb3"
ENTERPRISE_DATA_DIR="$INFLUXDB3_HOME/enterprise"
SHARED_PLUGINS_DIR="$INFLUXDB3_HOME/plugins"

# Per-worktree data location for Core
CORE_DATA_DIR="$PROJECT_ROOT/test/.influxdb3/core"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

init_core() {
    log_info "Initializing InfluxDB 3 Core..."

    # Create directories
    mkdir -p "$CORE_DATA_DIR/data" "$CORE_DATA_DIR/plugins"

    # Generate token if not exists
    TOKEN_FILE="$CORE_DATA_DIR/.token"
    if [[ ! -f "$TOKEN_FILE" ]]; then
        log_info "Generating new authentication token..."
        CORE_TOKEN="apiv3_$(openssl rand -hex 32)"

        # Create JSON file with secure permissions (same format as Enterprise)
        (umask 077 && cat > "$TOKEN_FILE" << EOF
{
  "token": "${CORE_TOKEN}",
  "name": "admin",
  "description": "Admin token for InfluxDB 3 Core"
}
EOF
)
        log_info "Token saved to $TOKEN_FILE"
        log_warn "Save this token - you'll need it to access Core:"
        echo "  $CORE_TOKEN"
    else
        log_info "Using existing token from $TOKEN_FILE"
    fi

    # Start the service
    log_info "Starting influxdb3-core..."
    cd "$PROJECT_ROOT"
    docker compose up -d influxdb3-core

    log_info "Core initialized successfully!"
    log_info "  - Data: $CORE_DATA_DIR/data"
    log_info "  - Port: http://localhost:8282"
    echo ""
    log_warn "To use the token in API calls:"
    echo "  export INFLUXDB3_CORE_TOKEN=\$(jq -r .token $TOKEN_FILE)"
}

init_enterprise() {
    log_info "Initializing InfluxDB 3 Enterprise (shared instance)..."

    # Create shared directories
    mkdir -p "$ENTERPRISE_DATA_DIR/data" "$SHARED_PLUGINS_DIR"

    # Check for .env file with license email
    ENV_FILE="$ENTERPRISE_DATA_DIR/.env"
    if [[ ! -f "$ENV_FILE" ]]; then
        log_error ".env file not found at $ENV_FILE"
        log_info "Create the .env file with your trial license email:"
        echo ""
        echo "  mkdir -p $ENTERPRISE_DATA_DIR"
        echo "  echo 'INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=your-email@example.com' > $ENV_FILE"
        echo ""
        exit 1
    fi

    # Verify the .env file contains the required variable
    if ! grep -q "INFLUXDB3_ENTERPRISE_LICENSE_EMAIL" "$ENV_FILE"; then
        log_error ".env file missing INFLUXDB3_ENTERPRISE_LICENSE_EMAIL"
        log_info "Add your trial license email to $ENV_FILE:"
        echo ""
        echo "  echo 'INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=your-email@example.com' >> $ENV_FILE"
        echo ""
        exit 1
    fi

    # Generate admin token if not exists
    ADMIN_TOKEN_FILE="$ENTERPRISE_DATA_DIR/admin-token.json"
    if [[ ! -f "$ADMIN_TOKEN_FILE" ]]; then
        log_info "Generating admin token..."
        ADMIN_TOKEN="apiv3_$(openssl rand -hex 32)"

        # Create JSON file with secure permissions
        (umask 077 && cat > "$ADMIN_TOKEN_FILE" << EOF
{
  "token": "${ADMIN_TOKEN}",
  "name": "admin",
  "description": "Admin token for InfluxDB 3 Enterprise"
}
EOF
)
        log_info "Admin token saved to $ADMIN_TOKEN_FILE"
        log_warn "Save this token - you'll need it to access Enterprise:"
        echo "  $ADMIN_TOKEN"
    else
        log_info "Using existing admin token from $ADMIN_TOKEN_FILE"
    fi

    # Start the service
    log_info "Starting influxdb3-enterprise..."
    cd "$PROJECT_ROOT"
    docker compose --profile shared up -d influxdb3-enterprise

    log_info "Enterprise initialized successfully!"
    log_info "  - Data: $ENTERPRISE_DATA_DIR/data"
    log_info "  - Plugins: $SHARED_PLUGINS_DIR"
    log_info "  - Port: http://localhost:8181"
    log_info "  - License persists in the data directory"
    log_info "  - Admin token: $ADMIN_TOKEN_FILE"
    echo ""
    log_warn "To use the admin token in API calls:"
    echo "  export INFLUXDB3_ENTERPRISE_TOKEN=\$(jq -r .token $ADMIN_TOKEN_FILE)"
}

show_usage() {
    echo "Usage: $0 {core|enterprise|all}"
    echo ""
    echo "Commands:"
    echo "  core        Initialize InfluxDB 3 Core (per-worktree instance)"
    echo "  enterprise  Initialize InfluxDB 3 Enterprise (shared instance)"
    echo "  all         Initialize both Core and Enterprise"
    echo ""
    echo "Examples:"
    echo "  $0 core        # Start Core for this worktree"
    echo "  $0 enterprise  # Start shared Enterprise instance"
}

# Main
case "${1:-}" in
    core)
        init_core
        ;;
    enterprise)
        init_enterprise
        ;;
    all)
        init_core
        echo ""
        init_enterprise
        ;;
    -h|--help|"")
        show_usage
        ;;
    *)
        log_error "Unknown command: $1"
        show_usage
        exit 1
        ;;
esac
