---
title: Configure the upgraded storage engine
seotitle: Upgraded storage engine configuration reference for InfluxDB 3 Enterprise
description: >
  Complete reference for all configuration options available with the upgraded
  InfluxDB 3 Enterprise storage engine, including WAL, snapshot, compaction,
  caching, and replication settings.
menu:
  influxdb3_enterprise:
    name: Configuration reference
    parent: Storage engine upgrade
weight: 202
influxdb3/enterprise/tags: [storage, configuration, reference]
related:
  - /influxdb3/enterprise/performance-preview/
  - /influxdb3/enterprise/performance-preview/monitor/
  - /influxdb3/enterprise/admin/performance-tuning/
  - /influxdb3/enterprise/reference/config-options/
---

> [!Important]
> #### The upgraded storage engine is the default for new clusters
> New {{% product-name %}} clusters default to the upgraded storage
> engine--no flag is required.
> Clusters that started on 3.10 or earlier keep the Parquet engine until you
> run the storage engine upgrade by restarting the cluster with
> [`--upgrade-pacha-tree`](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree).

This page provides a complete reference for the upgraded storage engine
configuration options.

If an option is omitted, the server either derives a value from the existing
`influxdb3 serve` configuration or falls back to an engine-specific default
that balances resource usage and throughput.

Most of the options on this page are tuning options that do not appear in the
default `influxdb3 serve --help` output; use `--help-all` to list them.

