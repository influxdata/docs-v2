Use InfluxDB metrics to monitor {{% show-in "enterprise" %}}distributed cluster {{% /show-in %}}system performance, resource usage, and operational health
with monitoring tools like Prometheus, Grafana, or other observability platforms.

## Access metrics

An {{< product-name >}} node exposes metrics at the `/metrics` endpoint on the HTTP port (default: 8181).

{{% api-endpoint method="GET" endpoint="http://localhost:8181/metrics" api-ref="/influxdb3/version/api/v3/#operation/GetMetrics"%}}

{{% show-in "core" %}}
### View metrics

```bash
# View all metrics
curl -s http://{{< influxdb/host >}}/metrics

# View specific metric patterns
curl -s http://{{< influxdb/host >}}/metrics | grep 'http_requests_total'
curl -s http://{{< influxdb/host >}}/metrics | grep 'influxdb3_'

# View metrics with authentication (if required)
curl -s -H "Authorization: Token AUTH_TOKEN" http://node:8181/metrics
```
{{% /show-in %}}

{{% show-in "enterprise" %}}
### View metrics from specific nodes

> [!Note]
> {{< product-name >}} supports two token types for the `/metrics` endpoint:
> - {{% token-link "Admin" %}}: Full access to all metrics
> - {{% token-link "Fine-grained" "resource/" %}} with `system:metrics:read` permission: Read-only access to metrics

```bash { placeholders="AUTH_TOKEN" }
# View metrics from specific nodes
curl -s http://ingester-01:8181/metrics
curl -s http://query-01:8181/metrics
curl -s http://compactor-01:8181/metrics

# View metrics with authentication (if required)
curl -s -H "Authorization: Token AUTH_TOKEN" http://node:8181/metrics
```
{{% /show-in %}}

Replace {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}} with your {{< product-name >}} {{% token-link %}} that has read access to the `/metrics` endpoint.

{{% show-in "enterprise" %}}
### Aggregate metrics across cluster

```bash
# Get metrics from all nodes in cluster
for node in ingester-01 query-01 compactor-01; do
  echo "=== Node: $node ==="
  curl -s http://$node:8181/metrics | grep 'http_requests_total.*status="ok"'
done
```
{{% /show-in %}}

### Metrics format

