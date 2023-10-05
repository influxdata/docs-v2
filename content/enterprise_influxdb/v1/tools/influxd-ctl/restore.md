---
title: influxd-ctl restore
description: >
  The `influxd-ctl restore` command restores data backed up from an InfluxDB
  Enterprise cluster.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/administration/backup-and-restore/
  - /enterprise_influxdb/v1/tools/influxd-ctl/backup/
---

The `influxd-ctl restore` command restores data backed up from an InfluxDB
Enterprise cluster.

`influxd-ctl restore` supports **full**, **incremental**, and **metadata-only** backups.
To restore from a full backup, include the `-full` flag and provide the path to
the backup manifest (`/path/to/backups/backup.manifest`).
To restore from an **incremental** or **metadata** backup, provide the path to
the directory that contains the backup files (`/path/to/backups`).

{{% note %}}
#### Destination database must be empty

The database data is restored to must be empty.
`influxd-ctl restore` will fail if the destination database contains data.
{{% /note %}}

## Usage

```sh
influxd-ctl restore [flags] <backup-location>
```

## Arguments

- **backup-location**: Location of backup-related files. They type of backup
  you're restoring from determines the type and location of backup files:
  
  - **Restore from a _full_ backup**: Provide the path to the backup manifest file
  - **Restore from an _incremental_ backup**: Provide the directory path of the backup
  - **Restore from a _metadata-only_ backup**: Provide the directory path of the backup

## Flags {#command-flags}

| Flag                         | Description                                                                                                 |
| :--------------------------- | :---------------------------------------------------------------------------------------------------------- |
| `-db`                        | Database to restore _(if the backup contains more than one)_                                                |
| `-full`                      | Restore data from a full backup                                                                             |
| `-list`                      | List the contents of the backup                                                                             |
| `-meta-only-overwrite-force` | Restore _only metadata_ from a backup {{< req "Danger: [see below](#meta-only-overwrite-force)" >}}         |
| `-newdb`                     | Change database name when restoring _(requires `-db` flag)_                                                 |
| `-newduration`               | Change retention policy duration (shard expiry) when restoring _(requires `-rp` flag, use 0s for infinite)_ |
| `-newrf`                     | New replication factor to use during restore _(limited by cluster size)_                                    |
| `-newrp`                     | Change retention policy name when restoring _(requires `-rp` flag)_                                         |
| `-newshard`                  | Shard ID to restore into _(if different from the shard ID in the backup)_                                   |
| `-rp`                        | Retention policy to restore _(if the backup contains more than one)_                                        |
| `-shard`                     | Shard ID to restore                                                                                         |

{{% caption %}}
_Also see [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
{{% /caption %}}

<span id="meta-only-overwrite-force"></span>
{{% warn %}}
Only use the `-meta-only-overwrite-force` flag to restore from backups of the
destination cluster. Metadata includes shard assignments to data nodes, so if
you use this flag with metadata from a different cluster, **you will lose data**.

See [Back up and restore](/enterprise_influxdb/v1/administration/backup-and-restore/#restore-overwrite-metadata-from-a-full-or-incremental-backup-to-fix-damaged-metadata)
for instructions on using this flag.
{{% /warn %}}

## Examples

- [Restore from a full backup](#restore-from-a-full-backup)
- [Restore from an incremental backup](#restore-from-an-incremental-backup)
- [Restore from a metadata backup](#restore-from-a-metadata-backup)

### Restore from a full backup

```sh
influxd-ctl restore -full /path/to/full-backup/20230101T00000Z.manifest
```

{{< expand-wrapper >}}
{{% expand "View example output" %}}
```sh
Using manifest: /path/to/full-backup/20230101T00000Z.manifest
Restoring meta data... Done. Restored in 9.585639ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 2...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 2 in 48.095082ms, 569344 bytes transferred
Restored from my-full-backup in 58.58301ms, transferred 569344 bytes
```
{{% /expand %}}
{{< /expand-wrapper >}}

### Restore from an incremental backup

In this example, the `restore` command restores an incremental backup stored in the `my-incremental-backup/` directory.

```sh
influxd-ctl restore /path/to/incremental-backup/
```

{{< expand-wrapper >}}
{{% expand "View example output" "1" %}}
```sh
Using backup directory: /path/to/incremental-backup/
Using meta backup: 20230101T00000Z.meta
Restoring meta data... Done. Restored in 21.373019ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 2...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 2 in 61.046571ms, 588800 bytes transferred
Restored from my-incremental-backup/ in 83.892591ms, transferred 588800 bytes
```
{{% /expand %}}
{{< /expand-wrapper >}}

### Restore from a metadata backup

In this example, the `restore` command restores an metadata backup stored
in the `metadata-backup/` directory.

```sh
influxd-ctl restore /path/to/metadata-backup/
```

{{< expand-wrapper >}}
{{% expand "View example output" "2" %}}
```sh
Using backup directory: /path/to/metadata-backup/
Using meta backup: 20230101T00000Z.meta
Restoring meta data... Done. Restored in 21.373019ms, 1 shards mapped
Restored from my-incremental-backup/ in 19.2311ms, transferred 588 bytes
```{{% /expand %}}
{{< /expand-wrapper >}}
