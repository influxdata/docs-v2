#!/bin/bash
# Run metrics endpoint tests with authentication
#
# Usage:
#   ./test/run-metrics-tests.sh              # Run direct metrics tests
#   ./test/run-metrics-tests.sh --prometheus # Run Prometheus integration tests
#   ./test/run-metrics-tests.sh --all        # Run both test suites

set -e

# Read tokens from secret files
INFLUXDB3_CORE_TOKEN=$(cat ~/.env.influxdb3-core-admin-token)
INFLUXDB3_ENTERPRISE_TOKEN=$(cat ~/.env.influxdb3-enterprise-admin-token)

# Export for docker compose
export INFLUXDB3_CORE_TOKEN
export INFLUXDB3_ENTERPRISE_TOKEN
export VERBOSE_METRICS_TEST

# Parse arguments
RUN_DIRECT=true
RUN_PROMETHEUS=false

if [[ "$1" == "--prometheus" ]]; then
    RUN_DIRECT=false
    RUN_PROMETHEUS=true
    shift
elif [[ "$1" == "--all" ]]; then
    RUN_DIRECT=true
    RUN_PROMETHEUS=true
    shift
fi

# Run direct metrics tests
if [[ "$RUN_DIRECT" == "true" ]]; then
    echo "Running direct metrics endpoint tests..."
    docker compose run --rm \
      -e INFLUXDB3_CORE_TOKEN \
      -e INFLUXDB3_ENTERPRISE_TOKEN \
      -e VERBOSE_METRICS_TEST \
      influxdb3-core-pytest \
      "test/influxdb3/metrics_endpoint_test.py" "$@"
    echo ""
fi

# Run Prometheus integration tests
if [[ "$RUN_PROMETHEUS" == "true" ]]; then
    echo "Running Prometheus integration tests..."
    ./test/influxdb3/run-prometheus-tests.sh "$@"
fi
