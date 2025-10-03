"""Test InfluxDB 3 metrics endpoint for PR #6422.

This test suite validates that the metrics documentation in PR #6422 is accurate
by checking that all documented metrics are actually exposed by the
InfluxDB 3 Core and Enterprise instances.

Usage:
    # Basic test execution
    docker compose run --rm influxdb3-core-pytest test/metrics_endpoint_test.py

    # With verbose output (shows actual metrics and matches)
    VERBOSE_METRICS_TEST=true docker compose run --rm influxdb3-core-pytest test/metrics_endpoint_test.py

    # Using the wrapper script (recommended)
    ./test/run-metrics-tests.sh

    # With verbose output using wrapper script
    VERBOSE_METRICS_TEST=true ./test/run-metrics-tests.sh

Verbose Output:
    Set VERBOSE_METRICS_TEST=true to see detailed output showing:
    - Which metrics are being searched for
    - Actual matching lines from the Prometheus metrics endpoint
    - Total occurrence counts (for tests that include comments)
    - Clear indication when metrics are not found

    Example verbose output:
        TEST: HTTP/gRPC Metrics
        ================================================================================

        ✓ Searching for: http_requests_total
          Found 12 total occurrences
          Matches:
            # HELP http_requests_total accumulated total requests
            # TYPE http_requests_total counter
            http_requests_total{method="GET",path="/metrics",status="aborted"} 0

Authentication:
    These tests require authentication tokens for InfluxDB 3 Core and Enterprise.
    If you get 401 errors, set the following environment variables:
    - INFLUXDB3_CORE_TOKEN: Admin token for InfluxDB 3 Core instance
    - INFLUXDB3_ENTERPRISE_TOKEN: Admin token for InfluxDB 3 Enterprise instance

Prerequisites:
    - Docker and Docker Compose installed
    - Running InfluxDB 3 Core and Enterprise containers
    - Valid authentication tokens stored in ~/.env.influxdb3-core-admin-token
      and ~/.env.influxdb3-enterprise-admin-token (for wrapper script)
"""

import os
import re

import pytest
import requests

# Set to True to see detailed output of what's being checked
VERBOSE_OUTPUT = os.environ.get("VERBOSE_METRICS_TEST", "false").lower() == "true"


class MetricsHelper:
    """Helper class for metrics endpoint testing."""

    @staticmethod
    def get_auth_headers(token_env_var):
        """Get authorization headers if token is set."""
        token = os.environ.get(token_env_var)
        if token:
            return {"Authorization": f"Token {token}"}
        return {}

    @staticmethod
    def get_metrics(url, token_env_var):
        """Get metrics from endpoint with optional authentication."""
        headers = MetricsHelper.get_auth_headers(token_env_var)
        response = requests.get(f"{url}/metrics", headers=headers, timeout=5)

        if response.status_code == 401:
            pytest.skip(f"Authentication required. Set {token_env_var} environment variable.")

        assert response.status_code == 200, f"Metrics returned {response.status_code}"
        return response.text

    @staticmethod
    def print_metric_search(test_name, metrics, text, include_comments=False):
        """Print verbose output showing searched metrics and matches."""
        if not VERBOSE_OUTPUT:
            return

        print("\n" + "="*80)
        print(f"TEST: {test_name}")
        print("="*80)

        for metric in metrics:
            lines = text.split('\n')
            if include_comments:
                matches = [line for line in lines if metric in line][:3]
            else:
                matches = [line for line in lines if metric in line and not line.startswith("#")][:3]

            print(f"\n✓ Searching for: {metric}")
            if matches:
                if include_comments:
                    print(f"  Found {len([l for l in lines if metric in l])} total occurrences")
                print("  Matches:")
                for match in matches:
                    print(f"    {match}")
            else:
                print(f"  ✗ NOT FOUND")


def test_core_metrics_endpoint_accessible():
    """Test that Core metrics endpoint is accessible."""
    text = MetricsHelper.get_metrics("http://influxdb3-core:8181", "INFLUXDB3_CORE_TOKEN")
    assert len(text) > 0, "Core metrics response is empty"


