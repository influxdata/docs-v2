---
title: Configure the performance upgrade preview
seotitle: Performance upgrade preview configuration reference for InfluxDB 3 Enterprise
description: >
  Complete reference for all configuration options available with the InfluxDB 3 Enterprise
  performance upgrades, including WAL, snapshot, compaction, caching, and replication settings.
menu:
  influxdb3_enterprise:
    name: Configuration reference
    parent: Performance upgrade preview
weight: 202
influxdb3/enterprise/tags: [storage, configuration, beta, preview, reference]
related:
  - /influxdb3/enterprise/performance-preview/
  - /influxdb3/enterprise/performance-preview/monitor/
  - /influxdb3/enterprise/admin/performance-tuning/
  - /influxdb3/enterprise/reference/config-options/
---

> [!Warning]
> #### Performance preview beta
> The performance upgrade preview is available to {{% product-name %}} Trial
> and Commercial users as a beta. These features are subject to breaking changes
> and **should not be used for production workloads**.

This page provides a complete reference for all configuration options available
with the performance upgrade preview.
All `--pt-*` performance upgrade options require the `--use-pacha-tree` flag.

If an option is omitted, the preview either derives a value from the existing
`influxdb3 serve` configuration or falls back to an engine-specific default
that balances resource usage and throughput.

> [!Important]
> Set `--num-io-threads` to the number of cores on the machine when using the
> performance upgrade preview.

