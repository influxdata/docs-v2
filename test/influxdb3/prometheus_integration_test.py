"""Test Prometheus integration and relabeling for PR #6422.

This test suite validates that the Prometheus configuration and relabeling
examples documented in PR #6422 actually work correctly.

Unlike metrics_endpoint_test.py which directly queries InfluxDB endpoints,
this test:
1. Starts Prometheus with the documented configuration
2. Validates Prometheus can scrape InfluxDB endpoints
3. Verifies relabeling rules add node_name and node_role labels
4. Tests PromQL queries with the relabeled metrics

Usage:
    # Start Prometheus and run integration tests
    docker compose --profile monitoring up -d
    docker compose run --rm influxdb3-core-pytest test/prometheus_integration_test.py

    # Or use the wrapper script
    ./test/run-prometheus-tests.sh

Prerequisites:
    - Docker and Docker Compose installed
    - Running InfluxDB 3 Core and Enterprise containers
    - Prometheus service started with --profile monitoring
    - Valid authentication tokens (if required)
"""

import os
import time

import pytest
import requests

# Prometheus API endpoint
PROMETHEUS_URL = os.environ.get("PROMETHEUS_URL", "http://prometheus:9090")

# Set to True to see detailed output
VERBOSE_OUTPUT = os.environ.get("VERBOSE_PROMETHEUS_TEST", "false").lower() == "true"


class PrometheusHelper:
    """Helper class for Prometheus integration testing."""

    @staticmethod
    def wait_for_prometheus(timeout=30):
        """Wait for Prometheus to be ready."""
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                response = requests.get(f"{PROMETHEUS_URL}/-/ready", timeout=5)
                if response.status_code == 200:
                    return True
            except requests.exceptions.RequestException:
                pass
            time.sleep(1)
        return False

    @staticmethod
    def wait_for_targets(timeout=60):
        """Wait for Prometheus to discover and scrape targets."""
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                response = requests.get(
                    f"{PROMETHEUS_URL}/api/v1/targets",
                    timeout=5
                )
                if response.status_code == 200:
                    data = response.json()
                    active_targets = data.get("data", {}).get("activeTargets", [])

                    # Check if all targets are up
                    all_up = all(
                        target.get("health") == "up"
                        for target in active_targets
                    )

                    if all_up and len(active_targets) >= 2:
                        if VERBOSE_OUTPUT:
                            print(f"\n✓ All {len(active_targets)} targets are up")
                        return True

                    if VERBOSE_OUTPUT:
                        up_count = sum(
                            1 for t in active_targets
                            if t.get("health") == "up"
                        )
                        print(f"  Waiting for targets: {up_count}/{len(active_targets)} up")
            except requests.exceptions.RequestException as e:
                if VERBOSE_OUTPUT:
                    print(f"  Error checking targets: {e}")
            time.sleep(2)
        return False

    @staticmethod
    def query_prometheus(query):
        """Execute a PromQL query."""
        response = requests.get(
            f"{PROMETHEUS_URL}/api/v1/query",
            params={"query": query},
            timeout=10
        )
        assert response.status_code == 200, f"Query failed: {response.text}"
        return response.json()

    @staticmethod
    def print_query_result(query, result):
        """Print verbose query result."""
        if not VERBOSE_OUTPUT:
            return

        print(f"\n✓ Query: {query}")
        data = result.get("data", {})
        result_type = data.get("resultType")
        results = data.get("result", [])

        print(f"  Result type: {result_type}")
        print(f"  Number of results: {len(results)}")

        if results:
            print("  Sample results:")
            for result in results[:3]:
                metric = result.get("metric", {})
                value = result.get("value", [None, None])
                print(f"    {metric} => {value[1]}")


def test_prometheus_is_ready():
    """Test that Prometheus service is ready."""
    assert PrometheusHelper.wait_for_prometheus(), (
        "Prometheus not ready after 30 seconds. "
        "Ensure Prometheus is running: docker compose --profile monitoring up -d"
    )


