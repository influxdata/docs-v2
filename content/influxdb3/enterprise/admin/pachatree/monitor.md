---
title: Monitor the performance upgrade preview
seotitle: Monitor the performance upgrade preview in InfluxDB 3 Enterprise
description: >
  Use system tables and query telemetry to monitor file status, query execution,
  and overall performance when using InfluxDB 3 Enterprise performance upgrades.
menu:
  influxdb3_enterprise:
    name: Monitor
    parent: Performance upgrade preview
weight: 203
influxdb3/enterprise/tags: [storage, monitoring, beta, preview, system tables]
related:
  - /influxdb3/enterprise/admin/pachatree/
  - /influxdb3/enterprise/admin/pachatree/configure/
  - /influxdb3/enterprise/admin/query-system-data/
---

> [!Warning]
> #### Private preview beta
> The performance upgrade preview is available to {{% product-name %}} Trial
> and Commercial users as a private beta. These features are subject to breaking changes
> and **should not be used for production workloads**.
>
> To share feedback on this preview, see [Support and feedback options](#bug-reports-and-feedback).
> Your feedback on stability
> and performance at scale helps shape the future of InfluxDB 3.

{{% product-name %}} provides system tables and a query telemetry endpoint to
monitor file status, query execution, and overall performance of these upgrades.

## System tables

The upgraded storage exposes internal state through system tables that you can
query with SQL.

### system.pt_ingest_wal

View WAL files and their partitions:

```sql
SELECT * FROM system.pt_ingest_wal;
```

Example output:

| wal_file_id | partition_id | database_id | table_id | min_time | max_time | row_count | size_bytes |
|:------------|:-------------|:------------|:---------|:---------|:---------|:----------|:-----------|
| wal_001 | p_1 | db_1 | t_1 | 2024-01-01T00:00:00Z | 2024-01-01T00:10:00Z | 50000 | 2456789 |
| wal_002 | p_1 | db_1 | t_1 | 2024-01-01T00:10:00Z | 2024-01-01T00:20:00Z | 48000 | 2345678 |

Use this table to monitor:

- **WAL accumulation**: Track the number and size of unmerged WAL files
- **Partition distribution**: See how data is distributed across partitions
- **Time coverage**: Verify data time ranges

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

| file_id | generation | database_id | table_id | min_time | max_time | row_count | size_bytes |
|:--------|:-----------|:------------|:---------|:---------|:---------|:----------|:-----------|
| gen0_001 | 0 | db_1 | t_1 | 2024-01-01T00:00:00Z | 2024-01-01T01:00:00Z | 500000 | 45678901 |
| gen0_002 | 0 | db_1 | t_1 | 2024-01-01T01:00:00Z | 2024-01-01T02:00:00Z | 480000 | 43567890 |

Use this table to monitor:

- **File counts per generation**: Track compaction progress
- **File sizes**: Verify files are within configured limits
- **Time ranges**: Identify time-unbounded Gen0 files

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

## Query telemetry

The query telemetry endpoint provides detailed execution statistics for
analyzing query performance.

### Enable query telemetry

Query the telemetry endpoint after executing a query:

```bash { placeholders="AUTH_TOKEN" }
curl -X GET "http://localhost:8181/api/v3/query_sql_telemetry" \
  -H "Authorization: Bearer AUTH_TOKEN"
```

Replace {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}
with your {{% token-link %}}.

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
| Cache hit rate | >80% | <60% | Increase cache size or recency window |
| Rows read vs returned ratio | <100:1 | >1000:1 | Add more selective predicates |

### Ingest performance metrics

Monitor these metrics for write performance:

| Metric | Healthy | Warning | Action |
|:-------|:--------|:--------|:-------|
| WAL file count | <50 | >100 | Increase merge concurrency |
| Unmerged size | <500 MB | >1 GB | Check compaction status |
| Gen0 file count | <100 | >200 | Increase compaction concurrency |

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
- Insufficient merge concurrency
- Object storage latency

**Solutions**:

1. Increase merge concurrency:
   ```bash
   --pt-snapshot-merge-concurrency 8
   ```

2. Increase WAL flush interval to create larger, fewer files:
   ```bash
   --pt-wal-flush-interval 5s
   ```

3. Check object storage performance and connectivity

### High cache miss rate

**Symptom**: `cache_stats` shows >40% miss rate.

**Possible causes**:

- Cache size too small for working set
- Cache recency window too narrow
- Random access patterns across time ranges

**Solutions**:

1. Increase cache size:
   ```bash
   --pt-file-cache-size 16GB
   ```

2. Extend cache recency window:
   ```bash
   --pt-file-cache-recency 24h
   ```

3. Extend eviction timeout:
   ```bash
   --pt-file-cache-evict-after 48h
   ```

### Slow compaction

**Symptom**: Gen0 file count continues to grow.

**Possible causes**:

- Compaction concurrency too low
- Compaction cache undersized
- High write rate overwhelming compaction

**Solutions**:

1. Increase compaction concurrency:
   ```bash
   --pt-compactor-concurrency 8
   ```

2. Increase compaction cache:
   ```bash
   --pt-compactor-cache 4GB
   ```

3. For distributed deployments, add dedicated compactor nodes:
   ```bash
   influxdb3 serve \
     # ...
     --use-pacha-tree \
     --mode compact
   ```

### Query node lag

**Symptom**: Query nodes return stale data.

**Possible causes**:

- Replication falling behind
- Network latency to object storage
- Insufficient replica concurrency

**Solutions**:

1. Increase replication concurrency:
   ```bash
   --pt-wal-replica-steady-concurrency 8
   ```

2. Reduce merge interval:
   ```bash
   --pt-replica-merge-interval 50ms
   ```

3. Increase replica queue size:
   ```bash
   --pt-wal-replica-queue-size 200
   ```