Metrics are exposed in [Prometheus exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/#text-based-format):

```
# HELP metric_name Description of the metric
# TYPE metric_name counter|gauge|histogram
metric_name{label1="value1",label2="value2"} 42.0
```

### Node identification in metrics

{{< product-name >}} metrics don't include automatic node identification labels.
To identify which node produced each metric, you must configure your monitoring tool to add node labels during scraping.

{{% show-in "enterprise" %}}
For multi-node clusters, node identification is essential for troubleshooting and monitoring individual node performance.
Many monitoring tools support adding static or dynamic labels during the scrape process (Prometheus calls this "relabeling")--for example:

1. **Extract node hostname or IP** from the scrape target address
2. **Add extracted labels to metrics** during the scrape process 

| Hostname                   | Node Identification | Recommended?      |
| -------------------------- | ------------------- | ----------------- |
| `ingester-01`, `query-02`  | Extract role and ID | Yes             |
| `node-01.cluster.internal` | Extract ID          | Consider adding role information |
| `192.168.1.10`             | IP address only     | No, consider renaming with ID and role |

For configuration examples, see [Add node identification with Prometheus](#add-node-identification-with-prometheus).
{{% /show-in %}}

## Metric categories

{{< product-name >}} exposes the following{{% show-in "enterprise" %}} base{{% /show-in %}} categories of metrics{{% show-in "enterprise" %}}, plus additional cluster-aware metrics{{% /show-in %}}:

{{% show-in "enterprise" %}}
> [!Note]
> #### Metrics reporting across node modes
> All nodes in an {{< product-name >}} cluster report the same set of metrics regardless of their configured [mode](/influxdb3/enterprise/reference/config-options/#mode) (ingest, query, compact, process, or all).
> The difference between nodes is in the metric _values_ and labels, which reflect the actual activity on each node.
> For example, an ingest-only node reports query-related metrics with minimal or zero values.
{{% /show-in %}}

### HTTP and gRPC metrics

Monitor API request patterns{{% show-in "enterprise" %}} across the cluster{{% /show-in %}}:

- **`http_requests_total`**: Total HTTP requests by method, path, and status{{% show-in "enterprise" %}} per node{{% /show-in %}}
- **`http_request_duration_seconds`**: HTTP request latency distribution{{% show-in "enterprise" %}} per node{{% /show-in %}}
- **`http_response_body_size_bytes`**: HTTP response size distribution
- **`grpc_requests_total`**: Total gRPC requests{{% show-in "enterprise" %}} for inter-node communication{{% /show-in %}}
- **`grpc_request_duration_seconds`**: gRPC request latency distribution

### Database operations

Monitor database{{% show-in "enterprise" %}}-specific and distributed cluster{{% /show-in %}} operations:

- **`influxdb3_catalog_operations_total`**: Catalog operations by type (create_database, create_admin_token, etc.){{% show-in "enterprise" %}} across the cluster{{% /show-in %}}
- **`influxdb3_catalog_operation_retries_total`**: Failed catalog operations that required retries{{% show-in "enterprise" %}} due to conflicts between nodes{{% /show-in %}}

{{% show-in "enterprise" %}}
### Node specialization metrics

Different metrics are more relevant depending on node [mode configuration](/influxdb3/version/admin/clustering/#configure-node-modes):

#### Ingest nodes (mode: ingest)
- **`http_requests_total{path="/api/v3/write"}`**: Write request volume
- **`object_store_transfer_bytes_total`**: WAL-to-Parquet snapshot activity
- **`datafusion_mem_pool_bytes`**: Memory usage for snapshot operations

#### Query nodes (mode: query)
- **`influxdb_iox_query_log_*`**: Query execution performance
- **`influxdb3_parquet_cache_*`**: Cache performance for query acceleration
- **`http_requests_total{path~"/api/v3/query.*"}`**: Query request patterns

#### Compactor nodes (mode: compact)
- **`object_store_op_duration_seconds`**: Compaction operation performance
- **`object_store_transfer_*`**: File consolidation activity

#### Process nodes (mode: process)
- **`tokio_runtime_*`**: Plugin execution runtime metrics
- Custom plugin metrics (varies by installed plugins)
{{% /show-in %}}

### Memory and caching

Monitor memory usage{{% show-in "enterprise" %}} across specialized nodes{{% /show-in %}}:

- **`datafusion_mem_pool_bytes`**: DataFusion memory pool{{% show-in "enterprise" %}} per node{{% /show-in %}}
- **`influxdb3_parquet_cache_access_total`**: Parquet cache hits, misses, and fetch status{{% show-in "enterprise" %}} per query node{{% /show-in %}}
- **`influxdb3_parquet_cache_size_bytes`**: Current size of in-memory Parquet cache{{% show-in "enterprise" %}} per query node{{% /show-in %}}
- **`influxdb3_parquet_cache_size_number_of_files`**: Number of files in Parquet cache{{% show-in "enterprise" %}} per query node{{% /show-in %}}
- **`jemalloc_memstats_bytes`**: Memory allocation statistics{{% show-in "enterprise" %}} per node{{% /show-in %}}

### Query performance

Monitor{{% show-in "enterprise" %}} distributed{{% /show-in %}} query execution{{% show-in "enterprise" %}} and performance{{% /show-in %}}:

- **`influxdb_iox_query_log_*`**: Comprehensive query execution metrics including:
  - `compute_duration_seconds`: CPU time spent on computation
  - `execute_duration_seconds`: Total query execution time
  - `plan_duration_seconds`: Time spent planning queries
  - `end2end_duration_seconds`: Complete query duration from request to response
  - `max_memory`: Peak memory usage per query
  - `parquet_files`: Number of Parquet files accessed
  - `partitions`: Number of partitions processed

{{% show-in "enterprise" %}}
- **`influxdb_iox_query_log_ingester_latency_*`**: Inter-node query coordination latency
- **`influxdb_iox_query_log_ingester_partition_count`**: Data distribution across nodes
- **`influxdb_iox_query_log_parquet_files`**: File access patterns per query
{{% /show-in %}}

### Object storage

Monitor{{% show-in "enterprise" %}} shared{{% /show-in %}} object store operations and performance:

- **`object_store_op_duration_seconds`**: Object store operation latency{{% show-in "enterprise" %}} per node{{% /show-in %}}
- **`object_store_transfer_bytes_total`**: Cumulative bytes transferred{{% show-in "enterprise" %}} per node{{% /show-in %}}
- **`object_store_transfer_objects_total`**: Cumulative objects transferred{{% show-in "enterprise" %}} per node{{% /show-in %}}

### Runtime and system

Monitor runtime health and resource usage:

- **`process_start_time_seconds`**: Process start time
- **`thread_panic_count_total`**: Thread panic occurrences
- **`query_datafusion_query_execution_ooms_total`**: Out-of-memory events in query engine
- **`tokio_runtime_*`**: Async runtime metrics (task scheduling, worker threads, queue depths)

{{% show-in "enterprise" %}}
## Cluster-specific metrics

### Node coordination

Monitor how nodes work together:

```bash
# Check ingester response coordination
curl -s http://query-node:8181/metrics | grep 'influxdb_iox_query_log_ingester_latency'

# Monitor catalog operation conflicts
curl -s http://any-node:8181/metrics | grep 'influxdb3_catalog_operation_retries_total'
```

### Load distribution

Monitor workload distribution across nodes:

```bash
# Write load across ingest nodes
for node in ingester-01 ingester-02; do
  echo "Node $node:"
  curl -s http://$node:8181/metrics | grep 'http_requests_total.*v3/write.*status="ok"'
done

# Query load across query nodes
for node in query-01 query-02; do
  echo "Node $node:"
  curl -s http://$node:8181/metrics | grep 'influxdb_iox_query_log_execute_duration_seconds_count'
done
```

## Node-specific monitoring

### Monitor ingest node health

Monitor data ingestion performance:

```bash
# Ingest throughput
curl -s http://ingester-01:8181/metrics | grep 'http_requests_total.*v3/write'

# Snapshot creation activity
curl -s http://ingester-01:8181/metrics | grep 'object_store_transfer_bytes_total.*put'

# Memory pressure
curl -s http://ingester-01:8181/metrics | grep 'datafusion_mem_pool_bytes'
```

### Monitor query node performance

Monitor query execution:

```bash
# Query latency
curl -s http://query-01:8181/metrics | grep 'influxdb_iox_query_log_execute_duration_seconds'

# Cache effectiveness
curl -s http://query-01:8181/metrics | grep 'influxdb3_parquet_cache_access_total'

# Inter-node coordination time
curl -s http://query-01:8181/metrics | grep 'influxdb_iox_query_log_ingester_latency'
```

### Monitor compactor node activity

Monitor data optimization:

```bash
# Compaction operations
curl -s http://compactor-01:8181/metrics | grep 'object_store_op_duration_seconds.*put'

# File processing volume
curl -s http://compactor-01:8181/metrics | grep 'object_store_transfer_objects_total'
```
{{% /show-in %}}

{{% show-in "core" %}}
## Key metrics for monitoring

### Write throughput

Monitor data ingestion:

```bash
# HTTP requests to write endpoints
curl -s http://localhost:8181/metrics | grep 'http_requests_total.*v3/write\|http_requests_total.*v2/write'

# Object store writes (Parquet file creation)
curl -s http://localhost:8181/metrics | grep 'object_store_transfer.*total.*put'
```

### Query performance

Monitor query execution:

```bash
# Query latency percentiles
curl -s http://localhost:8181/metrics | grep 'influxdb_iox_query_log_execute_duration_seconds'

# Query memory usage
curl -s http://localhost:8181/metrics | grep 'influxdb_iox_query_log_max_memory'

# Query errors and failures
curl -s http://localhost:8181/metrics | grep 'http_requests_total.*status="server_error"'
```

### Resource utilization

Monitor system resources:

```bash
# Memory pool usage
curl -s http://localhost:8181/metrics | grep 'datafusion_mem_pool_bytes'

# Cache efficiency
curl -s http://localhost:8181/metrics | grep 'influxdb3_parquet_cache_access_total'

# Runtime task health
curl -s http://localhost:8181/metrics | grep 'tokio_runtime_num_alive_tasks'
```

### Error rates

Monitor system health:

```bash
# HTTP error rates
curl -s http://localhost:8181/metrics | grep 'http_requests_total.*status="client_error"\|http_requests_total.*status="server_error"'

# Thread panics
curl -s http://localhost:8181/metrics | grep 'thread_panic_count_total'

# Query OOMs
curl -s http://localhost:8181/metrics | grep 'query_datafusion_query_execution_ooms_total'
```
{{% /show-in %}}

## Example monitoring queries

### Prometheus queries{{% show-in "enterprise" %}} for clusters{{% /show-in %}}

Use these queries in Prometheus or Grafana dashboards:

{{% show-in "enterprise" %}}
#### Cluster-wide request rate

```promql
# Total requests per second across all nodes
sum(rate(http_requests_total[5m])) by (instance)

# Write requests per second by ingest node
sum(rate(http_requests_total{path="/api/v3/write"}[5m])) by (instance)
```

#### Query performance across nodes

```promql
# 95th percentile query latency by query node
histogram_quantile(0.95,
  sum(rate(influxdb_iox_query_log_execute_duration_seconds_bucket[5m])) by (instance, le)
)

# Average inter-node coordination time
avg(rate(influxdb_iox_query_log_ingester_latency_to_full_data_seconds_sum[5m]) /
    rate(influxdb_iox_query_log_ingester_latency_to_full_data_seconds_count[5m])) by (instance)
```

#### Load balancing effectiveness

```promql
# Request distribution balance (coefficient of variation)
stddev(sum(rate(http_requests_total[5m])) by (instance)) /
avg(sum(rate(http_requests_total[5m])) by (instance))

# Cache hit rate by query node
sum(rate(influxdb3_parquet_cache_access_total{status="cached"}[5m])) by (instance) /
sum(rate(influxdb3_parquet_cache_access_total[5m])) by (instance)
```

#### Cluster health indicators

```promql
# Node availability (any recent metrics)
up{job="influxdb3-enterprise"}

# Catalog operation conflicts
rate(influxdb3_catalog_operation_retries_total[5m])

# Cross-node error rates
sum(rate(http_requests_total{status=~"server_error|client_error"}[5m])) by (instance, status)
```
{{% /show-in %}}

{{% show-in "core" %}}
#### Request rate

```promql
# Requests per second
rate(http_requests_total[5m])

# Error rate percentage
rate(http_requests_total{status=~"client_error|server_error"}[5m]) / rate(http_requests_total[5m]) * 100
```

#### Query performance

```promql
# 95th percentile query latency
histogram_quantile(0.95, rate(influxdb_iox_query_log_execute_duration_seconds_bucket[5m]))

# Average query memory usage
rate(influxdb_iox_query_log_max_memory_sum[5m]) / rate(influxdb_iox_query_log_max_memory_count[5m])
```

#### Cache performance

```promql
# Cache hit rate
rate(influxdb3_parquet_cache_access_total{status="cached"}[5m]) / rate(influxdb3_parquet_cache_access_total[5m]) * 100

# Cache size in MB
influxdb3_parquet_cache_size_bytes / 1024 / 1024
```

#### Object store throughput

```promql
# Bytes per second to object store
rate(object_store_transfer_bytes_total[5m])

# Objects per second to object store
rate(object_store_transfer_objects_total[5m])
```
{{% /show-in %}}

{{% show-in "enterprise" %}}
## Distributed monitoring setup

### Collect metrics with Telegraf

Use Telegraf to collect metrics from all cluster nodes and store them in a separate {{< product-name >}} instance for centralized monitoring.

#### Configure Telegraf

Create a Telegraf configuration file (`telegraf.conf`) to scrape metrics from your cluster nodes:

```toml { placeholders="MONITORING_AUTH_TOKEN|INGESTER_AUTH_TOKEN|QUERY_AUTH_TOKEN|COMPACTOR_AUTH_TOKEN" }
# Telegraf configuration for InfluxDB 3 Enterprise monitoring

# Output to monitoring InfluxDB instance
[[outputs.influxdb_v2]]
  urls = ["http://monitoring-influxdb:8181"]
  token = "MONITORING_AUTH_TOKEN"
  organization = ""
  bucket = "monitoring"

# Scrape metrics from ingest nodes
[[inputs.prometheus]]
  urls = [
    "http://ingester-01:8181/metrics",
    "http://ingester-02:8181/metrics"
  ]
  metric_version = 2

  # Authentication for metrics endpoint
  [inputs.prometheus.headers]
    Authorization = "Token INGESTER_AUTH_TOKEN"

  [inputs.prometheus.tags]
    cluster = "production"

# Scrape metrics from query nodes
[[inputs.prometheus]]
  urls = [
    "http://query-01:8181/metrics",
    "http://query-02:8181/metrics"
  ]
  metric_version = 2

  [inputs.prometheus.headers]
    Authorization = "Token QUERY_AUTH_TOKEN"

  [inputs.prometheus.tags]
    cluster = "production"

# Scrape metrics from compactor nodes
[[inputs.prometheus]]
  urls = ["http://compactor-01:8181/metrics"]
  metric_version = 2

  [inputs.prometheus.headers]
    Authorization = "Token COMPACTOR_AUTH_TOKEN"

  [inputs.prometheus.tags]
    cluster = "production"

# Extract node name and role from URL
[[processors.regex]]
  namepass = ["*"]

  [[processors.regex.tags]]
    key = "url"
    pattern = "^http://([^:]+):.*"
    replacement = "${1}"
    result_key = "node_name"

  [[processors.regex.tags]]
    key = "node_name"
    pattern = "^(ingester|query|compactor|processor)-.*"
    replacement = "${1}"
    result_key = "node_role"
```

Replace the following:

- {{% code-placeholder-key %}}`MONITORING_AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link %}} for the monitoring InfluxDB instance
- {{% code-placeholder-key %}}`INGESTER_AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link %}} with `system:metrics:read` permission for the ingest nodes
- {{% code-placeholder-key %}}`QUERY_AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link %}} with `system:metrics:read` permission for the query nodes
- {{% code-placeholder-key %}}`COMPACTOR_AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link %}} with `system:metrics:read` permission for the compactor node

