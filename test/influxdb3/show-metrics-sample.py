#!/usr/bin/env python3
"""Display sample metrics output from InfluxDB 3 instances."""

import os
import sys
import requests

def show_metrics_sample(url, token_env_var, instance_name, num_lines=150):
    """Fetch and display sample metrics."""
    print(f"\n{'='*80}")
    print(f"{instance_name} Metrics Sample (first {num_lines} lines)")
    print(f"URL: {url}/metrics")
    print(f"{'='*80}\n")

    # Get auth headers
    headers = {}
    token = os.environ.get(token_env_var)
    if token:
        headers = {"Authorization": f"Token {token}"}
        print(f"✓ Using authentication token from {token_env_var}\n")
    else:
        print(f"⚠ No token found in {token_env_var} - trying without auth\n")

    try:
        response = requests.get(f"{url}/metrics", headers=headers, timeout=5)

        if response.status_code == 401:
            print(f"✗ Authentication required but no valid token provided")
            return

        if response.status_code != 200:
            print(f"✗ Unexpected status code: {response.status_code}")
            return

        # Display first N lines
        lines = response.text.split('\n')
        print(f"Total lines: {len(lines)}\n")

        for i, line in enumerate(lines[:num_lines], 1):
            print(f"{i:4d} | {line}")

        if len(lines) > num_lines:
            print(f"\n... ({len(lines) - num_lines} more lines)")

        # Show some interesting metrics
        print(f"\n{'='*80}")
        print("Sample Metric Searches:")
        print(f"{'='*80}\n")

        metrics_to_show = [
            "http_requests_total",
            "grpc_requests_total",
            "influxdb3_catalog_operations_total",
            "influxdb_iox_query_log_compute_duration_seconds",
            "datafusion_mem_pool_bytes",
            "object_store_op_duration_seconds",
        ]

        for metric in metrics_to_show:
            matching = [line for line in lines if metric in line and not line.startswith("#")]
            if matching:
                print(f"✓ Found '{metric}' - showing first 3 values:")
                for match in matching[:3]:
                    print(f"    {match}")
            else:
                print(f"✗ Metric '{metric}' not found")

    except Exception as e:
        print(f"✗ Error fetching metrics: {e}")

if __name__ == "__main__":
    # Show Core metrics
    show_metrics_sample(
        "http://influxdb3-core:8181",
        "INFLUXDB3_CORE_TOKEN",
        "InfluxDB 3 Core",
        num_lines=100
    )

    print("\n\n")

    # Show Enterprise metrics
    show_metrics_sample(
        "http://influxdb3-enterprise:8181",
        "INFLUXDB3_ENTERPRISE_TOKEN",
        "InfluxDB 3 Enterprise",
        num_lines=100
    )
