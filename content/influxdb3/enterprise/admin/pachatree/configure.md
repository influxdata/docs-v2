---
title: Configure the performance upgrade preview
seotitle: Performance upgrade preview configuration reference for InfluxDB 3 Enterprise
description: >
  Complete reference for all configuration options available with the InfluxDB 3 Enterprise
  performance upgrades, including memory, compaction, WAL, caching, and replication settings.
menu:
  influxdb3_enterprise:
    name: Configuration reference
    parent: Performance upgrade preview
weight: 202
influxdb3/enterprise/tags: [storage, configuration, beta, preview, reference]
related:
  - /influxdb3/enterprise/admin/pachatree/
  - /influxdb3/enterprise/admin/pachatree/monitor/
  - /influxdb3/enterprise/admin/performance-tuning/
  - /influxdb3/enterprise/reference/config-options/
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


This page provides a complete reference for all configuration options available
with these performance upgrades. All options require the `--use-pacha-tree` flag.

## Core settings

| Option | Description | Default |
|:-------|:------------|:--------|
| `--use-pacha-tree` | Enable the performance upgrade preview | `false` |
| `--pt-max-columns` | Maximum total columns across the instance | `6500000` (~6.5M) |

### Set maximum columns

Limit the total number of columns across all databases and tables:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-max-columns 1000000
```

## Memory management

Control how the upgraded storage uses memory for buffers, caches, and processing.

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-wal-max-buffer-size` | Maximum WAL buffer size before flush | `15MB` |
| `--pt-snapshot-max-unmerged-size` | Unmerged data threshold for snapshot | `500MB` |
| `--pt-merge-threshold-size` | Size threshold to trigger merge | `125MB` |
| `--pt-replica-max-buffer-size` | Query node buffer maximum | 50% system memory (max 16 GB) |

### WAL buffer size

The WAL buffer accumulates incoming writes before flushing to object storage.
Larger buffers reduce flush frequency but increase memory usage:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-wal-max-buffer-size 30MB
```

### Snapshot threshold

Control when the snapshot buffer triggers a snapshot creation:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-snapshot-max-unmerged-size 1GB
```

### Merge threshold

Set the size threshold that triggers background merge operations:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-merge-threshold-size 250MB
```

### Query node buffer (distributed)

For query nodes in distributed deployments, control the maximum buffer size:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --mode query \
  --pt-replica-max-buffer-size 8GB
```

## WAL configuration

Configure Write-Ahead Log (WAL) behavior for durability and performance.

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-wal-flush-interval` | Automatic flush interval | `1s` |
| `--pt-wal-merge-on-interval` | Enable interval-based merging | `true` (all-in-one), `false` (multi-node) |
| `--pt-wal-flush-concurrency` | WAL flush worker concurrency | `max(io_threads - 2, 2)` |
| `--pt-wal-replication-interval` | Query node WAL polling interval | `250ms` |

### Flush interval

Control how frequently the WAL buffer flushes to object storage:

```bash
# More frequent flushes (lower latency, more I/O)
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-wal-flush-interval 500ms
```

```bash
# Less frequent flushes (higher latency, less I/O)
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-wal-flush-interval 5s
```

### Flush concurrency

Increase flush workers for high-throughput workloads:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-wal-flush-concurrency 8
```

### Interval-based merging

In all-in-one mode, WAL files are merged on a time interval.
Disable for more control over merge timing:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-wal-merge-on-interval false
```

## Compaction settings

Configure background compaction behavior.

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-compactor-concurrency` | Compaction worker concurrency | `max(io_threads - 2, 2)` |
| `--pt-snapshot-merge-concurrency` | Snapshot merge concurrency | `max(io_threads - 2, 2)` |
| `--pt-compactor-cache` | Compaction cache size | 20% of file cache |

### Compaction concurrency

Increase compaction workers for faster background processing:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-compactor-concurrency 8
```

### Snapshot merge concurrency

Control parallelism for snapshot merge operations:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-snapshot-merge-concurrency 4
```

### Compaction cache

Dedicated cache for compaction operations (separate from query cache):

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-compactor-cache 2GB
```

## Cache configuration

Configure data caching for query performance.

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-file-cache-size` | Data file cache size | ~20% system memory |
| `--pt-file-cache-recency` | Only cache files newer than this | `5h` |
| `--pt-file-cache-evict-after` | Evict entries not read within this duration | `24h` |
| `--pt-compactor-cache-ttl` | Compaction cache TTL | `5m` |
| `--pt-disable-data-file-cache` | Disable data file caching | `false` |

