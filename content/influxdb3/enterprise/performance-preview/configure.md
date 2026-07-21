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
All performance upgrade preview options require the `--use-pacha-tree` flag.

If an option is omitted, the preview either derives a value from the existing
`influxdb3 serve` configuration or falls back to an engine-specific default
that balances resource usage and throughput.

> [!Important]
> #### The `pt-` option prefix was removed
>
> Preview options no longer use the `pt-` prefix--for example,
> `--pt-snapshot-size` is now `--snapshot-size`.
> There is no backward compatibility for preview option names:
> old `--pt-*` flags cause a startup error, and legacy `INFLUXDB3_PT_*` and
> `INFLUXDB3_ENTERPRISE_PT_*` environment variables are ignored.
>
> The following preview options were folded into engine-agnostic options
> shared with the Parquet-based engine:
>
> - `--pt-wal-flush-interval` → [`--wal-flush-interval`](/influxdb3/enterprise/reference/config-options/#wal-flush-interval)
> - `--pt-wal-replication-interval` → [`--replication-interval`](/influxdb3/enterprise/reference/config-options/#replication-interval)
> - `--pt-file-cache-size` → [`--file-cache-size`](/influxdb3/enterprise/reference/config-options/#file-cache-size)
> - `--pt-file-cache-recency` → [`--file-cache-recency`](/influxdb3/enterprise/reference/config-options/#file-cache-recency)
> - `--pt-disable-data-file-cache` → [`--disable-data-file-cache`](/influxdb3/enterprise/reference/config-options/#disable-data-file-cache)

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
| `--use-pacha-tree` | Enable the performance upgrade preview. Required for any other preview option to have effect. | Disabled |
| `--engine-path-prefix` | Optional path prefix for all engine data (WAL and compaction generations). Max 32 characters. Must start and end with alphanumeric; inner characters allow `[a-zA-Z0-9._-]`. Shorter paths improve partitioning in object stores. | No prefix |
| `--max-total-columns` | Maximum total columns across the entire instance (distinct from the per-table [`--num-total-columns-per-table-limit`](/influxdb3/enterprise/reference/config-options/#num-total-columns-per-table-limit)). Must be at least 2. | `10,000,000` (10M) |
| `--enable-retention` | Enable retention enforcement. | `true` |
| `--disable-hybrid-query` | Disable hybrid query mode. When the preview is enabled with existing Parquet data, queries normally merge results across both Parquet and `.pt` files. Set this flag to query only `.pt` data. | `false` |
| `--enable-auto-dvc` | Enable automatic distinct value caching for `SHOW TAG VALUES` queries and the `tag_values()` SQL function. | Disabled |
| `--upgrade-poll-interval` | Polling interval for Parquet-to-PachaTree upgrade status monitoring. See [Upgrade from Parquet](/influxdb3/enterprise/performance-preview/#upgrade-from-parquet). | `5s` |

### Engine path prefix

Use a short prefix to improve partitioning in object stores:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --engine-path-prefix mydata
```

### Hybrid query mode

When you enable the preview on an instance with existing Parquet data,
hybrid query mode merges results across both Parquet and `.pt` files.
Disable hybrid mode to query only `.pt` data:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --disable-hybrid-query
```

## WAL

Configure Write-Ahead Log (WAL) behavior for durability and performance.

| Option | Description | Default |
|:-------|:------------|:--------|
| [`--wal-flush-interval`](/influxdb3/enterprise/reference/config-options/#wal-flush-interval) | Flush interval for the WAL. Shared with the Parquet-based engine (previously `--pt-wal-flush-interval`). | `1s` |
| `--wal-flush-concurrency` | WAL flush concurrency. | `max(io_threads - 2, 2)` |
| `--wal-buffer-size` | Maximum in-memory WAL buffer before a flush is triggered regardless of the flush interval. Increase this if WAL files are flushed before the interval elapses. | `15MB` |
| `--wal-snapshots-to-keep` | Number of snapshot manifests worth of WAL history to retain. Must be greater than 0. | `5` |

### WAL buffer size

The WAL buffer accumulates incoming writes before flushing to object storage.
Larger buffers reduce flush frequency and produce larger WAL files, but increase
memory usage:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --wal-buffer-size 30MB
```

### Flush interval and concurrency

Control how frequently the WAL flushes and how many workers run flushes in
parallel:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --wal-flush-interval 2s \
  --wal-flush-concurrency 8
```

## Snapshot

Configure snapshot buffer behavior, which controls how WAL files are merged
into Gen0 files.

| Option | Description | Default |
|:-------|:------------|:--------|
| `--snapshot-size` | Maximum size of the active snapshot bucket before it is rotated for snapshotting. | `250MB` |
| `--snapshot-duration` | Time-based snapshot rotation trigger. Controls how often the ingester creates snapshots. Also used on query nodes as the bucket rotation interval for the replica buffer. | `10s` |
| `--max-concurrent-snapshots` | Maximum number of concurrent snapshot operations before applying backpressure to writers. | `5` |
| `--merge-threshold-size` | Maximum unmerged file size before triggering a merge operation. | `--snapshot-size` / 4 (62.5MB) |

### Snapshot size and duration

Control when snapshot rotation triggers:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --snapshot-size 500MB \
  --snapshot-duration 15s
```

### Merge threshold

Set the size threshold that triggers background merge operations.
Lower values result in more frequent merges:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --merge-threshold-size 125MB
```

## Gen0

Control the size of Gen0 files produced during merge operations.

| Option | Description | Default |
|:-------|:------------|:--------|
| `--gen0-max-rows-per-file` | Upper bound on rows per Gen0 file emitted during merge. | `10000000` (10M) |
| `--gen0-max-file-size` | Upper bound on bytes per Gen0 file emitted during merge. | `100MB` |

### Gen0 file size limits

Control the size of Gen0 files for query and compaction performance:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --gen0-max-rows-per-file 5000000 \
  --gen0-max-file-size 50MB
```

## File cache

Configure data file caching for query performance.

| Option | Description | Default |
|:-------|:------------|:--------|
| [`--file-cache-size`](/influxdb3/enterprise/reference/config-options/#file-cache-size) | Total data file cache budget, shared with the Parquet-based engine. During a Parquet-to-PachaTree migration with hybrid query enabled, the budget is split 50/50 between the two engine caches; otherwise, the active engine receives the full budget. Provide a unit suffix or percentage (bare numbers are rejected). Set to `0b` on dedicated ingest nodes. | `20%` |
| [`--disable-data-file-cache`](/influxdb3/enterprise/reference/config-options/#disable-data-file-cache) | Disable data file caching in both engines. Set to `true` on dedicated ingest nodes. | `false` |
| [`--file-cache-recency`](/influxdb3/enterprise/reference/config-options/#file-cache-recency) | Only cache files newer than this age. Pre-caching on all-in-one and query nodes is based on this value. Shared with the Parquet-based engine. | `3d` |
| `--file-cache-evict-after` | Evict cached files that have not been read within this duration. | `24h` |

> [!Note]
> #### Dedicated ingest nodes
> On dedicated ingest nodes (`--mode ingest`), disable the data file cache to avoid
> wasting memory on data that ingest nodes never query.
> Set `--file-cache-size 0b` or use `--disable-data-file-cache`.
> These options must be explicitly set—they are not applied automatically when
> `--mode ingest` is used.
> See [Disable caching on ingest nodes](#disable-caching-on-ingest-nodes) for an example.

### File cache size

Set the maximum size for the data file cache:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --file-cache-size 8GB
```

### Cache recency filter

Only cache files containing data within a recent time window:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --file-cache-recency 24h
```

### Disable caching on ingest nodes

For dedicated ingest nodes, disable the data file cache to save memory:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --mode ingest \
  --disable-data-file-cache
```

## Replication (query nodes)

Configure replication behavior for query nodes in distributed deployments.

| Option | Description | Default |
|:-------|:------------|:--------|
| [`--replication-interval`](/influxdb3/enterprise/reference/config-options/#replication-interval) | Polling interval to check for new WAL files to replicate from ingest nodes. Shared with the Parquet-based engine (previously `--pt-wal-replication-interval`). | `250ms` |
| `--wal-replica-recovery-concurrency` | Number of concurrent WAL file fetches during replica recovery or catchup. | `8` |
| `--wal-replica-steady-concurrency` | Number of concurrent WAL file fetches during steady-state replication. | `8` |
| `--wal-replica-queue-length` | Length of the queue between WAL file fetching and replica buffer merging (previously `--pt-wal-replica-queue-size`). | `100` |
| `--wal-replica-recovery-tail-skip-limit` | Number of consecutive missing WAL files before stopping replica recovery. | `128` |
| `--replica-gen0-load-concurrency` | Limit on the number of Gen0 files loaded concurrently when the replica starts. | `16` |
| `--replica-max-buffer-size` | Maximum replica buffer size (bytes or %). Used by query nodes to store WAL files replicated from ingest nodes. | 50% of available memory, capped at 16GB |

### Recovery concurrency

Control parallelism during query node recovery or catchup:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --mode query \
  --wal-replica-recovery-concurrency 16
```

### Steady-state replication

Configure ongoing replication performance:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --mode query \
  --wal-replica-steady-concurrency 4 \
  --wal-replica-queue-length 200
```

### Replica buffer size

Control the maximum buffer size for replicated data on query nodes:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --mode query \
  --replica-max-buffer-size 8GB
```

## Compactor

Configure background compaction behavior.
The compactor organizes data into fixed 24-hour UTC windows and progresses data
through four compaction levels (L1 through L4).

| Option | Description | Default |
|:-------|:------------|:--------|
| `--shard-count` | Target number of shards per compaction window. | `1` |
| `--compactor-input-size-budget` | Maximum total input bytes across all active compaction jobs. Acts as an admission control budget for the compactor scheduler. | 50% of system memory at startup |
| `--final-compaction-age` | Age threshold for final compaction. When all L1-L3 run sets in a window are older than this, a final compaction merges everything into L4. | `72h` |
| `--compactor-cleanup-cooldown` | Cooldown after checkpoint publish before replaced files can be cleaned up. | `10min` |

> [!Note]
> **InfluxDB 3.10**: The `--pt-partition-count` option was renamed to
> `--pt-shard-count`; the option is now named `--shard-count`.

> [!Warning]
> #### Keep `--shard-count` at 1
>
> In InfluxDB 3.10, running the storage engine upgrade with more than one shard
> (`--shard-count` greater than `1`) can cause data loss and a bootstrap
> deadlock. Leave `--shard-count` at its default value of `1`.

### Compaction budget

Control total memory allocated to active compaction jobs:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --compactor-input-size-budget 8GB
```

### Final compaction age

Control when windows receive their final compaction into L4:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --final-compaction-age 48h
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
| `--l1-tail-target-size` | L1 tail run set target size. | `600MB` |
| `--l1-target-file-size` | L1 target file size. | `25MB` |
| `--l1-promotion-count` | Number of L1 run sets that triggers promotion to L2. | `3` |

### L2 options

| Option | Description | Default |
|:-------|:------------|:--------|
| `--l2-tail-target-size` | L2 tail run set target size. | `1.2GB` |
| `--l2-target-file-size` | L2 target file size. | `40MB` |
| `--l2-promotion-count` | Number of L2 run sets that triggers promotion to L3. | `3` |

### L3 options

| Option | Description | Default |
|:-------|:------------|:--------|
| `--l3-tail-target-size` | L3 tail run set target size. | `2.5GB` |
| `--l3-target-file-size` | L3 target file size. | `75MB` |
| `--l3-promotion-count` | Number of L3 run sets that triggers promotion to L4. | `4` |

### L4 options

| Option | Description | Default |
|:-------|:------------|:--------|
| `--l4-tail-target-size` | L4 tail run set target size. | `50GB` |
| `--l4-target-file-size` | L4 target file size. | `125MB` |

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
  --file-cache-size 512MB \
  --wal-buffer-size 5MB \
  --snapshot-size 100MB
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
  --file-cache-size 8GB \
  --wal-buffer-size 30MB \
  --snapshot-size 500MB \
  --wal-flush-concurrency 4
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
  --wal-buffer-size 50MB \
  --wal-flush-interval 2s \
  --wal-flush-concurrency 8 \
  --snapshot-size 1GB \
  --disable-data-file-cache
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
  --file-cache-size 16GB \
  --file-cache-recency 24h \
  --replica-max-buffer-size 8GB
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
  --compactor-input-size-budget 12GB
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
