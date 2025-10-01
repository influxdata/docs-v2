"""Debug test to show actual metrics output."""

import os
import requests


def test_show_actual_metrics():
    """Display actual metrics from Core instance."""

    # Get token
    token = os.environ.get("INFLUXDB3_CORE_TOKEN")
    headers = {"Authorization": f"Token {token}"} if token else {}

    # Fetch metrics
    url = "http://influxdb3-core:8181"
    response = requests.get(f"{url}/metrics", headers=headers, timeout=5)

    print(f"\n{'='*80}")
    print(f"ACTUAL METRICS FROM {url}")
    print(f"Status Code: {response.status_code}")
    print(f"Using Auth: {'Yes' if token else 'No'}")
    print(f"{'='*80}\n")

    if response.status_code == 200:
        lines = response.text.split('\n')
        print(f"Total lines: {len(lines)}\n")

        # Show first 100 lines
        print("First 100 lines of actual output:\n")
        for i, line in enumerate(lines[:100], 1):
            print(f"{i:4d} | {line}")

        # Show examples of documented metrics
        print(f"\n{'='*80}")
        print("SEARCHING FOR DOCUMENTED METRICS:")
        print(f"{'='*80}\n")

        documented_metrics = [
            "http_requests_total",
            "grpc_requests_total",
            "influxdb3_catalog_operations_total",
            "influxdb_iox_query_log_compute_duration_seconds",
            "datafusion_mem_pool_bytes",
            "object_store_op_duration_seconds",
            "jemalloc_memstats_bytes",
        ]

        for metric in documented_metrics:
            # Find TYPE and HELP lines
            type_line = next((line for line in lines if f"# TYPE {metric}" in line), None)
            help_line = next((line for line in lines if f"# HELP {metric}" in line), None)

            # Find first few data lines
            data_lines = [line for line in lines if line.startswith(metric) and not line.startswith("#")][:3]

            if type_line or help_line or data_lines:
                print(f"\n✓ {metric}:")
                if help_line:
                    print(f"  {help_line}")
                if type_line:
                    print(f"  {type_line}")
                for data in data_lines:
                    print(f"  {data}")
            else:
                print(f"\n✗ {metric}: NOT FOUND")
    else:
        print(f"ERROR: Status {response.status_code}")
        print(response.text[:500])

    # Always pass so we can see the output
    assert True