def test_enterprise_metrics_endpoint_accessible():
    """Test that Enterprise metrics endpoint is accessible."""
    text = MetricsHelper.get_metrics("http://influxdb3-enterprise:8181", "INFLUXDB3_ENTERPRISE_TOKEN")
    assert len(text) > 0, "Enterprise metrics response is empty"


def test_prometheus_format():
    """Test that metrics follow Prometheus exposition format."""
    text = MetricsHelper.get_metrics("http://influxdb3-core:8181", "INFLUXDB3_CORE_TOKEN")

    # Check for HELP comments
    assert "# HELP" in text, "Missing HELP comments"

    # Check for TYPE comments
    assert "# TYPE" in text, "Missing TYPE comments"

    # Check for valid metric lines (name{labels} value or name value)
    metric_pattern = r"^[a-zA-Z_][a-zA-Z0-9_]*(\{[^}]*\})?\s+[\d\.\+\-eE]+(\s+\d+)?$"
    lines = [line for line in text.split("\n") if line and not line.startswith("#")]
    assert any(
        re.match(metric_pattern, line) for line in lines
    ), "No valid metric lines found"


def test_http_grpc_metrics():
    """Test HTTP and gRPC metrics exist."""
    text = MetricsHelper.get_metrics("http://influxdb3-core:8181", "INFLUXDB3_CORE_TOKEN")

    metrics = [
        "http_requests_total",
        "http_request_duration_seconds",
        "http_response_body_size_bytes",
        "grpc_requests_total",
        "grpc_request_duration_seconds",
    ]

    MetricsHelper.print_metric_search("HTTP/gRPC Metrics", metrics, text, include_comments=True)

    missing = [m for m in metrics if m not in text]
    assert not missing, f"Missing HTTP/gRPC metrics: {missing}"


def test_database_operation_metrics():
    """Test database operation metrics exist."""
    text = MetricsHelper.get_metrics("http://influxdb3-core:8181", "INFLUXDB3_CORE_TOKEN")

    metrics = [
        "influxdb3_catalog_operations_total",
        "influxdb3_catalog_operation_retries_total",
    ]

    MetricsHelper.print_metric_search("Database Operation Metrics", metrics, text)

    missing = [m for m in metrics if m not in text]
    assert not missing, f"Missing database operation metrics: {missing}"


def test_query_performance_metrics():
    """Test query performance metrics exist."""
    text = MetricsHelper.get_metrics("http://influxdb3-core:8181", "INFLUXDB3_CORE_TOKEN")

    metrics = [
        "influxdb_iox_query_log_compute_duration_seconds",
        "influxdb_iox_query_log_execute_duration_seconds",
        "influxdb_iox_query_log_plan_duration_seconds",
        "influxdb_iox_query_log_end2end_duration_seconds",
        "influxdb_iox_query_log_max_memory",
        "influxdb_iox_query_log_parquet_files",
    ]

    MetricsHelper.print_metric_search("Query Performance Metrics", metrics, text)

    missing = [m for m in metrics if m not in text]
    assert not missing, f"Missing query performance metrics: {missing}"


def test_memory_caching_metrics():
    """Test memory and caching metrics exist."""
    text = MetricsHelper.get_metrics("http://influxdb3-core:8181", "INFLUXDB3_CORE_TOKEN")

    metrics = [
        "datafusion_mem_pool_bytes",
        "influxdb3_parquet_cache_access_total",
        "influxdb3_parquet_cache_size_bytes",
        "influxdb3_parquet_cache_size_number_of_files",
        "jemalloc_memstats_bytes",
    ]

    MetricsHelper.print_metric_search("Memory & Caching Metrics", metrics, text)

    missing = [m for m in metrics if m not in text]
    assert not missing, f"Missing memory/caching metrics: {missing}"


