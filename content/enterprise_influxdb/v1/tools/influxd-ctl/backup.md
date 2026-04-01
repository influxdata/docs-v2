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

| Flag        | Description                                                         |
| :---------- | :------------------------------------------------------------------ |
| `-bufsize`  | Buffer size (in bytes) for writing gzip files. Default is `1048576` (1 MB). _v1.12.3+_ |
| `-cpuprofile` | Write CPU profile to the specified file path. For debugging backup performance. _v1.12.3+_ |
| `-db`       | Database to backup                                                  |
| `-end`      | End date for backup _(RFC3339 timestamp)_                           |
| `-estimate` | Estimate the size of the requested backup                           |
| `-from`     | Data node TCP address to prefer when backing up. In v1.12.3+, the node must exist in the cluster or the command returns an error. When the preferred node doesn't own a shard, the command falls back to other owners sorted by most recent write. See [Node selection](#node-selection). |
| `-full`     | Perform a full backup _(deprecated in favor of `-strategy full`)_ |
| `-gzipBlockCount` | Number of concurrent blocks for gzip compression. Default is the number of CPU cores. Recommended: 1-2x CPU cores. _v1.12.3+_ |
| `-gzipBlockSize` | Block size (in bytes) for pgzip compression. Default is `1048576` (1 MB). Recommended >1 MB for performance. _v1.12.3+_ |
| `-gzipCompressionLevel` | Gzip compression level: `default`, `full`, `speedy`, or `none`. Default is `default`. _v1.12.3+_ |
| `-rp`       | Retention policy to backup                                          |
| `-shard`    | Shard ID to backup                                                  |
| `-staleness-threshold` | For incremental backups, skip shards modified within this duration of the existing backup. Default is `10m` (matches [`cache-snapshot-write-cold-duration`](/enterprise_influxdb/v1/administration/configure/config-data-nodes/#cache-snapshot-write-cold-duration)). _v1.12.3+_ |
| `-start`    | Start date for backup _(RFC3339 timestamp)_                         |
| `-strategy` | Backup strategy to use (`only-meta`, `full`, or `incremental`)      |

{{% caption %}}
_Also see [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
{{% /caption %}}

## Backup behavior {metadata="v1.12.3+"}

### Node selection

When backing up a shard, the command selects the best data node to read from:

1. Shard copies with zero bytes are skipped.
2. Copies are sorted by most recent write time — the most recently written copy is tried first.
3. If you specify `-from`, that node is preferred. If the preferred node doesn't own the shard, the command falls back to other owners.
4. If the `-from` node doesn't exist in the cluster, the command fails with: `data node "<addr>" does not exist`.

### Staleness threshold

During incremental backups, the `-staleness-threshold` flag controls when a shard is considered current and can be skipped.
A shard is skipped when the existing backup timestamp plus the staleness threshold is after the shard's last modification time.

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