#### Start Telegraf

```bash
# Start Telegraf with the configuration
telegraf --config telegraf.conf

# Run as a service (systemd example)
sudo systemctl start telegraf
sudo systemctl enable telegraf
```

#### Query collected metrics

Query the monitoring database using SQL:

```sql
-- Request rate by node
SELECT
  node_name,
  node_role,
  COUNT(*) as request_count
FROM http_requests_total
WHERE time >= now() - INTERVAL '5 minutes'
GROUP BY node_name, node_role
ORDER BY request_count DESC;

-- Query latency percentiles by node
SELECT
  node_name,
  APPROX_PERCENTILE_CONT(value, 0.95) as p95_latency_seconds
FROM http_request_duration_seconds
WHERE time >= now() - INTERVAL '1 hour'
GROUP BY node_name;
```

<!--TODO - Add example Grafana dashboards
### Grafana dashboards

Create role-specific dashboards with the following suggested metrics for each dashboard:

#### Cluster Overview Dashboard
- Node status and availability
- Request rates across all nodes
- Error rates by node and operation type
- Resource utilization summary

#### Ingest Performance Dashboard
- Write throughput by ingest node
- Snapshot creation rates
- Memory usage and pressure
- WAL-to-Parquet conversion metrics

#### Query Performance Dashboard
- Query latency percentiles by query node
- Cache hit rates and efficiency
- Inter-node coordination times
- Memory usage during query execution