def test_prometheus_targets_discovered():
    """Test that Prometheus has discovered InfluxDB targets."""
    response = requests.get(f"{PROMETHEUS_URL}/api/v1/targets", timeout=10)
    assert response.status_code == 200, "Failed to get targets"

    data = response.json()
    targets = data.get("data", {}).get("activeTargets", [])

    if VERBOSE_OUTPUT:
        print("\n" + "="*80)
        print("TEST: Prometheus Target Discovery")
        print("="*80)
        for target in targets:
            health = target.get("health")
            job = target.get("labels", {}).get("job")
            address = target.get("scrapeUrl")
            print(f"\n✓ Target: {job}")
            print(f"  Health: {health}")
            print(f"  Address: {address}")

    # Should have at least 2 targets (core and enterprise)
    assert len(targets) >= 2, f"Expected at least 2 targets, found {len(targets)}"

    # Check for expected job names
    job_names = {target.get("labels", {}).get("job") for target in targets}
    assert "influxdb3-core" in job_names, "Missing influxdb3-core target"
    assert "influxdb3-enterprise" in job_names, "Missing influxdb3-enterprise target"


def test_prometheus_targets_up():
    """Test that all Prometheus targets are healthy."""
    assert PrometheusHelper.wait_for_targets(), (
        "Targets not healthy after 60 seconds. "
        "Check that InfluxDB instances are running and accessible."
    )

    response = requests.get(f"{PROMETHEUS_URL}/api/v1/targets", timeout=10)
    data = response.json()
    targets = data.get("data", {}).get("activeTargets", [])

    unhealthy = [
        target for target in targets
        if target.get("health") != "up"
    ]

    assert not unhealthy, (
        f"Found {len(unhealthy)} unhealthy targets: "
        f"{[t.get('labels', {}).get('job') for t in unhealthy]}"
    )


def test_relabeling_adds_node_name():
    """Test that relabeling adds node_name label.

    Documentation reference: monitor-metrics.md lines 536-540
    Relabeling extracts hostname from __address__ and adds as node_name.
    """
    # Wait for metrics to be scraped
    time.sleep(5)

    # Query for any metric with node_name label
    query = 'http_requests_total{node_name!=""}'
    result = PrometheusHelper.query_prometheus(query)

    PrometheusHelper.print_query_result(query, result)

    data = result.get("data", {})
    results = data.get("result", [])

    assert len(results) > 0, (
        "No metrics found with node_name label. "
        "Relabeling may not be working correctly."
    )

    # Verify node_name values match expected patterns
    node_names = {
        result.get("metric", {}).get("node_name")
        for result in results
    }

    if VERBOSE_OUTPUT:
        print(f"\n✓ Found node_name labels: {node_names}")

    # Should have node names for both core and enterprise
    assert any("core" in name for name in node_names), (
        "No node_name containing 'core' found"
    )
    assert any("enterprise" in name for name in node_names), (
        "No node_name containing 'enterprise' found"
    )


def test_relabeling_adds_node_role():
    """Test that relabeling adds node_role label.

    Documentation reference: monitor-metrics.md lines 541-553
    Relabeling assigns node_role based on node_name pattern.
    """
    # Wait for metrics to be scraped
    time.sleep(5)

    # Query for metrics with node_role label
    query = 'http_requests_total{node_role!=""}'
    result = PrometheusHelper.query_prometheus(query)

    PrometheusHelper.print_query_result(query, result)

    data = result.get("data", {})
    results = data.get("result", [])

    assert len(results) > 0, (
        "No metrics found with node_role label. "
        "Relabeling may not be working correctly."
    )

    # Verify node_role values
    node_roles = {
        result.get("metric", {}).get("node_role")
        for result in results
    }

    if VERBOSE_OUTPUT:
        print(f"\n✓ Found node_role labels: {node_roles}")

    # Based on test/prometheus.yml relabeling rules
    expected_roles = {"all-in-one-core", "all-in-one-enterprise"}
    assert node_roles & expected_roles, (
        f"Expected roles {expected_roles}, found {node_roles}"
    )


