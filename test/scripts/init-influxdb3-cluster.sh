#!/bin/bash
# Initialize a multi-node InfluxDB 3 Enterprise cluster for documentation
# testing: one ingest+compact node, one query node, backed by a shared MinIO
# bucket. This is the topology that features like load capture require
# (loadcap needs a node whose explicit --mode includes query; the default
# --mode all does not expose it).
#
# Usage:
#   ./test/scripts/init-influxdb3-cluster.sh up      # Start the cluster (default)
#   ./test/scripts/init-influxdb3-cluster.sh down    # Stop and remove containers
#   ./test/scripts/init-influxdb3-cluster.sh status  # Show cluster state
#
# Endpoints once up:
#   http://localhost:8384  ingest node (writes; compaction runs here)
#   http://localhost:8383  query node (queries; loadcap API)
#
# Reuses the shared Enterprise settings from init-influxdb3.sh:
#   ~/influxdata-docs/.influxdb3/enterprise/.env             license email
#   ~/influxdata-docs/.influxdb3/enterprise/admin-token.json admin token
#
# The trial license supports one cluster: this script stops the standalone
# influxdb3-enterprise service before starting, and vice versa.

set -euo pipefail

INFLUXDB3_HOME="$HOME/influxdata-docs/.influxdb3"
ENTERPRISE_DATA_DIR="$INFLUXDB3_HOME/enterprise"
CLUSTER_DIR="$INFLUXDB3_HOME/enterprise-cluster"
MINIO_DATA_DIR="$CLUSTER_DIR/minio"

ENTERPRISE_IMAGE="${INFLUXDB3_ENTERPRISE_IMAGE:-influxdb:3-enterprise}"
NETWORK="influxdb3-ent-cluster"
CLUSTER_ID="cluster0"
BUCKET="influxdb3"
INGEST_PORT="${INFLUXDB3_CLUSTER_INGEST_PORT:-8384}"
QUERY_PORT="${INFLUXDB3_CLUSTER_QUERY_PORT:-8383}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

require_license_env() {
    ENV_FILE="$ENTERPRISE_DATA_DIR/.env"
    if [[ ! -f "$ENV_FILE" ]] || ! grep -q "INFLUXDB3_ENTERPRISE_LICENSE_EMAIL" "$ENV_FILE"; then
        log_error "License email not configured."
        log_info "Run ./test/scripts/init-influxdb3.sh enterprise once, or create:"
        echo ""
        echo "  mkdir -p $ENTERPRISE_DATA_DIR"
        echo "  echo 'INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=your-email@example.com' > $ENV_FILE"
        echo ""
        exit 1
    fi
    LICENSE_EMAIL=$(grep "INFLUXDB3_ENTERPRISE_LICENSE_EMAIL" "$ENV_FILE" | head -1 | cut -d= -f2 | tr -d ' "'"'"'')
    if [[ -z "$LICENSE_EMAIL" || "$LICENSE_EMAIL" == *"example.com"* ]]; then
        log_error "License email appears to be a placeholder: $LICENSE_EMAIL"
        exit 1
    fi
}

require_admin_token() {
    ADMIN_TOKEN_FILE="$ENTERPRISE_DATA_DIR/admin-token.json"
    if [[ ! -f "$ADMIN_TOKEN_FILE" ]]; then
        log_info "Generating admin token..."
        mkdir -p "$ENTERPRISE_DATA_DIR"
        ADMIN_TOKEN="apiv3_$(openssl rand -hex 32)"
        (umask 077 && cat > "$ADMIN_TOKEN_FILE" << EOF
{
  "token": "${ADMIN_TOKEN}",
  "name": "admin",
  "description": "Admin token for InfluxDB 3 Enterprise"
}
EOF
)
        log_warn "Save this token - you'll need it to access the cluster:"
        echo "  $ADMIN_TOKEN"
    fi
}

