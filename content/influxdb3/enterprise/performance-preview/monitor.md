---
title: Monitor the upgraded storage engine
seotitle: Monitor the upgraded storage engine in InfluxDB 3 Enterprise
description: >
  Use system tables and query telemetry to monitor file status, query execution,
  and overall performance when using the upgraded InfluxDB 3 Enterprise storage
  engine.
menu:
  influxdb3_enterprise:
    name: Monitor
    parent: Storage engine upgrade
weight: 203
influxdb3/enterprise/tags: [storage, monitoring, system tables]
related:
  - /influxdb3/enterprise/performance-preview/
  - /influxdb3/enterprise/performance-preview/configure/
  - /influxdb3/enterprise/admin/query-system-data/
---

> [!Important]
> #### The upgraded storage engine is the default for new clusters
> The upgraded storage engine described on these pages is the default for
> new {{% product-name %}} clusters.
> Clusters that started on 3.10 or earlier keep the Parquet engine until you
> run the storage engine upgrade by restarting the cluster with
> [`--upgrade-pacha-tree`](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree).

{{% product-name %}} provides system tables and a query telemetry endpoint to
monitor file status, query execution, and overall performance when using the
upgraded storage engine.

## System tables

The upgraded storage engine exposes internal state through system tables that
you can query with SQL.

### system.pt_ingest_wal

View WAL files and their shards:

```sql
SELECT * FROM system.pt_ingest_wal;
```

Example output:

| wal_file_id | shard_start_time | shard_duration_seconds | min_time | max_time | row_count | size_bytes | is_merged |
|:------------|:-----------------|:-----------------------|:---------|:---------|:----------|:-----------|:----------|
| 1 | 2024-01-01T00:00:00Z | 86400 | 2024-01-01T00:00:00Z | 2024-01-01T00:10:00Z | 50000 | 2456789 | false |
| 2 | 2024-01-01T00:00:00Z | 86400 | 2024-01-01T00:10:00Z | 2024-01-01T00:20:00Z | 48000 | 2345678 | false |

> [!Note]
> **InfluxDB 3.10**: The `system.pt_ingest_wal` schema was updated to replace
> `partition_id`, `database_id`, and `table_id` with `shard_start_time`,
> `shard_duration_seconds`, and `is_merged`.

Use this table to monitor:

- **WAL accumulation**: Track the number and size of unmerged WAL files
- **Shard distribution**: See how data is distributed across shards
- **Time coverage**: Verify data time ranges
- **Merge status**: Identify WAL files where `is_merged` is `false`

#### Monitor WAL backlog

Check for WAL accumulation that may indicate merging is falling behind:

```sql
SELECT
  COUNT(*) as wal_file_count,
  SUM(size_bytes) / 1024 / 1024 as total_size_mb,
  MIN(min_time) as oldest_data,
  MAX(max_time) as newest_data
FROM system.pt_ingest_wal;
```

### system.pt_ingest_files

View Gen0 files with metadata:

```sql
SELECT * FROM system.pt_ingest_files;
```

Example output:

| file_id | generation | min_time | max_time | row_count | size_bytes | has_bloom_filter |
|:--------|:-----------|:---------|:---------|:----------|:-----------|:-----------------|
| 1 | 0 | 2024-01-01T00:00:00Z | 2024-01-01T01:00:00Z | 500000 | 45678901 | true |
| 2 | 0 | 2024-01-01T01:00:00Z | 2024-01-01T02:00:00Z | 480000 | 43567890 | true |

Use this table to monitor:

- **File counts per generation**: Track compaction progress
- **File sizes**: Verify files are within configured limits
- **Time ranges**: Identify Gen0 files that span multiple compaction windows

#### Monitor file distribution

Check file distribution and compaction status:

```sql
SELECT
  generation,
  COUNT(*) as file_count,
  SUM(row_count) as total_rows,
  SUM(size_bytes) / 1024 / 1024 as total_size_mb,
  AVG(size_bytes) / 1024 / 1024 as avg_file_size_mb
FROM system.pt_ingest_files
GROUP BY generation
ORDER BY generation;
```

### Compaction tables

The following system tables expose the state of the upgraded storage engine's
compaction subsystem.

#### system.pt_compaction_active_jobs

View currently running compaction jobs:

```sql
SELECT * FROM system.pt_compaction_active_jobs;
```

Key columns:

| Column | Description |
|:-------|:------------|
| `plan_id` | Unique job identifier |
| `plan_type` | Job type (for example, `L0toL1`) |
| `state` | Current job state (for example, `running`, `queued`) |
| `shard_id` | Shard being compacted |
| `total_slices` | Total work units in the job |
| `completed_slices` | Work units completed so far |

#### system.pt_compaction_ingest_nodes

View per-ingest-node compaction lag:

```sql
SELECT * FROM system.pt_compaction_ingest_nodes;
```

Key columns:

| Column | Description |
|:-------|:------------|
| `node_id` | Ingest node identifier |
| `compaction_lag` | How far behind the compactor is on this node's data |
| `seen_lag` | Lag between latest observed snapshot and latest compacted snapshot |
| `deferred_snapshot_count` | Number of snapshots deferred due to compaction failures |

Use `compaction_lag` and `deferred_snapshot_count` as the primary health
indicators.
A non-zero `deferred_snapshot_count` means snapshots failed to compact and
are accumulating; check `system.pt_compaction_deferred_snapshots` for details.

#### system.pt_compaction_nodes

View compaction node state:

```sql
SELECT * FROM system.pt_compaction_nodes;
```

#### system.pt_compaction_run_sets

View pending compaction work grouped by time window and shard:

```sql
SELECT * FROM system.pt_compaction_run_sets;
```

#### system.pt_compaction_deferred_snapshots

View snapshots that failed to compact:

```sql
SELECT * FROM system.pt_compaction_deferred_snapshots;
```

A growing list here indicates a persistent compaction failure.
Check `error_message` for the root cause.

## Parquet upgrade status