#### Operations Dashboard
- Compaction progress and performance
- Object store operation success rates
- Processing engine trigger rates
- System health indicators

-->

<!--TODO - Use the processing engine for alerting

### Alerting for clusters

Set up cluster-aware alerting rules:

```yaml
# Sample Prometheus alerting rules
groups:
  - name: influxdb3_enterprise_cluster
    rules:
      - alert: NodeDown
        expr: up{job="influxdb3-enterprise"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "InfluxDB 3 Enterprise node {{ $labels.instance }} is down"

      - alert: HighCatalogConflicts
        expr: rate(influxdb3_catalog_operation_retries_total[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High catalog operation conflicts in cluster"

      - alert: UnbalancedLoad
        expr: |
          (
            stddev(sum(rate(http_requests_total[5m])) by (instance)) /
            avg(sum(rate(http_requests_total[5m])) by (instance))
          ) > 0.5
        for: 10m
        labels:
          severity: info
        annotations:
          summary: "Unbalanced load distribution across cluster nodes"

      - alert: SlowInterNodeCommunication
        expr: |
          avg(rate(influxdb_iox_query_log_ingester_latency_to_full_data_seconds_sum[5m]) /
              rate(influxdb_iox_query_log_ingester_latency_to_full_data_seconds_count[5m])) > 1.0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow inter-node communication detected"
```
-->

