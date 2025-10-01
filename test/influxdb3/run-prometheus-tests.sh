#!/bin/bash
# Run Prometheus integration tests with authentication
# This script validates that Prometheus can scrape InfluxDB metrics
# and that relabeling configuration works as documented.

set -e

# Read tokens from secret files
INFLUXDB3_CORE_TOKEN=$(cat ~/.env.influxdb3-core-admin-token)
INFLUXDB3_ENTERPRISE_TOKEN=$(cat ~/.env.influxdb3-enterprise-admin-token)

# Export for docker compose
export INFLUXDB3_CORE_TOKEN
export INFLUXDB3_ENTERPRISE_TOKEN
export VERBOSE_PROMETHEUS_TEST

echo "Starting Prometheus integration tests..."
echo ""
echo "This will:"
echo "  1. Start Prometheus with documented configuration"
echo "  2. Wait for Prometheus to scrape InfluxDB endpoints"
echo "  3. Validate relabeling adds node_name and node_role labels"
echo "  4. Test PromQL queries with relabeled metrics"
echo ""

# Start Prometheus if not already running
if ! docker ps | grep -q prometheus; then
    echo "Starting Prometheus service..."
    docker compose --profile monitoring up -d prometheus
    echo "Waiting for Prometheus to start..."
    sleep 5
fi

# Run tests
echo "Running Prometheus integration tests..."
docker compose run --rm \
  -e INFLUXDB3_CORE_TOKEN \
  -e INFLUXDB3_ENTERPRISE_TOKEN \
  -e VERBOSE_PROMETHEUS_TEST \
  -e PROMETHEUS_URL=http://prometheus:9090 \
  influxdb3-core-pytest \
  "test/influxdb3/prometheus_integration_test.py" "$@"

echo ""
echo "Tests complete!"
echo ""
echo "To view Prometheus UI, visit: http://localhost:9090"
echo "To stop Prometheus: docker compose --profile monitoring down"