If you [upgraded from Parquet](/influxdb3/enterprise/performance-preview/#upgrade-from-parquet),
use these system tables to monitor migration progress.

### system.upgrade_parquet_node

View per-node upgrade status:

```sql
SELECT * FROM system.upgrade_parquet_node;
```

Monitor this table to confirm each node reaches `completed` status.
During the upgrade, nodes progress through detection, conversion, and
finalization stages.

### system.upgrade_parquet

View per-file migration progress:

```sql
SELECT * FROM system.upgrade_parquet;
```

Use this table to track individual file conversions during the migration.
The status updates on a polling interval (default 5 seconds, configurable with
`--upgrade-poll-interval`).

## Query telemetry

The query telemetry endpoint provides detailed execution statistics for
analyzing query performance.

### Enable query telemetry

Query the telemetry endpoint after executing a query:

```bash
curl -X GET "http://localhost:8181/api/v3/query_sql_telemetry" \
  -H "Authorization: Bearer AUTH_TOKEN"
```

Replace `AUTH_TOKEN` with your authentication token.

### Telemetry response

The response includes:

| Field | Description |
|:------|:------------|
| `query_id` | Unique identifier for the query |
| `execution_time_us` | Total execution time in microseconds |
| `chunks` | Per-chunk statistics |
| `cache_stats` | Cache hit rates by type |
| `file_stats` | File-level read statistics |

### Example telemetry output

```json
{
  "query_id": "q_12345",
  "execution_time_us": 4523,
  "chunks": [
    {
      "chunk_id": "c_1",
      "files_scanned": 3,
      "blocks_processed": 12,
      "rows_read": 24000,
      "rows_returned": 150,
      "bytes_read": 1234567
    }
  ],
  "cache_stats": {
    "gen0_hits": 5,
    "gen0_misses": 1,
    "compacted_hits": 8,
    "compacted_misses": 2
  }
}
```

## Performance analysis

### Query performance metrics

Track these key metrics for query performance:

| Metric | Good | Warning | Action |
|:-------|:-----|:--------|:-------|
| Cache hit rate | >80% | <60% | Increase `--file-cache-size` or `--file-cache-recency` |
| Rows read vs returned ratio | <100:1 | >1000:1 | Add more selective predicates |

### Ingest performance metrics

Monitor these metrics for write performance:

| Metric | Healthy | Warning | Action |
|:-------|:--------|:--------|:-------|
| WAL file count | <50 | >100 | Increase `--wal-flush-concurrency` |
| Gen0 file count | <100 | >200 | Increase `--compactor-input-size-budget` |

### Monitor with SQL

Create a performance summary query:

```sql
-- File generation summary
SELECT
  'Gen0 files' as metric,
  COUNT(*) as count,
  SUM(size_bytes) / 1024 / 1024 as size_mb
FROM system.pt_ingest_files
WHERE generation = 0

UNION ALL

SELECT
  'Compacted files' as metric,
  COUNT(*) as count,
  SUM(size_bytes) / 1024 / 1024 as size_mb
FROM system.pt_ingest_files
WHERE generation > 0

UNION ALL

SELECT
  'WAL files' as metric,
  COUNT(*) as count,
  SUM(size_bytes) / 1024 / 1024 as size_mb
FROM system.pt_ingest_wal;
```

## Troubleshooting

### High WAL file count

**Symptom**: `system.pt_ingest_wal` shows many accumulated files.

**Possible causes**:

- Merge operations falling behind write rate
- Insufficient flush concurrency
- Object storage latency

**Solutions**:

1. Increase flush concurrency:
   ```bash
   --wal-flush-concurrency 8
   ```

2. Increase WAL flush interval to create larger, fewer files:
   ```bash
   --wal-flush-interval 5s
   ```

3. Increase the WAL buffer size so each flush produces a larger file:
   ```bash
   --wal-buffer-size 30MB
   ```

4. Check object storage performance and connectivity.

### High cache miss rate

**Symptom**: `cache_stats` shows >40% miss rate.

**Possible causes**:

- Cache size too small for working set
- Cache recency window too narrow
- Random access patterns across time ranges

**Solutions**:

1. Increase cache size:
   ```bash
   --file-cache-size 16GB
   ```

2. Extend cache recency window:
   ```bash
   --file-cache-recency 24h
   ```

3. Extend eviction timeout:
   ```bash
   --file-cache-evict-after 48h
   ```

### Slow compaction

**Symptom**: Gen0 file count continues to grow.

**Possible causes**:

- Compaction budget too low for write volume
- High write rate overwhelming compaction
- Snapshot size too large, creating oversized Gen0 files

**Solutions**:

1. Increase the compaction input size budget:
   ```bash
   --compactor-input-size-budget 12GB
   ```

2. Reduce snapshot size to create smaller, more frequent Gen0 files:
   ```bash
   --snapshot-size 125MB
   ```

3. For distributed deployments, add a dedicated compactor node:
   ```bash
   influxdb3 serve \
     # ...
        --mode compact
   ```

### Query node lag

**Symptom**: Query nodes return stale data.

**Possible causes**:

- Replication falling behind
- Network latency to object storage
- Insufficient replica concurrency

**Solutions**:

For a full list of replication options, see
[Replication (query nodes)](/influxdb3/enterprise/performance-preview/configure/#replication-query-nodes).

1. Increase replication concurrency:
   ```bash
   --wal-replica-steady-concurrency 8
   ```

2. Reduce the replication polling interval:
   ```bash
   --replication-interval 100ms
   ```

3. Increase replica queue size:
   ```bash
   --wal-replica-queue-length 200
   ```