### Add node identification with Prometheus

If using Prometheus instead of Telegraf, add node identification through _relabeling_:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'influxdb3-enterprise'
    static_configs:
      - targets:
          - 'ingester-01:8181'
          - 'query-01:8181'
    relabel_configs:
      # Extract node name from address
      - source_labels: [__address__]
        target_label: node_name
        regex: '([^:]+):.*'
        replacement: '${1}'

      # Assign node role based on hostname pattern
      - source_labels: [node_name]
        target_label: node_role
        regex: 'ingester-.*'
        replacement: 'ingest'
      - source_labels: [node_name]
        target_label: node_role
        regex: 'query-.*'
        replacement: 'query'
      - source_labels: [node_name]
        target_label: node_role
        regex: 'compactor-.*'
        replacement: 'compact'
```
{{% /show-in %}}

{{% show-in "core" %}}
## Integration with monitoring tools

### Collect metrics with Telegraf

Use Telegraf to collect metrics and store them in a separate {{< product-name >}} instance for monitoring.

#### Configure Telegraf

Create a Telegraf configuration file (`telegraf.conf`):

```toml { placeholders="MONITORING_AUTH_TOKEN|AUTH_TOKEN" }
# Telegraf configuration for InfluxDB 3 Core monitoring

# Output to monitoring InfluxDB instance
[[outputs.influxdb_v2]]
  urls = ["http://monitoring-influxdb:8181"]
  token = "MONITORING_AUTH_TOKEN"
  organization = ""
  bucket = "monitoring"