serve_node() {
    # serve_node <name> <node-id> <host-port> <mode-args...>
    local name="$1" node_id="$2" host_port="$3"
    shift 3
    docker run -d --name "$name" --network "$NETWORK" \
        -p "$host_port:8181" \
        --env-file "$ENTERPRISE_DATA_DIR/.env" \
        -v "$ENTERPRISE_DATA_DIR/admin-token.json:/run/secrets/admin-token:ro" \
        "$ENTERPRISE_IMAGE" \
        serve \
        --node-id="$node_id" \
        --cluster-id="$CLUSTER_ID" \
        "$@" \
        --object-store=s3 \
        --bucket="$BUCKET" \
        --aws-endpoint=http://minio:9000 \
        --aws-access-key-id=minioadmin \
        --aws-secret-access-key=minioadmin \
        --aws-allow-http \
        --admin-token-file=/run/secrets/admin-token \
        --use-pacha-tree >/dev/null
    log_info "Started $name (port $host_port)"
}

cluster_up() {
    require_license_env
    require_admin_token
    mkdir -p "$MINIO_DATA_DIR"

    # One trial license, one cluster: the standalone service must not run
    # alongside this cluster.
    if docker ps --format '{{.Names}}' | grep -q '^influxdb3-enterprise$'; then
        log_warn "Stopping standalone influxdb3-enterprise (one license, one cluster)..."
        docker stop influxdb3-enterprise >/dev/null
    fi

    docker network inspect "$NETWORK" >/dev/null 2>&1 \
        || docker network create "$NETWORK" >/dev/null

    if ! docker ps --format '{{.Names}}' | grep -q '^influxdb3-cluster-minio$'; then
        log_info "Starting MinIO..."
        docker rm -f influxdb3-cluster-minio >/dev/null 2>&1 || true
        docker run -d --name influxdb3-cluster-minio --network "$NETWORK" \
            --network-alias minio \
            -e MINIO_ROOT_USER=minioadmin -e MINIO_ROOT_PASSWORD=minioadmin \
            -v "$MINIO_DATA_DIR:/data" \
            minio/minio server /data >/dev/null
    fi

    # The bucket must exist before either node initializes its catalog.
    log_info "Ensuring bucket '$BUCKET' exists..."
    docker run --rm --network "$NETWORK" --entrypoint /bin/sh minio/mc -c \
        "until mc alias set local http://minio:9000 minioadmin minioadmin >/dev/null 2>&1; do sleep 1; done; mc mb --ignore-existing local/$BUCKET" >/dev/null

    docker rm -f influxdb3-ent-ingest influxdb3-ent-query >/dev/null 2>&1 || true
    serve_node influxdb3-ent-ingest ingest0 "$INGEST_PORT" --mode=ingest --mode=compact
    serve_node influxdb3-ent-query query0 "$QUERY_PORT" --mode=query

    log_info "Waiting for the query node to answer..."
    RETRIES=0
    while [[ $RETRIES -lt 30 ]]; do
        # /health is privileged (401 unauthenticated); any HTTP status means
        # the server is up and routing requests.
        CODE=$(curl -s --connect-timeout 2 --max-time 4 -o /dev/null -w '%{http_code}' \
            "http://localhost:$QUERY_PORT/health" 2>/dev/null || true)
        if [[ "$CODE" =~ ^[1-5][0-9][0-9]$ ]]; then
            break
        fi
        RETRIES=$((RETRIES + 1))
        sleep 2
    done
    if [[ $RETRIES -eq 30 ]]; then
        log_error "Query node did not answer within 60 seconds."
        log_info "Check logs: docker logs influxdb3-ent-query"
        exit 1
    fi

    log_info "Cluster ready."
    echo ""
    log_info "  Writes (ingest+compact): http://localhost:$INGEST_PORT"
    log_info "  Queries and loadcap:     http://localhost:$QUERY_PORT"
    echo ""
    log_warn "Use the admin token:"
    echo "  export INFLUXDB3_AUTH_TOKEN=\$(jq -r .token $ENTERPRISE_DATA_DIR/admin-token.json)"
}

cluster_down() {
    docker rm -f influxdb3-ent-query influxdb3-ent-ingest influxdb3-cluster-minio >/dev/null 2>&1 || true
    docker network rm "$NETWORK" >/dev/null 2>&1 || true
    log_info "Cluster stopped. MinIO data (catalog, license) kept in $MINIO_DATA_DIR."
}

cluster_status() {
    docker ps --filter name='influxdb3-ent-' --filter name=influxdb3-cluster-minio \
        --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
}

case "${1:-up}" in
    up) cluster_up ;;
    down) cluster_down ;;
    status) cluster_status ;;
    *)
        log_error "Unknown command: $1"
        echo "Usage: $0 [up|down|status]"
        exit 1
        ;;
esac