> [!Important]
> #### The `pt-` option prefix was removed
>
> Preview options no longer use the `pt-` prefix--for example,
> `--pt-snapshot-size` is now `--snapshot-size`.
> There is no backward compatibility for preview option names:
> old `--pt-*` flags cause a startup error, and legacy `INFLUXDB3_PT_*` and
> `INFLUXDB3_ENTERPRISE_PT_*` environment variables are ignored.
> The server logs a warning at startup for each `INFLUXDB3_PT_*` or
> `INFLUXDB3_ENTERPRISE_PT_*` environment variable that is still set.
>
> The following preview options were folded into engine-agnostic options
> shared with the Parquet-based engine:
>
> - `--pt-wal-flush-interval` → [`--wal-flush-interval`](/influxdb3/enterprise/reference/config-options/#wal-flush-interval)
> - `--pt-wal-replication-interval` → [`--replication-interval`](/influxdb3/enterprise/reference/config-options/#replication-interval)
> - `--pt-file-cache-size` → [`--file-cache-size`](/influxdb3/enterprise/reference/config-options/#file-cache-size)
> - `--pt-file-cache-recency` → [`--file-cache-recency`](/influxdb3/enterprise/reference/config-options/#file-cache-recency)
> - `--pt-disable-data-file-cache` → [`--disable-file-cache`](/influxdb3/enterprise/reference/config-options/#disable-file-cache)
>
> For the complete old-to-new name table, see
> [Migrate from pt- option names](#migrate-from-pt-option-names).

> [!Note]
> On clusters running the upgraded storage engine, the IO and DataFusion
> runtimes each default to the
> licensed core count.
> Thread counts set above the licensed core count are capped with a startup
> warning.
> The [thread allocation guidance](/influxdb3/enterprise/admin/performance-tuning/#thread-allocation-details)
> for the Parquet engine doesn't apply to the upgraded storage engine, which
> runs ingest and compaction on the IO runtime instead of the DataFusion
> runtime. When setting thread counts explicitly, allocate more threads to IO:
>
> - **Ingest nodes**: weight heavily toward IO threads.
> - **Compactor nodes**: use a more balanced split (for example, 60% IO,
>   40% DataFusion).

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
- [Migrate from pt- option names](#migrate-from-pt-option-names)

## General

| Option | Description | Default |
|:-------|:------------|:--------|
| [`--upgrade-pacha-tree`](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree) | Migrate the cluster's existing Parquet data to the upgraded storage engine. New clusters default to the upgraded engine and do not need this flag. | `false` |
| `--engine-path-prefix` | Optional path prefix for all engine data (WAL and compaction generations). Max 32 characters. Must start and end with alphanumeric; inner characters allow `[a-zA-Z0-9._-]`. Shorter paths improve partitioning in object stores. | No prefix |
| `--max-total-columns` | Maximum total columns across the entire instance (distinct from the per-table [`--num-total-columns-per-table-limit`](/influxdb3/enterprise/reference/config-options/#num-total-columns-per-table-limit)). Must be at least 2. | `10,000,000` (10M) |
| `--enable-retention` | Enable retention enforcement. | `true` |
| `--disable-hybrid-query` | Disable hybrid query mode. During and after the storage engine upgrade, queries normally merge results across both Parquet and `.pt` files. Set this flag to query only `.pt` data. | `false` |
| `--enable-auto-dvc` | Enable automatic distinct value caching for `SHOW TAG VALUES` queries and the `tag_values()` SQL function. | Disabled |
| `--auto-dvc-max-cardinality` | Maximum cardinality for auto-created distinct value caches. Requires `--enable-auto-dvc`. | `100000` |
| `--auto-dvc-refresh-interval` | Background refresh interval for auto-created distinct value caches; minimum `1s`. Requires `--enable-auto-dvc`. | `10m` |
| `--upgrade-poll-interval` | Polling interval for storage engine upgrade status monitoring. See [Upgrade from Parquet](/influxdb3/enterprise/performance-preview/#upgrade-from-parquet). | `5s` |

### Engine path prefix

Use a short prefix to improve partitioning in object stores:

```bash
influxdb3 serve \
  # ...
  --engine-path-prefix mydata
```

### Hybrid query mode

During and after the storage engine upgrade, hybrid query mode merges
results across both Parquet and `.pt` files.
Disable hybrid mode to query only `.pt` data:

```bash
influxdb3 serve \
  # ...
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
  --wal-buffer-size 30MB
```

### Flush interval and concurrency

Control how frequently the WAL flushes and how many workers run flushes in
parallel:

```bash
influxdb3 serve \
  # ...
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
  --snapshot-size 500MB \
  --snapshot-duration 15s
```

### Merge threshold

Set the size threshold that triggers background merge operations.
Lower values result in more frequent merges:

```bash
influxdb3 serve \
  # ...
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
  --gen0-max-rows-per-file 5000000 \
  --gen0-max-file-size 50MB
```

## File cache

Configure data file caching for query performance.

| Option | Description | Default |
|:-------|:------------|:--------|
| [`--file-cache-size`](/influxdb3/enterprise/reference/config-options/#file-cache-size) | Total data file cache budget, shared with the Parquet-based engine. During the storage engine upgrade with hybrid query enabled, the budget is split 50/50 between the two engine caches; otherwise, the active engine receives the full budget. Provide a unit suffix or percentage (bare numbers are rejected). Set to `0b` on dedicated ingest nodes. | `20%` |
| [`--disable-file-cache`](/influxdb3/enterprise/reference/config-options/#disable-file-cache) | Disable data file caching in both engines. Set to `true` on dedicated ingest nodes. | `false` |
| [`--file-cache-recency`](/influxdb3/enterprise/reference/config-options/#file-cache-recency) | Only cache files newer than this age. Pre-caching on all-in-one and query nodes is based on this value. Shared with the Parquet-based engine. | `3d` |
| `--file-cache-evict-after` | Evict cached files that have not been read within this duration. | `24h` |

> [!Note]
> #### Dedicated ingest nodes
> On dedicated ingest nodes (`--mode ingest`), disable the data file cache to avoid
> wasting memory on data that ingest nodes never query.
> Set `--file-cache-size 0b` or use `--disable-file-cache`.
> These options must be explicitly set—they are not applied automatically when
> `--mode ingest` is used.
> See [Disable caching on ingest nodes](#disable-caching-on-ingest-nodes) for an example.

### File cache size

Set the maximum size for the data file cache:

```bash
influxdb3 serve \
  # ...
  --file-cache-size 8GB
```

### Cache recency filter

Only cache files containing data within a recent time window:

```bash
influxdb3 serve \
  # ...
  --file-cache-recency 24h
```

### Disable caching on ingest nodes

For dedicated ingest nodes, disable the data file cache to save memory:

```bash
influxdb3 serve \
  # ...
  --mode ingest \
  --disable-file-cache
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
| `--replica-max-buffer-size` | Maximum replica buffer size. Requires a unit suffix or percentage. Used by query nodes to store WAL files replicated from ingest nodes. | 50% of available memory, capped at 16GB |

### Recovery concurrency

Control parallelism during query node recovery or catchup:

```bash
influxdb3 serve \
  # ...
  --mode query \
  --wal-replica-recovery-concurrency 16
```

### Steady-state replication

Configure ongoing replication performance:

```bash
influxdb3 serve \
  # ...
  --mode query \
  --wal-replica-steady-concurrency 4 \
  --wal-replica-queue-length 200
```

### Replica buffer size

Control the maximum buffer size for replicated data on query nodes:

```bash
influxdb3 serve \
  # ...
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
| `--final-compaction-age` | Age threshold for final compaction. When all L1-L3 run sets in a window are older than this, a final compaction merges everything into L4. | `4h` (time-disjoint layout); `72h` (legacy layout) |
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
  --compactor-input-size-budget 8GB
```

### Final compaction age

Control when windows receive their final compaction into L4:

```bash
influxdb3 serve \
  # ...
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
  --num-io-threads 2 \
  --datafusion-num-threads 2 \
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
  --num-io-threads 5 \
  --datafusion-num-threads 3 \
  --file-cache-size 8GB \
  --wal-buffer-size 30MB \
  --snapshot-size 500MB \
  --wal-flush-concurrency 4
```

### High-throughput ingest node (16 cores)

```bash
influxdb3 serve \
  --node-id ingest01 \
  --cluster-id prod-cluster \
  --object-store s3 \
  --bucket S3_BUCKET \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY \
  --mode ingest \
  --num-io-threads 12 \
  --datafusion-num-threads 4 \
  --wal-buffer-size 50MB \
  --wal-flush-interval 2s \
  --wal-flush-concurrency 8 \
  --snapshot-size 1GB \
  --disable-file-cache
```

### Query-optimized node (16 cores)

```bash
influxdb3 serve \
  --node-id query01 \
  --cluster-id prod-cluster \
  --object-store s3 \
  --bucket S3_BUCKET \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY \
  --mode query \
  --num-io-threads 6 \
  --datafusion-num-threads 10 \
  --file-cache-size 16GB \
  --file-cache-recency 24h \
  --replica-max-buffer-size 8GB
```

### Dedicated compactor (8 cores)

```bash
influxdb3 serve \
  --node-id compact01 \
  --cluster-id prod-cluster \
  --object-store s3 \
  --bucket S3_BUCKET \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY \
  --mode compact \
  --num-io-threads 5 \
  --datafusion-num-threads 3 \
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

## Migrate from pt- option names {#migrate-from-pt-option-names}

Use the following table to update startup scripts, Helm values, or systemd
environment files that use the removed `--pt-*` option names.
There are no aliases: old `--pt-*` flags cause a startup error, and legacy
`INFLUXDB3_PT_*` and `INFLUXDB3_ENTERPRISE_PT_*` environment variables are
ignored (the server logs a warning at startup for each one that is still set).

Environment variable names follow the option names--for example,
`INFLUXDB3_PT_SNAPSHOT_SIZE` becomes `INFLUXDB3_SNAPSHOT_SIZE`.
Any `--pt-*` option not listed below drops the `pt-` prefix without any
other change to its name.

| Old name | New name |
|:---------|:---------|
| `--pt-compactor-cleanup-cooldown` | `--compactor-cleanup-cooldown` |
| `--pt-compactor-input-size-budget` | `--compactor-input-size-budget` |
| `--pt-disable-data-file-cache` | [`--disable-file-cache`](/influxdb3/enterprise/reference/config-options/#disable-file-cache) (shared with the Parquet-based engine) |
| `--pt-disable-hybrid-query` | `--disable-hybrid-query` |
| `--pt-enable-auto-dvc` | `--enable-auto-dvc` |
| `--pt-enable-retention` | `--enable-retention` |
| `--pt-engine-path-prefix` | `--engine-path-prefix` |
| `--pt-file-cache-evict-after` | `--file-cache-evict-after` |
| `--pt-file-cache-recency` | [`--file-cache-recency`](/influxdb3/enterprise/reference/config-options/#file-cache-recency) (shared with the Parquet-based engine) |
| `--pt-file-cache-size` | [`--file-cache-size`](/influxdb3/enterprise/reference/config-options/#file-cache-size) (shared with the Parquet-based engine) |
| `--pt-final-compaction-age` | `--final-compaction-age` |
| `--pt-gen0-max-bytes-per-file` | `--gen0-max-file-size` |
| `--pt-gen0-max-rows-per-file` | `--gen0-max-rows-per-file` |
| `--pt-l1-promotion-count` | `--l1-promotion-count` |
| `--pt-l1-tail-target-bytes` | `--l1-tail-target-size` |
| `--pt-l1-target-file-bytes` | `--l1-target-file-size` |
| `--pt-l2-promotion-count` | `--l2-promotion-count` |
| `--pt-l2-tail-target-bytes` | `--l2-tail-target-size` |
| `--pt-l2-target-file-bytes` | `--l2-target-file-size` |
| `--pt-l3-promotion-count` | `--l3-promotion-count` |
| `--pt-l3-tail-target-bytes` | `--l3-tail-target-size` |
| `--pt-l3-target-file-bytes` | `--l3-target-file-size` |
| `--pt-l4-tail-target-bytes` | `--l4-tail-target-size` |
| `--pt-l4-target-file-bytes` | `--l4-target-file-size` |
| `--pt-max-columns` | `--max-total-columns` |
| `--pt-max-concurrent-snapshots` | `--max-concurrent-snapshots` |
| `--pt-merge-threshold-size` | `--merge-threshold-size` |
| `--pt-replica-gen0-load-concurrency` | `--replica-gen0-load-concurrency` |
| `--pt-replica-max-buffer-size` | `--replica-max-buffer-size` |
| `--pt-row-delete-min-age` | `--row-delete-min-age` |
| `--pt-shard-count` | `--shard-count` |
| `--pt-snapshot-duration` | `--snapshot-duration` |
| `--pt-snapshot-size` | `--snapshot-size` |
| `--pt-upgrade-poll-interval` | `--upgrade-poll-interval` |
| `--pt-wal-flush-concurrency` | `--wal-flush-concurrency` |
| `--pt-wal-flush-interval` | [`--wal-flush-interval`](/influxdb3/enterprise/reference/config-options/#wal-flush-interval) (shared with the Parquet-based engine) |
| `--pt-wal-max-buffer-size` | `--wal-buffer-size` |
| `--pt-wal-replica-queue-size` | `--wal-replica-queue-length` |
| `--pt-wal-replica-recovery-concurrency` | `--wal-replica-recovery-concurrency` |
| `--pt-wal-replica-recovery-tail-skip-limit` | `--wal-replica-recovery-tail-skip-limit` |
| `--pt-wal-replica-steady-concurrency` | `--wal-replica-steady-concurrency` |
| `--pt-wal-replication-interval` | [`--replication-interval`](/influxdb3/enterprise/reference/config-options/#replication-interval) (shared with the Parquet-based engine) |
| `--pt-wal-snapshots-to-keep` | `--wal-snapshots-to-keep` |
