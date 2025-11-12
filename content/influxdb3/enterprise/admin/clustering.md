---
title: Configure specialized cluster nodes
seotitle: Configure InfluxDB 3 Enterprise cluster nodes for optimal performance
description: >
  Learn how to configure specialized nodes in your InfluxDB 3 Enterprise cluster
  for ingest, query, compaction, and processing workloads with optimal thread allocation.
menu:
  influxdb3_enterprise:
    parent: Administer InfluxDB
    name: Configure specialized cluster nodes
weight: 100
related:
  - /influxdb3/enterprise/admin/performance-tuning/
  - /influxdb3/enterprise/reference/internals/runtime-architecture/
  - /influxdb3/enterprise/reference/config-options/
  - /influxdb3/enterprise/admin/query-system-data/
influxdb3/enterprise/tags: [clustering, performance, tuning, ingest, threads]
---

Optimize performance for specific workloads in your {{% product-name %}} cluster
by configuring specialized nodes in distributed deployments.
Assign specific modes and thread allocations to nodes to maximize
cluster efficiency.

- [Specialize nodes for specific workloads](#specialize-nodes-for-specific-workloads)
- [Configure node modes](#configure-node-modes)
- [Allocate threads by node type](#allocate-threads-by-node-type)
- [Configure ingest nodes](#configure-ingest-nodes)
- [Configure query nodes](#configure-query-nodes)
- [Configure compactor nodes](#configure-compactor-nodes)
- [Configure process nodes](#configure-process-nodes)
- [Multi-mode configurations](#multi-mode-configurations)
- [Cluster architecture examples](#cluster-architecture-examples)
- [Scale your cluster](#scale-your-cluster)
- [Monitor performance](#monitor-performance)
- [Troubleshoot node configurations](#troubleshoot-node-configurations)
- [Best practices](#best-practices)
- [Migrate to specialized nodes](#migrate-to-specialized-nodes)
- [Manage configurations](#manage-configurations)

## Specialize nodes for specific workloads

In an {{% product-name %}} cluster, you can dedicate nodes to specific tasks:

- **Ingest nodes**: Optimized for high-throughput data ingestion
- **Query nodes**: Maximized for complex analytical queries
- **Compactor nodes**: Dedicated to data compaction and optimization
- **Process nodes**: Focused on data processing and transformations
- **All-in-one nodes**: Balanced for mixed workloads

## Configure node modes

Pass the `--mode` parameter when starting the node to specify its capabilities:

```bash
# Single mode
influxdb3 serve --mode=ingest

# Multiple modes
influxdb3 serve --mode=ingest,query

# All modes (default)
influxdb3 serve --mode=all
```

Available modes:

- `all`: All capabilities enabled (default)
- `ingest`: Data ingestion and line protocol parsing
- `query`: Query execution and data retrieval
- `compact`: Background compaction and optimization
- `process`: Data processing and transformations

## Allocate threads by node type

### Critical concept: Thread pools

Every node has two thread pools that must be properly configured:

1. **IO threads**: Parse line protocol, handle HTTP requests
2. **DataFusion threads**: Execute queries, create data snapshots (convert [WAL data](/influxdb3/enterprise/reference/internals/durability/#write-ahead-log-wal) to Parquet files), perform compaction

> [!Note]
> Even specialized nodes need both thread types. Ingest nodes use DataFusion threads
> for creating data snapshots that convert [WAL data](/influxdb3/enterprise/reference/internals/durability/#write-ahead-log-wal) to Parquet files, and query nodes use IO threads for handling requests.

## Configure ingest nodes

Ingest nodes handle high-volume data writes and require significant IO thread allocation
for line protocol parsing.

### Example medium ingester (32 cores)

```bash
influxdb3 \
  --num-io-threads=12 \
  serve \
  --num-cores=32 \
  --datafusion-num-threads=20 \
  --exec-mem-pool-bytes=60% \
  --mode=ingest \
  --node-id=ingester-01
```

**Configuration rationale:**

- **12 IO threads**: Handle multiple concurrent writers (Telegraf agents, applications)
- **20 DataFusion threads**: Required for data snapshot operations that convert buffered writes to Parquet files
- **60% memory pool**: Balance between write buffers and data snapshot operations

### Monitor ingest performance

Key metrics for ingest nodes:

```bash
# Monitor IO thread utilization
top -H -p $(pgrep influxdb3) | grep io_worker

# Check write request counts by endpoint
curl -s http://localhost:8181/metrics | grep 'http_requests_total.*write'

# Check overall HTTP request metrics
curl -s http://localhost:8181/metrics | grep 'http_requests_total'

# Monitor WAL size
du -sh /path/to/data/wal/
```

> [!Important]
>
> #### Scale IO threads with concurrent writers
>
> If you see only 2 CPU cores at 100% on a large ingester, increase
> `--num-io-threads`.
> Each concurrent writer can utilize approximately one IO thread.

## Configure query nodes

Query nodes execute complex analytical queries and need maximum DataFusion threads.

### Analytical query node (64 cores)

<!-- DEV-ONLY FLAGS: DO NOT DOCUMENT --datafusion-runtime-type IN PRODUCTION DOCS
     This flag will be removed in future versions.
     Only multi-thread mode should be used (which is the default).
     The current-thread option is deprecated and will be removed.
     Future editors: Keep this commented out or remove the flag entirely. -->

```bash
influxdb3 \
  --num-io-threads=4 \
  serve \
  --num-cores=64 \
  --datafusion-num-threads=60 \
  --exec-mem-pool-bytes=90% \
  --parquet-mem-cache-size=8GB \
  --mode=query \
  --node-id=query-01 \
  --cluster-id=prod-cluster
```

**Configuration rationale:**

- **4 IO threads**: Minimal, just for HTTP request handling
- **60 DataFusion threads**: Maximum parallelism for query execution
- **90% memory pool**: Maximize memory for complex aggregations
- **8&nbsp;GB Parquet cache**: Keep frequently accessed data in memory

### Real-time query node (32 cores)

```bash
influxdb3 \
  --num-io-threads=6 \
  serve \
  --num-cores=32 \
  --datafusion-num-threads=26 \
  --exec-mem-pool-bytes=80% \
  --parquet-mem-cache-size=4GB \
  --mode=query \
  --node-id=query-02
```

### Optimize query settings

You can configure `datafusion` properties for additional tuning of query nodes:

```bash
influxdb3 serve \
  --datafusion-config "datafusion.execution.batch_size:16384,datafusion.execution.target_partitions:60" \
  --mode=query
```

## Configure compactor nodes

Compactor nodes optimize stored data through background compaction processes.

### Dedicated compactor (32 cores)

```bash
influxdb3 \
  --num-io-threads=2 \
  serve \
  --num-cores=32 \
  --datafusion-num-threads=30 \
  --compaction-gen2-duration=24h \
  --compaction-check-interval=5m \
  --mode=compact \
  --node-id=compactor-01 \
  --cluster-id=prod-cluster

# Note: --compaction-row-limit option is not yet released in v3.5.0
# Uncomment when available in a future release:
# --compaction-row-limit=2000000 \
```

**Configuration rationale:**

- **2 IO threads**: Minimal, compaction is DataFusion-intensive
- **30 DataFusion threads**: Maximum threads for sort/merge operations
- **24h gen2 duration**: Time-based compaction strategy

### Tune compaction parameters

You can adjust compaction strategies to balance performance and resource usage:

```bash
# Configure compaction strategy
--compaction-multipliers=4,8,16 \
--compaction-max-num-files-per-plan=100 \
--compaction-cleanup-wait=10m
```

## Configure process nodes

Process nodes handle data transformations and processing plugins.

### Processing node (16 cores)

```bash
influxdb3 \
  --num-io-threads=4 \
  serve \
  --num-cores=16 \
  --datafusion-num-threads=12 \
  --plugin-dir=/path/to/plugins \
  --mode=process \
  --node-id=processor-01 \
  --cluster-id=prod-cluster
```

## Multi-mode configurations

Some deployments benefit from nodes handling multiple responsibilities.

### Ingest + Query node (48 cores)

```bash
influxdb3 \
  --num-io-threads=12 \
  serve \
  --num-cores=48 \
  --datafusion-num-threads=36 \
  --exec-mem-pool-bytes=75% \
  --mode=ingest,query \
  --node-id=hybrid-01
```

### Query + Compact node (32 cores)

```bash
influxdb3 \
  --num-io-threads=4 \
  serve \
  --num-cores=32 \
  --datafusion-num-threads=28 \
  --mode=query,compact \
  --node-id=qc-01
```

## Cluster architecture examples

### Small cluster (3 nodes)

```yaml
# Node 1: All-in-one primary
mode: all
cores: 32
io_threads: 8
datafusion_threads: 24

# Node 2: All-in-one secondary
mode: all
cores: 32
io_threads: 8
datafusion_threads: 24

# Node 3: All-in-one tertiary
mode: all
cores: 32
io_threads: 8
datafusion_threads: 24
```

### Medium cluster (6 nodes)

```yaml
# Nodes 1-2: Ingesters
mode: ingest
cores: 48
io_threads: 16
datafusion_threads: 32

# Nodes 3-4: Query nodes
mode: query
cores: 48
io_threads: 4
datafusion_threads: 44

# Nodes 5-6: Compactor + Process
mode: compact,process
cores: 32
io_threads: 4
datafusion_threads: 28
```

### Large cluster (12+ nodes)

```yaml
# Nodes 1-4: High-throughput ingesters
mode: ingest
cores: 96
io_threads: 20
datafusion_threads: 76

# Nodes 5-8: Query nodes
mode: query
cores: 64
io_threads: 4
datafusion_threads: 60

# Nodes 9-10: Dedicated compactors
mode: compact
cores: 32
io_threads: 2
datafusion_threads: 30

# Nodes 11-12: Process nodes
mode: process
cores: 32
io_threads: 6
datafusion_threads: 26
```

## Scale your cluster

### Vertical scaling limitations

{{< product-name >}} uses a shared-nothing architecture where ingest nodes handle all writes. To maximize ingest performance:

- **Scale IO threads with concurrent writers**: Each concurrent writer can utilize approximately one IO thread for line protocol parsing
- **Use high-core machines**: Line protocol parsing is CPU-intensive and benefits from more cores
- **Deploy multiple ingest nodes**: Run several ingest nodes behind a load balancer to distribute write load
- **Optimize batch sizes**: Configure clients to send larger batches to reduce per-request overhead

### Scale queries horizontally

Query nodes can scale horizontally since they all access the same object store:

```bash
# Add query nodes as needed
for i in {1..10}; do
  influxdb3 \
    --num-io-threads=4 \
    serve \
    --num-cores=32 \
    --datafusion-num-threads=28 \
    --mode=query \
    --node-id=query-$i &
done
```

## Monitor performance

### Node-specific metrics

Monitor specialized nodes differently based on their role:

#### Ingest nodes

```sql
-- Monitor write activity through parquet file creation
SELECT
  table_name,
  count(*) as files_created,
  sum(row_count) as total_rows,
  sum(size_bytes) as total_bytes
FROM system.parquet_files
WHERE max_time > extract(epoch from now() - INTERVAL '5 minutes') * 1000000000
GROUP BY table_name;
```

#### Query nodes

```sql
-- Monitor query performance
SELECT
  count(*) as query_count,
  avg(execute_duration) as avg_execute_time,
  max(max_memory) as max_memory_bytes
FROM system.queries
WHERE issue_time > now() - INTERVAL '5 minutes'
  AND success = true;
```

#### Compactor nodes

```sql
-- Monitor compaction progress
SELECT
  event_type,
  event_status,
  count(*) as event_count,
  avg(event_duration) as avg_duration
FROM system.compaction_events
WHERE event_time > now() - INTERVAL '1 hour'
GROUP BY event_type, event_status
ORDER BY event_count DESC;
```

### Monitor cluster-wide metrics

```bash
# Check node health via HTTP endpoints
for node in ingester-01:8181 query-01:8181 compactor-01:8181; do
  echo "Node: $node"
  curl -s "http://$node/health"
done

# Monitor metrics from each node
for node in ingester-01:8181 query-01:8181 compactor-01:8181; do
  echo "=== Metrics from $node ==="
  curl -s "http://$node/metrics" | grep -E "(cpu_usage|memory_usage|http_requests_total)"
done

# Query system tables for cluster-wide monitoring
curl -X POST "http://query-01:8181/api/v3/query_sql" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "q": "SELECT * FROM system.queries WHERE issue_time > now() - INTERVAL '\''5 minutes'\'' ORDER BY issue_time DESC LIMIT 10",
    "db": "sensors"
  }'
```

> [!Tip]
>
> ### Extend monitoring with plugins
>
> Enhance your cluster monitoring capabilities using the InfluxDB 3 processing engine. The [InfluxDB 3 plugins library](https://github.com/influxdata/influxdb3_plugins) includes several monitoring and alerting plugins:
>
> - **System metrics collection**: Collect CPU, memory, disk, and network statistics
> - **Threshold monitoring**: Monitor metrics with configurable thresholds and alerting
> - **Multi-channel notifications**: Send alerts via Slack, Discord, SMS, WhatsApp, and webhooks
> - **Anomaly detection**: Identify unusual patterns in your data
> - **Deadman checks**: Detect missing data streams
>
> For complete plugin documentation and setup instructions, see [Process data in InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/process/).

### Monitor and respond to performance issues

Use the [monitoring queries](#monitor-cluster-wide-metrics) to identify the following patterns and their solutions:

#### High CPU with low throughput (Ingest nodes)

**Detection query:**

```sql
-- Check for high failed query rate indicating parsing issues
SELECT
  count(*) as total_queries,
  sum(CASE WHEN success = true THEN 1 ELSE 0 END) as successful_queries,
  sum(CASE WHEN success = false THEN 1 ELSE 0 END) as failed_queries
FROM system.queries
WHERE issue_time > now() - INTERVAL '5 minutes';
```

**Symptoms:**

- Only 2 CPU cores at 100% on large machines
- High write latency despite available resources
- Failed queries due to parsing timeouts

**Solution:** Increase IO threads (see [Ingest node issues](#ingest-node-issues))

#### Memory pressure alerts (Query nodes)

**Detection query:**

```sql
-- Monitor queries with high memory usage or failures
SELECT
  avg(max_memory) as avg_memory_bytes,
  max(max_memory) as peak_memory_bytes,
  sum(CASE WHEN success = false THEN 1 ELSE 0 END) as failed_queries
FROM system.queries
WHERE issue_time > now() - INTERVAL '5 minutes'
  AND query_type = 'sql';
```

**Symptoms:**

- Queries failing with out-of-memory errors
- High memory usage approaching pool limits
- Slow query execution times

**Solution:** Increase memory pool or optimize queries (see [Query node issues](#query-node-issues))

#### Compaction falling behind (Compactor nodes)

**Detection query:**

```sql
-- Check compaction event frequency and success rate
SELECT
  event_type,
  count(*) as event_count,
  sum(CASE WHEN event_status = 'success' THEN 1 ELSE 0 END) as successful_events
FROM system.compaction_events
WHERE event_time > now() - INTERVAL '1 hour'
GROUP BY event_type;
```

**Symptoms:**

- Decreasing compaction event frequency
- Growing number of small Parquet files
- Increasing query times due to file fragmentation

**Solution:** Add compactor nodes or increase DataFusion threads (see [Compactor node issues](#compactor-node-issues))

## Troubleshoot node configurations

### Ingest node issues

**Problem**: Low throughput despite available CPU

```bash
# Check: Are only 2 cores busy?
top -H -p $(pgrep influxdb3)

# Solution: Increase IO threads
--num-io-threads=16
```

**Problem**: Data snapshot creation affecting ingest

```bash
# Check: DataFusion threads at 100% during data snapshots to Parquet
# Solution: Reserve more DataFusion threads for snapshot operations
--datafusion-num-threads=40
```

### Query node issues

**Problem**: Slow queries despite resources

```bash
# Check: Memory pressure
free -h

# Solution: Increase memory pool
--exec-mem-pool-bytes=90%
```

**Problem**: Poor cache hit rates

```bash
# Solution: Increase Parquet cache
--parquet-mem-cache-size=10GB
```

### Compactor node issues

**Problem**: Compaction falling behind

```bash
# Check: Compaction queue length
# Solution: Add more compactor nodes or increase threads
--datafusion-num-threads=30
```

## Best practices

1. **Start with monitoring**: Understand bottlenecks before specializing nodes
2. **Test mode combinations**: Some workloads benefit from multi-mode nodes
3. **Plan for failure**: Ensure redundancy in critical node types
4. **Document your topology**: Keep clear records of node configurations
5. **Regular rebalancing**: Adjust thread allocation as workloads evolve
6. **Capacity planning**: Monitor trends and scale proactively

## Migrate to specialized nodes

### From all-in-one to specialized

```bash
# Phase 1: Baseline (all nodes identical)
all nodes: --mode=all --num-io-threads=8

# Phase 2: Identify workload patterns
# Monitor which nodes handle most writes vs queries

# Phase 3: Gradual specialization
node1: --mode=ingest,query --num-io-threads=12
node2: --mode=query,compact --num-io-threads=4

# Phase 4: Full specialization
node1: --mode=ingest --num-io-threads=16
node2: --mode=query --num-io-threads=4
node3: --mode=compact --num-io-threads=2
```

## Manage configurations

<!--
### Use configuration files

Create node-specific configuration files:

```toml
# ingester.toml
node-id = "ingester-01"
cluster-id = "prod"
mode = "ingest"
num-cores = 96
num-io-threads = 20
datafusion-num-threads = 76

# query.toml
node-id = "query-01"
cluster-id = "prod"
mode = "query"
num-cores = 64
num-io-threads = 4
datafusion-num-threads = 60
```

Launch with configuration:
```bash
influxdb3 serve --config ingester.toml
```
-->

### Configure using environment variables

```bash
# Set environment variables for node type
export INFLUXDB3_ENTERPRISE_MODE=ingest
export INFLUXDB3_NUM_IO_THREADS=20
export INFLUXDB3_DATAFUSION_NUM_THREADS=76

influxdb3 serve --node-id=$HOSTNAME --cluster-id=prod
```