def test_object_storage_metrics():
    """Test object storage metrics exist."""
    text = MetricsHelper.get_metrics("http://influxdb3-core:8181", "INFLUXDB3_CORE_TOKEN")

    metrics = [
        "object_store_op_duration_seconds",
        "object_store_transfer_bytes_total",
        "object_store_transfer_objects_total",
    ]

    MetricsHelper.print_metric_search("Object Storage Metrics", metrics, text)

    missing = [m for m in metrics if m not in text]
    assert not missing, f"Missing object storage metrics: {missing}"


def test_runtime_system_metrics():
    """Test runtime and system metrics exist."""
    text = MetricsHelper.get_metrics("http://influxdb3-core:8181", "INFLUXDB3_CORE_TOKEN")

    metrics = [
        "process_start_time_seconds",
        "thread_panic_count_total",
        "tokio_runtime_num_alive_tasks",
    ]

    MetricsHelper.print_metric_search("Runtime & System Metrics", metrics, text)

    missing = [m for m in metrics if m not in text]
    assert not missing, f"Missing runtime/system metrics: {missing}"


def test_metric_types():
    """Test that key metrics have correct types."""
    text = MetricsHelper.get_metrics("http://influxdb3-core:8181", "INFLUXDB3_CORE_TOKEN")

    # Check for expected types (case-insensitive partial match)
    type_checks = [
        ("http_requests_total", "counter"),
        ("http_request_duration_seconds", "histogram"),
        ("datafusion_mem_pool_bytes", "gauge"),
    ]

    if VERBOSE_OUTPUT:
        print("\n" + "="*80)
        print("TEST: Metric Type Validation")
        print("="*80)
        for metric_name, expected_type in type_checks:
            type_pattern = rf"# TYPE {metric_name}\s+{expected_type}"
            match = re.search(type_pattern, text, re.IGNORECASE)
            print(f"\n✓ Checking: {metric_name} should be {expected_type}")
            if match:
                print(f"  Match: {match.group()}")
            else:
                print(f"  ✗ NOT FOUND or WRONG TYPE")

    for metric_name, expected_type in type_checks:
        # Look for TYPE line for this metric
        type_pattern = rf"# TYPE {metric_name}\s+{expected_type}"
        assert re.search(
            type_pattern, text, re.IGNORECASE
        ), f"Metric {metric_name} should be type {expected_type}"


def test_enterprise_cluster_metrics():
    """Test Enterprise-specific cluster metrics exist."""
    text = MetricsHelper.get_metrics("http://influxdb3-enterprise:8181", "INFLUXDB3_ENTERPRISE_TOKEN")

    # These metrics are mentioned in Enterprise documentation
    metrics = [
        "influxdb3_catalog_operation_retries_total",
        "influxdb_iox_query_log_ingester_latency",
    ]

    MetricsHelper.print_metric_search("Enterprise Cluster Metrics", metrics, text)

    missing = [m for m in metrics if m not in text]
    assert not missing, f"Missing Enterprise cluster metrics: {missing}"


@pytest.mark.parametrize("url,token_env,instance", [
    ("http://influxdb3-core:8181", "INFLUXDB3_CORE_TOKEN", "Core"),
    ("http://influxdb3-enterprise:8181", "INFLUXDB3_ENTERPRISE_TOKEN", "Enterprise")
])
def test_metrics_have_labels(url, token_env, instance):
    """Test that metrics have proper labels."""
    text = MetricsHelper.get_metrics(url, token_env)

    # Find a metric with labels (look for http_requests_total)
    label_pattern = r'http_requests_total\{[^}]+\}'
    matches = re.findall(label_pattern, text)

    if VERBOSE_OUTPUT:
        print("\n" + "="*80)
        print(f"TEST: Metric Label Validation ({instance})")
        print("="*80)
        print(f"\n✓ Searching for labeled metrics using pattern: {label_pattern}")
        print(f"  Found {len(matches)} labeled metrics")
        if matches:
            print("  Sample matches:")
            for match in matches[:3]:
                print(f"    {match}")

    assert len(matches) > 0, f"{instance}: No metrics with labels found"

    # Check that labels are properly formatted
    for match in matches:
        assert '="' in match, f"{instance}: Labels should use = and quotes"
        assert match.endswith("}"), f"{instance}: Labels should end with }}"
