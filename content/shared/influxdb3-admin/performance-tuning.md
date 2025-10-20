Configure thread allocation, memory settings, and other parameters to optimize {{% product-name %}} performance
based on your workload characteristics.

- [Best practices](#best-practices)
- [General monitoring principles](#general-monitoring-principles)
- [Essential settings for performance](#essential-settings-for-performance)
- [Common performance issues](#common-performance-issues)
- [Configuration examples by workload](#configuration-examples-by-workload)
- [Thread allocation details](#thread-allocation-details)
- [Enterprise mode-specific tuning](#enterprise-mode-specific-tuning)
- [Memory tuning](#memory-tuning)
- [Advanced tuning options](#advanced-tuning-options)
- [Monitoring and validation](#monitoring-and-validation)
- [Common performance issues](#common-performance-issues-1)

## Best practices

1. **Start with monitoring**: Understand your current bottlenecks before tuning
2. **Change one parameter at a time**: Isolate the impact of each change
3. **Test with production-like workloads**: Use realistic data and query patterns
4. **Document your configuration**: Keep track of what works for your workload
5. **Plan for growth**: Leave headroom for traffic increases
6. **Regular review**: Periodically reassess as workloads evolve

## General monitoring principles

Before tuning performance, establish baseline metrics to identify bottlenecks:

### Key metrics to monitor

1. **CPU usage per core**
   - Monitor individual core utilization to identify thread pool imbalances
   - Watch for cores at 100% while others are idle (indicates thread allocation issues)
   - Use `top -H` or `htop` to view per-thread CPU usage

2. **Memory consumption**
   - Track heap usage vs available RAM
   - Monitor query execution memory pool utilization
   - Watch for OOM errors or excessive swapping

3. **IO and network**
   - Measure write throughput (points/second)
   - Track query response times
   - Monitor object store latency for cloud deployments
   - Check disk IO wait times with `iostat`

### Establish baselines

```bash
# Monitor CPU per thread
top -H -p $(pgrep influxdb3)

# Track memory usage
free -h
watch -n 1 "free -h"

# Check IO wait
iostat -x 1
```

> [!Tip]
> For comprehensive metrics monitoring, see [Monitor metrics](/influxdb3/version/admin/monitor-metrics/).

## Essential settings for performance

{{% show-in "enterprise" %}}
Use the following to tune performance in _all-in-one_ deployments:

> [!Note]
> For specialized cluster nodes (ingest-only, query-only, etc.), see [Configure specialized cluster nodes](/influxdb3/version/admin/clustering/) for mode-specific optimizations.
{{% /show-in %}}

### Thread allocation (--num-io-threads{{% show-in "enterprise" %}}, --num-datafusion-threads{{% /show-in %}})

**IO threads** handle HTTP requests and line protocol parsing. **Default: 2** (often insufficient).
{{% show-in "enterprise" %}}**DataFusion threads** process queries and snapshots.{{% /show-in %}}

{{% show-in "core" %}}
> [!Note]
> {{% product-name %}} automatically allocates remaining cores to DataFusion after reserving IO threads. You can only configure `--num-io-threads`.
{{% /show-in %}}

{{% show-in "enterprise" %}}
> [!Note]
> {{% product-name %}} lets you configure both thread pools explicitly with `--num-io-threads` and `--num-datafusion-threads`.
{{% /show-in %}}

{{% show-in "core" %}}
```bash
# Write-heavy: More IO threads
influxdb3 --num-io-threads=12 serve \
  --node-id=node0 \
  --object-store=file --data-dir=~/.influxdb3

# Query-heavy: Fewer IO threads
influxdb3 --num-io-threads=4 serve \
  --node-id=node0 \
  --object-store=file --data-dir=~/.influxdb3
```
{{% /show-in %}}

{{% show-in "enterprise" %}}
```bash
# Write-heavy: More IO threads, adequate DataFusion
influxdb3 --num-io-threads=12 --num-datafusion-threads=20 serve \
  --node-id=node0 --cluster-id=cluster0 \
  --object-store=file --data-dir=~/.influxdb3

# Query-heavy: Fewer IO threads, more DataFusion
influxdb3 --num-io-threads=4 --num-datafusion-threads=28 serve \
  --node-id=node0 --cluster-id=cluster0 \
  --object-store=file --data-dir=~/.influxdb3
```
{{% /show-in %}}

> [!Warning]
> #### Increase IO threads for concurrent writers
>
> If you have multiple concurrent writers (for example, Telegraf agents), the default of 2 IO threads can bottleneck write performance.

### Memory pool (--exec-mem-pool-bytes)

Controls memory for query execution.
Default: {{% show-in "core" %}}70%{{% /show-in %}}{{% show-in "enterprise" %}}20%{{% /show-in %}} of RAM.

{{% show-in "core" %}}
```bash
# Increase for query-heavy workloads
influxdb3 --exec-mem-pool-bytes=90% serve \
  --node-id=node0 \
  --object-store=file --data-dir=~/.influxdb3

# Decrease if experiencing memory pressure
influxdb3 --exec-mem-pool-bytes=60% serve \
  --node-id=node0 \
  --object-store=file --data-dir=~/.influxdb3
```
{{% /show-in %}}

{{% show-in "enterprise" %}}
```bash
# Increase for query-heavy workloads
influxdb3 --exec-mem-pool-bytes=90% serve \
  --node-id=node0 --cluster-id=cluster0 \
  --object-store=file --data-dir=~/.influxdb3

# Decrease if experiencing memory pressure
influxdb3 --exec-mem-pool-bytes=60% serve \
  --node-id=node0 --cluster-id=cluster0 \
  --object-store=file --data-dir=~/.influxdb3
```
{{% /show-in %}}

### Parquet cache ({{% show-in "core" %}}--parquet-mem-cache-size-mb{{% /show-in %}}{{% show-in "enterprise" %}}--parquet-mem-cache-size{{% /show-in %}})

Caches frequently accessed data files in memory.

{{% show-in "core" %}}
```bash
# Enable caching for better query performance
influxdb3 --parquet-mem-cache-size-mb=4096 serve \
  --node-id=node0 \
  --object-store=file --data-dir=~/.influxdb3
```
{{% /show-in %}}

{{% show-in "enterprise" %}}
```bash
# Enable caching for better query performance
influxdb3 --parquet-mem-cache-size=4GB serve \
  --node-id=node0 --cluster-id=cluster0 \
  --object-store=file --data-dir=~/.influxdb3
```
{{% /show-in %}}

### WAL flush interval (--wal-flush-interval)

Controls write latency vs throughput. Default: 1s.

{{% show-in "core" %}}
```bash
# Reduce latency for real-time data
influxdb3 --wal-flush-interval=100ms serve \
  --node-id=node0 \
  --object-store=file --data-dir=~/.influxdb3
```
{{% /show-in %}}

{{% show-in "enterprise" %}}
```bash
# Reduce latency for real-time data
influxdb3 --wal-flush-interval=100ms serve \
  --node-id=node0 --cluster-id=cluster0 \
  --object-store=file --data-dir=~/.influxdb3
```
{{% /show-in %}}

## Common performance issues

### High write latency

**Symptoms:** Increasing write response times, timeouts, points dropped

**Solutions:**
1. Increase [IO threads](#thread-allocation-num-io-threads) (default is only 2)
2. Reduce [WAL flush interval](#wal-flush-interval-wal-flush-interval) (from 1s to 100ms)
3. Check disk IO performance

### Slow query performance

**Symptoms:** Long execution times, high memory usage, query timeouts

**Solutions:**
1. {{% show-in "enterprise" %}}Increase [DataFusion threads](#thread-allocation-num-datafusion-threads)
2. {{% /show-in %}}Increase [execution memory pool](#memory-pool-exec-mem-pool-bytes) (to 90%)
3. Enable [Parquet caching](#parquet-cache-parquet-mem-cache-size{{% show-in "core" %}}-mb{{% /show-in %}})

### Memory pressure

**Symptoms:** OOM errors, swapping, high memory usage

**Solutions:**
1. Reduce [execution memory pool](#memory-pool-exec-mem-pool-bytes) (to 60%)
2. Lower snapshot threshold (`--force-snapshot-mem-threshold=70%`)

### CPU bottlenecks

**Symptoms:** 100% CPU utilization, uneven thread usage (only 2 cores for writes)

**Solutions:**
1. Rebalance [thread allocation](#thread-allocation-num-io-threads{{% show-in "enterprise" %}}-num-datafusion-threads{{% /show-in %}})
2. Check if only 2 cores are used for write parsing (increase IO threads)

> [!Important]
> #### "My ingesters are only using 2 cores"
> 
> Increase `--num-io-threads` to 8-16+ for ingest nodes.{{% show-in "enterprise" %}} For dedicated ingest nodes with `--mode=ingest`, see [Configure ingest nodes](/influxdb3/version/admin/clustering/#configure-ingest-nodes).{{% /show-in %}}

## Configuration examples by workload

### Write-heavy workloads (>100k points/second)

{{% show-in "core" %}}
```bash
# 32-core system, high ingest rate
influxdb3 --num-io-threads=12 \
  --exec-mem-pool-bytes=80% \
  --wal-flush-interval=100ms \
  serve \
  --node-id=node0 \
  --object-store=file \
  --data-dir=~/.influxdb3
```
{{% /show-in %}}

{{% show-in "enterprise" %}}
```bash
# 32-core system, high ingest rate
influxdb3 --num-io-threads=12 \
  --num-datafusion-threads=20 \
  --exec-mem-pool-bytes=80% \
  --wal-flush-interval=100ms \
  serve \
  --node-id=node0 \
  --cluster-id=cluster0 \
  --object-store=file \
  --data-dir=~/.influxdb3
```
{{% /show-in %}}

### Query-heavy workloads (complex analytics)

{{% show-in "core" %}}
```bash
# 32-core system, analytical queries
influxdb3 --num-io-threads=4 \
  --exec-mem-pool-bytes=90% \
  --parquet-mem-cache-size-mb=2048 \
  serve \
  --node-id=node0 \
  --object-store=file \
  --data-dir=~/.influxdb3
```
{{% /show-in %}}

{{% show-in "enterprise" %}}
```bash
# 32-core system, analytical queries
influxdb3 --num-io-threads=4 \
  --num-datafusion-threads=28 \
  --exec-mem-pool-bytes=90% \
  --parquet-mem-cache-size=2GB \
  serve \
  --node-id=node0 \
  --cluster-id=cluster0 \
  --object-store=file \
  --data-dir=~/.influxdb3
```
{{% /show-in %}}

### Mixed workloads (real-time dashboards)

{{% show-in "core" %}}
```bash
# 32-core system, balanced operations
influxdb3 --num-io-threads=8 \
  --exec-mem-pool-bytes=70% \
  --parquet-mem-cache-size-mb=1024 \
  serve \
  --node-id=node0 \
  --object-store=file \
  --data-dir=~/.influxdb3
```
{{% /show-in %}}

{{% show-in "enterprise" %}}
```bash
# 32-core system, balanced operations
influxdb3 --num-io-threads=8 \
  --num-datafusion-threads=24 \
  --exec-mem-pool-bytes=70% \
  --parquet-mem-cache-size=1GB \
  serve \
  --node-id=node0 \
  --cluster-id=cluster0 \
  --object-store=file \
  --data-dir=~/.influxdb3
```
{{% /show-in %}}

## Thread allocation details

### Calculate optimal thread counts

Use this formula as a starting point:

```
Total cores = N
Concurrent writers = W
Query complexity factor = Q (1-10, where 10 is most complex)

IO threads = min(W + 2, N * 0.4)
DataFusion threads = N - IO threads
```

### Example configurations by system size

#### Small system (4 cores, 16&nbsp;GB RAM)

{{% show-in "core" %}}
```bash
# Balanced configuration
influxdb3 --num-io-threads=2 \
  --exec-mem-pool-bytes=10GB \
  --parquet-mem-cache-size-mb=500 \
  serve \
  --node-id=node0 \
  --object-store=file \
  --data-dir=~/.influxdb3
```
{{% /show-in %}}

{{% show-in "enterprise" %}}
```bash
# Balanced configuration
influxdb3 --num-io-threads=2 \
  --exec-mem-pool-bytes=10GB \
  --parquet-mem-cache-size=500MB \
  serve \
  --node-id=node0 \
  --cluster-id=cluster0 \
  --object-store=file \
  --data-dir=~/.influxdb3
```
{{% /show-in %}}

#### Medium system (16 cores, 64&nbsp;GB RAM)

{{% show-in "core" %}}
```bash
# Write-optimized configuration
influxdb3 --num-io-threads=6 \
  --exec-mem-pool-bytes=45GB \
  --parquet-mem-cache-size-mb=2048 \
  serve \
  --node-id=node0 \
  --object-store=file \
  --data-dir=~/.influxdb3
```
{{% /show-in %}}

{{% show-in "enterprise" %}}
```bash
# Write-optimized configuration
influxdb3 --num-io-threads=6 \
  --num-datafusion-threads=10 \
  --exec-mem-pool-bytes=45GB \
  --parquet-mem-cache-size=2GB \
  serve \
  --node-id=node0 \
  --cluster-id=cluster0 \
  --object-store=file \
  --data-dir=~/.influxdb3
```
{{% /show-in %}}

#### Large system (64 cores, 256&nbsp;GB RAM)

{{% show-in "core" %}}
```bash
# Query-optimized configuration
influxdb3 --num-io-threads=8 \
  --exec-mem-pool-bytes=200GB \
  --parquet-mem-cache-size-mb=10240 \
  --object-store-connection-limit=200 \
  serve \
  --node-id=node0 \
  --object-store=file \
  --data-dir=~/.influxdb3
```
{{% /show-in %}}

{{% show-in "enterprise" %}}
```bash
# Query-optimized configuration
influxdb3 --num-io-threads=8 \
  --num-datafusion-threads=56 \
  --exec-mem-pool-bytes=200GB \
  --parquet-mem-cache-size=10GB \
  --object-store-connection-limit=200 \
  serve \
  --node-id=node0 \
  --cluster-id=cluster0 \
  --object-store=file \
  --data-dir=~/.influxdb3
```
{{% /show-in %}}

{{% show-in "enterprise" %}}
## Enterprise mode-specific tuning

### Ingest mode optimization

Dedicated ingest nodes require significant IO threads:

```bash
# High-throughput ingester (96 cores)
influxdb3 --mode=ingest \
  --num-cores=96 \
  --num-io-threads=24 \
  --num-datafusion-threads=72 \
  --force-snapshot-mem-threshold=90% \
  serve \
  --node-id=ingester0 \
  --cluster-id=cluster0 \
  --object-store=file \
  --data-dir=~/.influxdb3
```

> [!Warning]
> Without explicitly setting `--num-io-threads`, a 96-core ingester uses only 2 cores
> for parsing line protocol, wasting 94% of available CPU for ingest operations.

### Query mode optimization

Query nodes should maximize DataFusion threads:

```bash
# Query-optimized node (64 cores)
influxdb3 --mode=query \
  --num-cores=64 \
  --num-io-threads=4 \
  --num-datafusion-threads=60 \
  --exec-mem-pool-bytes=90% \
  --parquet-mem-cache-size=4GB \
  serve \
  --node-id=query0 \
  --cluster-id=cluster0 \
  --object-store=file \
  --data-dir=~/.influxdb3
```

### Compactor mode optimization

Compaction is DataFusion-intensive:

```bash
# Dedicated compactor (32 cores)
influxdb3 --mode=compact \
  --num-cores=32 \
  --num-io-threads=2 \
  --num-datafusion-threads=30 \
  --compaction-row-limit=1000000 \
  serve \
  --node-id=compactor0 \
  --cluster-id=cluster0 \
  --object-store=file \
  --data-dir=~/.influxdb3
```
{{% /show-in %}}

## Memory tuning

### Execution memory pool

Configure the query execution memory pool:

```bash
# Absolute value in bytes
--exec-mem-pool-bytes=8589934592  # 8GB

# Percentage of available RAM
--exec-mem-pool-bytes=80%  # 80% of system RAM
```

**Guidelines:**
- **Write-heavy**: 60-70% (leave room for OS cache)
- **Query-heavy**: 80-90% (maximize query memory)
- **Mixed**: 70% (balanced approach)

### Parquet cache configuration

Cache frequently accessed Parquet files:

```bash
# Set cache size
--parquet-mem-cache-size=2147483648  # 2GB

# Configure cache behavior
--parquet-mem-cache-prune-interval=1m \
--parquet-mem-cache-prune-percentage=20
```

### WAL and snapshot tuning

Control memory pressure from write buffers:

```bash
# Force snapshot when memory usage exceeds threshold
--force-snapshot-mem-threshold=80%

# Configure WAL rotation
--wal-flush-interval=10s \
--wal-snapshot-size=100MB
```

## Advanced tuning options

{{% show-in "enterprise" %}}
### Specialized cluster nodes

For performance optimizations using dedicated ingest, query, compaction, or processing nodes, see [Configure specialized cluster nodes](/influxdb3/version/admin/clustering/).
{{% /show-in %}}

For less common performance optimizations and detailed configuration options, see:

### DataFusion engine tuning

<!-- DEV-ONLY FLAGS: DO NOT DOCUMENT --datafusion-runtime-type IN PRODUCTION DOCS
     This flag will be removed in InfluxDB 3.5 Enterprise.
     Only multi-thread mode should be used (which is the default).
     The current-thread option is deprecated and will be removed.
     Future editors: Keep this commented out. -->

<!-- DEV-ONLY FLAGS: DO NOT DOCUMENT TOKIO RUNTIME FLAGS IN PRODUCTION DOCS
     --datafusion-runtime-max-blocking-threads and --datafusion-runtime-thread-priority
     are advanced tokio runtime configurations that should not be exposed to end users.
     Future editors: Remove these tokio runtime flags from production documentation. -->

Advanced DataFusion runtime parameters:
- [`--datafusion-config`](/influxdb3/version/reference/cli/influxdb3/serve/#datafusion-config)

### HTTP and network tuning

Request size and network optimization:
- [`--max-http-request-size`](/influxdb3/version/reference/cli/influxdb3/serve/#max-http-request-size) - For large batches (default: 10 MB)
- [`--http-bind`](/influxdb3/version/reference/cli/influxdb3/serve/#http-bind) - Bind address

### Object store optimization

Performance tuning for cloud object stores:
- [`--object-store-connection-limit`](/influxdb3/version/reference/cli/influxdb3/serve/#object-store-connection-limit) - Connection pool size
- [`--object-store-max-retries`](/influxdb3/version/reference/cli/influxdb3/serve/#object-store-max-retries) - Retry configuration
- [`--object-store-http2-only`](/influxdb3/version/reference/cli/influxdb3/serve/#object-store-http2-only) - Force HTTP/2

### Complete configuration reference

For all available configuration options, see:
- [CLI serve command reference](/influxdb3/version/reference/cli/influxdb3/serve/)
- [Configuration options](/influxdb3/version/reference/config-options/)

## Monitoring and validation

### Monitor thread utilization

```bash
# Linux: View per-thread CPU usage
top -H -p $(pgrep influxdb3)

# Monitor specific threads
watch -n 1 "ps -eLf | grep influxdb3 | head -20"
```

### Check performance metrics

Monitor key indicators:

```sql
-- Query system.threads table (Enterprise)
SELECT * FROM system.threads
WHERE cpu_usage > 90
ORDER BY cpu_usage DESC;

-- Check write throughput
SELECT
  count(*) as points_written,
  max(timestamp) - min(timestamp) as time_range
FROM your_measurement
WHERE timestamp > now() - INTERVAL '1 minute';
```

### Validate configuration

Verify your tuning changes:

```bash
# Check effective configuration
influxdb3 serve --help-all | grep -E "num-io-threads|num-datafusion-threads"

# Monitor memory usage
free -h
watch -n 1 "free -h"

# Check IO wait
iostat -x 1
```

## Common performance issues

### High write latency

**Symptoms:**
- Increasing write response times
- Timeouts from write clients
- Points dropped or rejected

**Solutions:**
1. Increase IO threads: `--num-io-threads=16`
2. Reduce batch sizes in writers
3. Increase WAL flush frequency
4. Check disk IO performance

### Slow query performance

**Symptoms:**
- Long query execution times
- High memory usage during queries
- Query timeouts

**Solutions:**
{{% show-in "core" %}}1. Increase execution memory pool: `--exec-mem-pool-bytes=90%`
2. Enable Parquet caching: `--parquet-mem-cache-size=4GB`
3. Optimize query patterns (smaller time ranges, fewer fields){{% /show-in %}}
{{% show-in "enterprise" %}}1. Increase DataFusion threads: `--num-datafusion-threads=30`
2. Increase execution memory pool: `--exec-mem-pool-bytes=90%`
3. Enable Parquet caching: `--parquet-mem-cache-size=4GB`
4. Optimize query patterns (smaller time ranges, fewer fields){{% /show-in %}}

### Memory pressure

**Symptoms:**
- Out of memory errors
- Frequent garbage collection
- System swapping

**Solutions:**
1. Reduce execution memory pool: `--exec-mem-pool-bytes=60%`
2. Lower snapshot threshold: `--force-snapshot-mem-threshold=70%`
3. Decrease cache sizes
4. Add more RAM or reduce workload

### CPU bottlenecks

**Symptoms:**
- 100% CPU utilization
- Uneven thread pool usage
- Performance plateaus

**Solutions:**
1. Rebalance thread allocation based on workload
2. Add more CPU cores
3. Optimize client batching
4. {{% show-in "enterprise" %}}Distribute workload across specialized nodes{{% /show-in %}}