<!-- Allow leading shortcode -->
{{% product-name %}} uses a dual thread pool architecture to efficiently handle different types of workloads.
Understanding how threads are allocated and used helps you optimize performance for your specific use case.

## Thread pool architecture

{{% product-name %}} divides available CPU resources between two specialized thread pools:

- [IO runtime thread pool](#io-runtime-thread-pool)
- [DataFusion runtime thread pool](#datafusion-runtime-thread-pool)

### IO runtime thread pool

The IO runtime handles all input/output operations and initial data processing:

- **HTTP request handling**: Receives and responds to HTTP API requests
- **Line protocol parsing**: Parses and validates incoming line protocol data
- **Network communication**: Manages all network IO operations
- **File system operations**: Reads from and writes to local file systems
- **Object store operations**: Interacts with object storage (S3, Azure Blob, GCS)
- **Initial request routing**: Routes requests to appropriate handlers

> [!Important]
> Line protocol parsing is CPU-intensive and happens on IO threads. Each concurrent writer
> can utilize one IO thread for parsing, making IO thread count critical for write throughput.

### DataFusion runtime thread pool

The DataFusion runtime handles query processing and data management:

- **Query execution**: Processes SQL and InfluxQL queries
- **Data aggregation**: Performs aggregations and transformations
- **Snapshot creation**: Executes sort and dedupe operations during WAL snapshots
- **Parquet file generation**: Creates and optimizes Parquet files
- **Compaction operations**: Merges and optimizes stored data
- **Cache operations**: Manages query result caching

> [!Note]
> Even nodes dedicated to ingest (Enterprise `--mode=ingest`) require DataFusion threads
> for snapshot operations that create Parquet files from WAL data.

## Default thread allocation

When you start {{% product-name %}} without specifying thread counts, the system uses these defaults:

### Without explicit configuration

```
Total system cores: N
IO threads: 2 (or 1 if N < 4)
DataFusion threads: N - IO threads
```

**Examples:**
- 4-core system: 2 IO threads, 2 DataFusion threads
- 32-core system: 2 IO threads, 30 DataFusion threads
- 96-core system: 2 IO threads, 94 DataFusion threads

> [!Warning]
> The default 2 IO threads can severely limit performance with multiple concurrent writers.
> A 96-core system using only 2 cores for ingest is significantly underutilized.

{{% show-in "enterprise" %}}
### With --num-cores set

When you limit total cores with `--num-cores`, {{% product-name %}} automatically adjusts thread allocation:

```
num-cores value: N
1-2 cores: 1 IO thread, 1 DataFusion thread
3 cores: 1 IO thread, 2 DataFusion threads
4+ cores: 2 IO threads, (N-2) DataFusion threads
```
{{% /show-in %}}

## Manual thread configuration

Override default thread allocation for optimal performance--for example:

### Configure IO threads

```bash
# Increase IO threads for write-heavy workloads
influxdb3 serve \
  --node-id=node0 \
  --object-store=file \
  --data-dir=~/.influxdb3 \
  --num-io-threads=8
```

For detailed configuration examples with memory tuning, caching, and other performance
optimizations, see [Performance tuning](/influxdb3/version/admin/performance-tuning/).

## Thread utilization patterns

- [Write operations](#write-operations)
- [Query operations](#query-operations)
- [Snapshot operations](#snapshot-operations)

### Write operations

1. HTTP request arrives on IO thread
2. IO thread parses line protocol (CPU-intensive)
3. IO thread validates data against schema
4. Data queued for WAL write
5. IO thread sends response

**Bottleneck indicators:**
- IO threads at 100% CPU utilization
- Write latency increases with concurrent writers
- Throughput plateaus despite available CPU

### Query operations

1. HTTP request arrives on IO thread
2. IO thread routes to query handler
3. DataFusion thread plans query execution
4. DataFusion threads execute query in parallel
5. Results assembled and returned via IO thread

**Bottleneck indicators:**
- DataFusion threads at 100% CPU utilization
- Query latency increases with complexity
- Concurrent query throughput limited

### Snapshot operations

1. Triggered by time or WAL size threshold
2. DataFusion threads sort and deduplicate data
3. DataFusion threads create Parquet files
4. IO threads write files to object storage

> [!Important]
> Snapshots use DataFusion threads even on ingest-only nodes.

## Performance implications

Thread allocation impacts performance based on workload characteristics.

- [Concurrent writer scaling](#concurrent-writer-scaling)
- [Memory considerations](#memory-considerations)
- [CPU efficiency](#cpu-efficiency)

### Concurrent writer scaling

Each concurrent writer (for example, Telegraf agent or API client) can utilize approximately one IO thread for line protocol parsing:

| Concurrent Writers | Recommended IO Threads | Rationale |
|-------------------|------------------------|-----------|
| 1-2 | 2-4 | Some headroom for system operations |
| 5 | 5-8 | One thread per writer plus overhead |
| 10 | 10-14 | Linear scaling with writers |

### Memory considerations

Thread pools have associated memory overhead:

- **IO threads**: Generally lower memory usage, mainly buffers for parsing
- **DataFusion threads**: Higher memory usage for query execution and sorting
  - Default execution memory pool: 70% of available RAM
  - Divided among DataFusion threads
  - More threads = less memory per thread

### CPU efficiency

- **IO threads**: Typically CPU-bound during parsing
- **DataFusion threads**: Mix of CPU and memory-bound operations
- **Context switching**: Too many threads relative to cores causes overhead

## Monitoring thread utilization

Monitor thread pool utilization to identify bottlenecks--for example:

```bash
# View thread utilization (Linux)
top -H -p $(pgrep influxdb3)

# Monitor IO wait
iostat -x 1

# Check CPU utilization by core
mpstat -P ALL 1
```

## Recommendations by workload

Thread allocation should match your workload characteristics:

- **Write-heavy workloads**: Allocate more IO threads (10-40% of cores)
- **Query-heavy workloads**: Maximize DataFusion threads (85-95% of cores)
- **Balanced workloads**: Split evenly based on actual usage patterns

{{% show-in "enterprise" %}}
> [!Note]
> Even nodes dedicated to ingest (`--mode=ingest`) require DataFusion threads
> for snapshot operations that create Parquet files from WAL data.
{{% /show-in %}}