def test_query_metrics_by_node():
    """Test that metrics can be queried by node labels.

    This validates that users can filter metrics by node_name and node_role
    as documented in the monitoring guide.
    """
    # Wait for metrics to be scraped
    time.sleep(5)

    # Query metrics for specific node
    queries = [
        'http_requests_total{node_name="influxdb3-core"}',
        'http_requests_total{node_name="influxdb3-enterprise"}',
        'http_requests_total{node_role="all-in-one-core"}',
        'http_requests_total{node_role="all-in-one-enterprise"}',
    ]

    if VERBOSE_OUTPUT:
        print("\n" + "="*80)
        print("TEST: Query Metrics by Node Labels")
        print("="*80)

    for query in queries:
        result = PrometheusHelper.query_prometheus(query)
        PrometheusHelper.print_query_result(query, result)

        data = result.get("data", {})
        results = data.get("result", [])

        assert len(results) > 0, f"No results for query: {query}"


def test_promql_rate_query():
    """Test rate() query from documentation examples.

    Documentation commonly shows rate queries for counters.
    """
    # Wait for enough data
    time.sleep(10)

    query = 'rate(http_requests_total[1m])'
    result = PrometheusHelper.query_prometheus(query)

    PrometheusHelper.print_query_result(query, result)

    data = result.get("data", {})
    results = data.get("result", [])

    # Should have results (may be 0 if no recent requests)
    assert isinstance(results, list), "Expected list of results"


def test_promql_histogram_quantile():
    """Test histogram_quantile() query from documentation examples.

    Documentation reference: Example queries for query duration metrics.
    """
    # Wait for enough data
    time.sleep(10)

    query = 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[1m]))'
    result = PrometheusHelper.query_prometheus(query)

    PrometheusHelper.print_query_result(query, result)

    # Query should execute without error
    assert result.get("status") == "success", (
        f"Query failed: {result.get('error')}"
    )


def test_enterprise_metrics_queryable():
    """Test that Enterprise-specific metrics are queryable via Prometheus."""
    # Wait for metrics to be scraped
    time.sleep(5)

    # Query Enterprise-specific metrics
    queries = [
        'influxdb3_catalog_operation_retries_total',
        'influxdb_iox_query_log_ingester_latency',
    ]

    if VERBOSE_OUTPUT:
        print("\n" + "="*80)
        print("TEST: Enterprise-Specific Metrics")
        print("="*80)

    for query in queries:
        result = PrometheusHelper.query_prometheus(query)
        PrometheusHelper.print_query_result(query, result)

        # Query should execute (may have no results if no activity)
        assert result.get("status") == "success", (
            f"Query failed: {result.get('error')}"
        )


def test_prometheus_config_matches_docs():
    """Verify Prometheus configuration matches documented examples.

    This test validates that test/prometheus.yml matches the configuration
    examples in the documentation.
    """
    response = requests.get(f"{PROMETHEUS_URL}/api/v1/status/config", timeout=10)
    assert response.status_code == 200, "Failed to get Prometheus config"

    config = response.json()
    config_yaml = config.get("data", {}).get("yaml", "")

    if VERBOSE_OUTPUT:
        print("\n" + "="*80)
        print("TEST: Prometheus Configuration")
        print("="*80)
        print("\nConfiguration (first 500 chars):")
        print(config_yaml[:500])

    # Verify key configuration elements from documentation
    assert "influxdb3-core" in config_yaml, "Missing influxdb3-core job"
    assert "influxdb3-enterprise" in config_yaml, "Missing influxdb3-enterprise job"
    assert "relabel_configs" in config_yaml, "Missing relabel_configs"
    assert "node_name" in config_yaml, "Missing node_name in relabeling"
    assert "node_role" in config_yaml, "Missing node_role in relabeling"

    # Verify scrape settings
    assert "/metrics" in config_yaml, "Missing /metrics path"