- [General](#general)
- [WAL](#wal)
- [Snapshot](#snapshot)
- [Gen0](#gen0)
- [File cache](#file-cache)
- [Replication (query nodes)](#replication-query-nodes)
- [Compactor](#compactor)
- [L1-L4 level tuning](#l1-l4-level-tuning)
- [Example configurations](#example-configurations)
- [Downgrade options](#downgrade-options)

## General

| Option | Description | Default |
|:-------|:------------|:--------|
| `--use-pacha-tree` | Enable the performance upgrade preview. Required for any other `--pt-` option to have effect. | Disabled |
| `--pt-engine-path-prefix` | Optional path prefix for all engine data (WAL and compaction generations). Max 32 characters. Must start and end with alphanumeric; inner characters allow `[a-zA-Z0-9._-]`. Shorter paths improve partitioning in object stores. | No prefix |
| `--pt-max-columns` | Maximum total columns across the entire instance. Must be at least 2. | `10,000,000` (10M) |
| `--pt-enable-retention` | Enable retention enforcement. | `true` |
| `--pt-disable-hybrid-query` | Disable hybrid query mode. When the preview is enabled with existing Parquet data, queries normally merge results across both Parquet and `.pt` files. Set this flag to query only `.pt` data. | `false` |
| `--pt-enable-auto-dvc` | Enable automatic distinct value caching for `SHOW TAG VALUES` queries and the `tag_values()` SQL function. | Disabled |
| `--pt-upgrade-poll-interval` | Polling interval for Parquet-to-PachaTree upgrade status monitoring. See [Upgrade from Parquet](/influxdb3/enterprise/performance-preview/#upgrade-from-parquet). | `5s` |

### Engine path prefix

Use a short prefix to improve partitioning in object stores:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-engine-path-prefix mydata
```

### Hybrid query mode

When you enable the preview on an instance with existing Parquet data,
hybrid query mode merges results across both Parquet and `.pt` files.
Disable hybrid mode to query only `.pt` data:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-disable-hybrid-query
```

## WAL

Configure Write-Ahead Log (WAL) behavior for durability and performance.

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-wal-flush-interval` | Flush interval for the WAL. | Inherits `--wal-flush-interval` (1s) |
| `--pt-wal-flush-concurrency` | WAL flush concurrency. | `max(io_threads - 2, 2)` |
| `--pt-wal-max-buffer-size` | Maximum in-memory WAL buffer before a flush is triggered regardless of the flush interval. Increase this if WAL files are flushed before the interval elapses. | `15MB` |
| `--pt-wal-snapshots-to-keep` | Number of snapshot manifests worth of WAL history to retain. Must be greater than 0. | `5` |

### WAL buffer size

The WAL buffer accumulates incoming writes before flushing to object storage.
Larger buffers reduce flush frequency and produce larger WAL files, but increase
memory usage:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-wal-max-buffer-size 30MB
```

### Flush interval and concurrency

Control how frequently the WAL flushes and how many workers run flushes in
parallel:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-wal-flush-interval 2s \
  --pt-wal-flush-concurrency 8
```

## Snapshot

Configure snapshot buffer behavior, which controls how WAL files are merged
into Gen0 files.

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-snapshot-size` | Maximum size of the active snapshot bucket before it is rotated for snapshotting. | `250MB` |
| `--pt-snapshot-duration` | Time-based snapshot rotation trigger. Controls how often the ingester creates snapshots. Also used on query nodes as the bucket rotation interval for the replica buffer. | `10s` |
| `--pt-max-concurrent-snapshots` | Maximum number of concurrent snapshot operations before applying backpressure to writers. | `5` |
| `--pt-merge-threshold-size` | Maximum unmerged file size before triggering a merge operation. | `--pt-snapshot-size` / 4 (62.5MB) |

### Snapshot size and duration

Control when snapshot rotation triggers:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-snapshot-size 500MB \
  --pt-snapshot-duration 15s
```

### Merge threshold

Set the size threshold that triggers background merge operations.
Lower values result in more frequent merges:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-merge-threshold-size 125MB
```

## Gen0

Control the size of Gen0 files produced during merge operations.

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-gen0-max-rows-per-file` | Upper bound on rows per Gen0 file emitted during merge. | `10000000` (10M) |
| `--pt-gen0-max-bytes-per-file` | Upper bound on bytes per Gen0 file emitted during merge. | `100MB` |

### Gen0 file size limits

Control the size of Gen0 files for query and compaction performance:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-gen0-max-rows-per-file 5000000 \
  --pt-gen0-max-bytes-per-file 50MB
```

## File cache

Configure data file caching for query performance.

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-file-cache-size` | Size of the data file cache (bytes or %). Set to `0` on dedicated ingest nodes. | Mirrors `--parquet-mem-cache-size` |
| `--pt-disable-data-file-cache` | Disable data file caching. Set to `true` on dedicated ingest nodes. | `false` (automatically `true` if `--disable-parquet-mem-cache` is set) |
| `--pt-file-cache-recency` | Only cache files newer than this age. Pre-caching on all-in-one and query nodes is based on this value. | Mirrors `--parquet-mem-cache-query-path-duration` (`3d`) |
| `--pt-file-cache-evict-after` | Evict cached files that have not been read within this duration. | `24h` |

### File cache size

Set the maximum size for the data file cache:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-file-cache-size 8GB
```

### Cache recency filter

Only cache files containing data within a recent time window:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-file-cache-recency 24h
```

### Disable caching on ingest nodes

For dedicated ingest nodes, disable the data file cache to save memory:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --mode ingest \
  --pt-disable-data-file-cache
```

## Replication (query nodes)

Configure replication behavior for query nodes in distributed deployments.

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-wal-replication-interval` | Polling interval to check for new WAL files to replicate from ingest nodes. | `250ms` |
| `--pt-wal-replica-recovery-concurrency` | Number of concurrent WAL file fetches during replica recovery or catchup. | `8` |
| `--pt-wal-replica-steady-concurrency` | Number of concurrent WAL file fetches during steady-state replication. | `8` |
| `--pt-wal-replica-queue-size` | Size of the queue between WAL file fetching and replica buffer merging. | `100` |
| `--pt-wal-replica-recovery-tail-skip-limit` | Number of consecutive missing WAL files before stopping replica recovery. | `128` |
| `--pt-replica-gen0-load-concurrency` | Limit on the number of Gen0 files loaded concurrently when the replica starts. | `16` |
| `--pt-replica-max-buffer-size` | Maximum replica buffer size (bytes or %). Used by query nodes to store WAL files replicated from ingest nodes. | 50% of available memory, capped at 16GB |

### Recovery concurrency

Control parallelism during query node recovery or catchup:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --mode query \
  --pt-wal-replica-recovery-concurrency 16
```

### Steady-state replication

Configure ongoing replication performance:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --mode query \
  --pt-wal-replica-steady-concurrency 4 \
  --pt-wal-replica-queue-size 200
```

### Replica buffer size

Control the maximum buffer size for replicated data on query nodes:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --mode query \
  --pt-replica-max-buffer-size 8GB
```

## Compactor

Configure background compaction behavior.
The compactor organizes data into fixed 24-hour UTC windows and progresses data
through four compaction levels (L1 through L4).

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-partition-count` | Target number of partitions per compaction window. | `1` |
| `--pt-compactor-input-size-budget` | Maximum total input bytes across all active compaction jobs. Acts as an admission control budget for the compactor scheduler. | 50% of system memory at startup |
| `--pt-final-compaction-age` | Age threshold for final compaction. When all L1-L3 run sets in a window are older than this, a final compaction merges everything into L4. | `72h` |
| `--pt-compactor-cleanup-cooldown` | Cooldown after checkpoint publish before replaced files can be cleaned up. | `10min` |

### Compaction budget

Control total memory allocated to active compaction jobs:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-compactor-input-size-budget 8GB
```

### Final compaction age

Control when windows receive their final compaction into L4:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-final-compaction-age 48h
```

## L1-L4 level tuning

These options control per-level compaction parameters.
Data enters L1 from snapshot batch compaction and promotes through levels
based on run set count triggers.

| Level | Role | Default tail target | Default file size | Promotion trigger |
|:------|:-----|:--------------------|:------------------|:------------------|
| **L1** | Ingest landing zone | 600MB | 25MB | 3 run sets |
| **L2** | First promotion tier | 1.2GB | 40MB | 3 run sets |
| **L3** | Second promotion tier | 2.5GB | 75MB | 4 run sets |
| **L4** | Terminal (fully compacted) | 50GB | 125MB | N/A |

### L1 options

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-l1-tail-target-bytes` | L1 tail run set target size. | `600MB` |
| `--pt-l1-target-file-bytes` | L1 target file size. | `25MB` |
| `--pt-l1-promotion-count` | Number of L1 run sets that triggers promotion to L2. | `3` |

### L2 options

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-l2-tail-target-bytes` | L2 tail run set target size. | `1.2GB` |
| `--pt-l2-target-file-bytes` | L2 target file size. | `40MB` |
| `--pt-l2-promotion-count` | Number of L2 run sets that triggers promotion to L3. | `3` |

### L3 options

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-l3-tail-target-bytes` | L3 tail run set target size. | `2.5GB` |
| `--pt-l3-target-file-bytes` | L3 target file size. | `75MB` |
| `--pt-l3-promotion-count` | Number of L3 run sets that triggers promotion to L4. | `4` |

### L4 options

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-l4-tail-target-bytes` | L4 tail run set target size. | `50GB` |
| `--pt-l4-target-file-bytes` | L4 target file size. | `125MB` |

## Example configurations

### Development (minimal resources)

```bash
influxdb3 serve \
  --node-id dev01 \
  --cluster-id dev-cluster \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --use-pacha-tree \
  --num-io-threads 2 \
  --pt-file-cache-size 512MB \
  --pt-wal-max-buffer-size 5MB \
  --pt-snapshot-size 100MB
```

### Production all-in-one (8 cores, 32 GB RAM)

```bash
influxdb3 serve \
  --node-id prod01 \
  --cluster-id prod-cluster \
  --object-store s3 \
  --bucket S3_BUCKET \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY \
  --use-pacha-tree \
  --num-io-threads 8 \
  --pt-file-cache-size 8GB \
  --pt-wal-max-buffer-size 30MB \
  --pt-snapshot-size 500MB \
  --pt-wal-flush-concurrency 4
```

### High-throughput ingest node

```bash
influxdb3 serve \
  --node-id ingest01 \
  --cluster-id prod-cluster \
  --object-store s3 \
  --bucket S3_BUCKET \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY \
  --use-pacha-tree \
  --mode ingest \
  --num-io-threads 16 \
  --pt-wal-max-buffer-size 50MB \
  --pt-wal-flush-interval 2s \
  --pt-wal-flush-concurrency 8 \
  --pt-snapshot-size 1GB \
  --pt-disable-data-file-cache
```

### Query-optimized node

```bash
influxdb3 serve \
  --node-id query01 \
  --cluster-id prod-cluster \
  --object-store s3 \
  --bucket S3_BUCKET \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY \
  --use-pacha-tree \
  --mode query \
  --num-io-threads 16 \
  --pt-file-cache-size 16GB \
  --pt-file-cache-recency 24h \
  --pt-replica-max-buffer-size 8GB
```

### Dedicated compactor

```bash
influxdb3 serve \
  --node-id compact01 \
  --cluster-id prod-cluster \
  --object-store s3 \
  --bucket S3_BUCKET \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY \
  --use-pacha-tree \
  --mode compact \
  --num-io-threads 8 \
  --pt-compactor-input-size-budget 12GB
```

## Downgrade options

The `influxdb3 downgrade-to-parquet` command reverts a cluster from the
performance preview back to standard Parquet storage.
For the downgrade procedure, see
[Downgrade to Parquet](/influxdb3/enterprise/performance-preview/#downgrade-to-parquet).

| Option | Description |
|:-------|:------------|
| `--cluster-id` | _(Required)_ Cluster identifier. |
| `--object-store` | _(Required)_ Object storage type (`file`, `s3`, `gcs`, `azure`). |
| `--data-dir` | Location of data files for a local (`file`) object store. |
| `--bucket` | Object store bucket name (for `s3`, `gcs`, `azure`). |
| `--dry-run` | Preview mode--list files that would be deleted without making changes. |
| `--yes` | Skip the confirmation prompt. |
| `--ignore-running` | Proceed even if nodes appear to be running. **Warning:** may cause data inconsistency if nodes are actively writing. |
