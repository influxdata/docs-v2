---
title: influxd-ctl backup
description: >
  The `influxd-ctl backup` command backs up an InfluxDB Enterprise v1 cluster's
  [metastore](/enterprise_influxdb/v1/concepts/glossary/#metastore) and
  [shard](/enterprise_influxdb/v1/concepts/glossary/#shard) data at that point in
  time and stores the copy in the specified directory.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/administration/backup-and-restore/
  - /enterprise_influxdb/v1/tools/influxd-ctl/backup/
---

The `influxd-ctl backup` command backs up an InfluxDB Enterprise cluster's
[metastore](/enterprise_influxdb/v1/concepts/glossary/#metastore) and
[shard](/enterprise_influxdb/v1/concepts/glossary/#shard) data at that point in
time and stores the copy in the specified directory.

To back up only the cluster metastore, use the `-strategy only-meta` flag.
Backups are incremental by default, meaning they create a copy of the metastore
and shard data that have changed since the previous incremental backup.
If there are no existing incremental backups, the system automatically performs
a complete backup.

#### Backup strategies

InfluxDB Enterprise supports the following backup strategies:

- **only-meta**: Back up metastore data only, including users, roles, databases,
  continuous queries, and retention policies. This strategy does not back up shards.
- **full**: Back up metastore and all shard data.
- **incremental**: _(Default)_ Back up metastore and shard data that has changed
  since the last incremental backup. If there are no existing incremental backups,
  the system automatically performs a full backup.

## Usage

```sh
influxd-ctl backup [flags] <backup-dir>
```

## Arguments

- **backup-dir**: Directory to store backup files in

## Flags

| Flag                    | Description                                                         |
| :---------------------- | :------------------------------------------------------------------ |
| `-db`                   | Database to backup                                                  |
| `-end`                  | End date for backup _(RFC3339 timestamp)_                           |
| `-estimate`             | Estimate the size of the requested backup                           |
| `-from`                 | Data node TCP address to prefer when backing up                     |
| `-full`                 | Perform an full backup _(deprecated in favour of `-strategy full`)_ |
| `-rp`                   | Retention policy to backup                                          |
| `-shard`                | Shard ID to backup                                                  |
| `-start`                | Start date for backup _(RFC3339 timestamp)_                         |
| `-strategy`             | Backup strategy to use (`only-meta`, `full`, or `incremental`)      |
| `-gzipCompressionLevel` | Level of compression to use (`default`, `full`, `speedy`, `none`)   |
| `-cpuprofile`           | Write backup execution to a cpu profile (`true` or `false`)         |
| `-gzipBlockCount`       | Change the blocks processed concurrently during backup compression  |
| `-gzipBlockSize`        | Change the size of compressed blocked during backup compression     |

{{% caption %}}
_Also see [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
{{% /caption %}}

## Backup compression
`-gzipCompression` can be adjusted in order to allow for faster backups with the tradeoff that data will not be as compressed. 

  ┌─────────┬────────────────────────────────────┬─────────────────────────────────────────────┐
  │  Value  │            Description             │                  Use Case                   │
  ├─────────┼────────────────────────────────────┼─────────────────────────────────────────────┤
  │ default │ Standard gzip compression          │ General purpose, balanced                   │
  ├─────────┼────────────────────────────────────┼─────────────────────────────────────────────┤
  │ full    │ Best compression ratio             │ Minimize storage when time isn't critical   │
  ├─────────┼────────────────────────────────────┼─────────────────────────────────────────────┤
  │ speedy  │ Prioritizes speed over compression │ Faster backups with moderate space increase │
  ├─────────┼────────────────────────────────────┼─────────────────────────────────────────────┤
  │ none    │ No compression                     │ Maximum speed when storage isn't a concern  │
  └─────────┴────────────────────────────────────┴─────────────────────────────────────────────┘

Running backups with different compression settings on ~5.3 GB of data

  ┌───────────────────┬─────────────┬──────────────┬───────────────────────────────┐
  │ Compression Level │ Backup Time │ Size on Disk │             Notes             │
  ├───────────────────┼─────────────┼──────────────┼───────────────────────────────┤
  │ default           │ 51s         │ ~3.0 GB      │ ~50% compression ratio        │
  ├───────────────────┼─────────────┼──────────────┼───────────────────────────────┤
  │ full              │ 95s         │ ~2.7 GB      │ ~2x slower, ~10% less space   │
  ├───────────────────┼─────────────┼──────────────┼───────────────────────────────┤
  │ speedy            │ 23s         │ ~3.3 GB      │ ~2.2x faster, ~10% more space │
  ├───────────────────┼─────────────┼──────────────┼───────────────────────────────┤
  │ none              │ 10s         │ ~5.3 GB      │ ~5x faster, ~77% more space   │
  └───────────────────┴─────────────┴──────────────┴───────────────────────────────┘

  It is not recommended to change the values for `-gzipBlockCount` and `-gzipBlockSize`, they are set to sensible defaults per the [pgzip library](https://github.com/klauspost/pgzip).

## Examples

- [Perform an incremental backup](#perform-an-incremental-backup)
- [Perform a full backup](#perform-a-full-backup)
- [Estimate the size of a backup](#estimate-the-size-of-a-backup)
- [Backup data from a specific time range](#backup-data-from-a-specific-time-range)
- [Backup a specific shard](#backup-a-specific-shard)

### Perform an incremental backup

```sh
influxd-ctl backup /path/to/backup-dir
```

### Perform a full backup

```sh
influxd-ctl backup -strategy full /path/to/backup-dir
```

### Estimate the size of a backup

```sh
influxd-ctl backup -estimate
```

### Backup data from a specific time range

```sh
influxd-ctl backup \
  -start 2023-01-01T00:00:00Z \
  -end 2023-06-01T00:00:00Z \
  /path/to/backup-dir
```

### Backup a specific shard

```sh
influxd-ctl backup -shard 00 /path/to/backup-dir
```

### Backup data with configured compression

The following example uses the fastest possible compression speeds for backup:
```sh
influxd-ctl backup -strategy full -gzipBlockSize 10048576 -gzipBlockCount 28 -gzipCompressionLevel none .
```