# Scrape metrics from InfluxDB 3 Core
[[inputs.prometheus]]
  urls = ["http://localhost:8181/metrics"]
  metric_version = 2

  # Authentication for metrics endpoint (if required)
  # [inputs.prometheus.headers]
  #   Authorization = "Token AUTH_TOKEN"
```

Replace the following:

- {{% code-placeholder-key %}}`MONITORING_AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link %}} for the monitoring InfluxDB instance
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}} (if uncommented): your {{% token-link %}} for accessing the `/metrics` endpoint

#### Start Telegraf

```bash
# Start Telegraf with the configuration
telegraf --config telegraf.conf

# Run as a service (systemd example)
sudo systemctl start telegraf
sudo systemctl enable telegraf
```

#### Query collected metrics

Query the monitoring database using SQL:

```sql
-- Request rate over time
SELECT
  date_bin(INTERVAL '5 minutes', time) as time_bucket,
  COUNT(*) as request_count
FROM http_requests_total
WHERE time >= now() - INTERVAL '1 hour'
GROUP BY time_bucket
ORDER BY time_bucket DESC;

-- Error rate
SELECT
  status,
  COUNT(*) as error_count
FROM http_requests_total
WHERE time >= now() - INTERVAL '1 hour'
  AND status IN ('client_error', 'server_error')
GROUP BY status;
```

<!--TODO - Add example Grafana dashboards
### Grafana dashboard

Create dashboards with key metrics:

1. **System Overview**: Request rates, error rates, memory usage
2. **Query Performance**: Query latency, throughput, memory per query
3. **Storage**: Object store operations, cache hit rates, file counts
4. **Runtime Health**: Task counts, worker utilization, panic rates
-->

<!--TODO - Use the processing engine for alerting
### Alerting rules

Set up alerts for critical conditions:

```yaml
# Prometheus alerting rules
groups:
  - name: influxdb3_core
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"server_error"}[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate in InfluxDB 3 Core"

      - alert: HighQueryLatency
        expr: histogram_quantile(0.95, rate(influxdb_iox_query_log_execute_duration_seconds_bucket[5m])) > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High query latency in InfluxDB 3 Core"

      - alert: LowCacheHitRate
        expr: rate(influxdb3_parquet_cache_access_total{status="cached"}[5m]) / rate(influxdb3_parquet_cache_access_total[5m]) < 0.5
        for: 10m
        labels:
          severity: info
        annotations:
          summary: "Low cache hit rate in InfluxDB 3 Core"
```
-->
{{% /show-in %}}

## Best practices

### General monitoring practices

1. **Monitor key metrics**: Focus on request rates, error rates, latency, and resource usage
2. **Set appropriate scrape intervals**: 15-30 seconds for most metrics
3. **Create meaningful alerts**: Alert on trends and thresholds that indicate real issues
4. **Use labels effectively**: Leverage metric labels for filtering and grouping
5. **Monitor long-term trends**: Track performance over time to identify patterns
6. **Correlate metrics**: Combine multiple metrics to understand system behavior

{{% show-in "enterprise" %}}
### Cluster monitoring practices

1. **Monitor each node type differently**: Focus on write metrics for ingest nodes, query metrics for query nodes
2. **Track load distribution**: Ensure work is balanced across nodes of the same type
3. **Monitor inter-node coordination**: Watch for communication delays between nodes
4. **Set up node-specific alerts**: Different thresholds for different node roles
5. **Use node labels**: Tag metrics with node roles and purposes
6. **Monitor shared resources**: Object store performance affects all nodes
7. **Track catalog conflicts**: High retry rates indicate coordination issues
8. **Regularly review dashboards and alerts**: Adjust as cluster usage patterns evolve
{{% /show-in %}}