### File cache size

Set the maximum size for the data file cache:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-file-cache-size 8GB
```

### Cache recency filter

Only cache files containing data from the specified time window:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-file-cache-recency 24h
```

### Cache eviction

Control how long cached entries persist without access:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-file-cache-evict-after 12h
```

### Disable caching

For memory-constrained environments or when using external caching:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-disable-data-file-cache
```

## File size limits

Control the size of generated files.

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-gen0-max-rows-per-file` | Maximum rows per Gen0 file | `10000000` (10M) |
| `--pt-gen0-max-bytes-per-file` | Maximum bytes per Gen0 file | `100MB` |

### Gen0 file size limits

Control the size of Gen0 files for query and compaction performance:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-gen0-max-rows-per-file 5000000 \
  --pt-gen0-max-bytes-per-file 50MB
```

## Enterprise replication

Configure replication behavior for distributed deployments.

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-wal-replica-recovery-concurrency` | Concurrent WAL fetches during recovery | `8` |
| `--pt-wal-replica-steady-concurrency` | Concurrent fetches during steady-state | `8` |
| `--pt-wal-replica-queue-size` | Queue between fetching and merging | `100` |
| `--pt-wal-replica-recovery-tail-skip-limit` | Missing files before stopping recovery | `128` |
| `--pt-replica-gen0-load-concurrency` | Gen0 loads at startup | `16` |
| `--pt-replica-merge-interval` | Query node merge cycle interval | `100ms` |

### Recovery concurrency

Control parallelism during query node recovery:

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

### Merge interval

Control how frequently query nodes merge replicated data:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --mode query \
  --pt-replica-merge-interval 50ms
```

## Other settings

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-enable-retention` | Enforce retention policies | `true` |
| `--pt-disable-hybrid-query` | Disable hybrid Parquet queries | `false` |

### Retention policies

Retention policies are enforced by default. Disable for testing or debugging:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-enable-retention false
```

### Hybrid query mode

Disable access to legacy Parquet data:

```bash
influxdb3 serve \
  # ...
  --use-pacha-tree \
  --pt-disable-hybrid-query
```

## Example configurations

### Development (minimal resources)

```bash
influxdb3 serve \
  --node-id dev01 \
  --cluster-id dev \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --use-pacha-tree \
  --pt-file-cache-size 512MB \
  --pt-wal-max-buffer-size 5MB \
  --pt-snapshot-max-unmerged-size 100MB \
  --pt-compactor-concurrency 2
```

### Production all-in-one (8 cores, 32 GB RAM)

```bash
influxdb3 serve \
  --node-id prod01 \
  --cluster-id prod \
  --object-store s3 \
  --bucket YOUR_BUCKET \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY \
  --use-pacha-tree \
  --num-io-threads 8 \
  --pt-file-cache-size 8GB \
  --pt-wal-max-buffer-size 30MB \
  --pt-snapshot-max-unmerged-size 1GB \
  --pt-compactor-concurrency 4 \
  --pt-wal-flush-concurrency 4
```

### High-throughput ingest node

```bash
influxdb3 serve \
  --node-id ingest01 \
  --cluster-id prod \
  --object-store s3 \
  --bucket YOUR_BUCKET \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY \
  --use-pacha-tree \
  --mode ingest \
  --num-io-threads 16 \
  --pt-wal-max-buffer-size 50MB \
  --pt-wal-flush-interval 2s \
  --pt-wal-flush-concurrency 8 \
  --pt-snapshot-max-unmerged-size 2GB
```

### Query-optimized node

```bash
influxdb3 serve \
  --node-id query01 \
  --cluster-id prod \
  --object-store s3 \
  --bucket YOUR_BUCKET \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY \
  --use-pacha-tree \
  --mode query \
  --num-io-threads 16 \
  --pt-file-cache-size 16GB \
  --pt-file-cache-recency 24h \
  --pt-replica-max-buffer-size 8GB \
  --pt-replica-merge-interval 50ms
```

### Dedicated compactor

```bash
influxdb3 serve \
  --node-id compact01 \
  --cluster-id prod \
  --object-store s3 \
  --bucket YOUR_BUCKET \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY \
  --use-pacha-tree \
  --mode compact \
  --num-io-threads 8 \
  --pt-compactor-concurrency 8 \
  --pt-compactor-cache 4GB \
  --pt-compactor-cache-ttl 10m
```
