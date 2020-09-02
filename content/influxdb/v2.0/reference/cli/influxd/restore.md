---
title: influxd restore
description: The `influxd restore` command restores backup data and metadata from an InfluxDB backup directory.
influxdb/v2.0/tags: [restore]
menu:
  influxdb_2_0_ref:
    parent: influxd
weight: 201
related:
  - /influxdb/v2.0/backup-restore/restore/
products: [oss]
---

The `influxd restore` command restores backup data and metadata from an InfluxDB backup directory.

{{% warn %}}
Shut down the `influxd` server before restoring data.
{{% /warn %}}

### The restore process
When restoring data from a backup file set, InfluxDB temporarily moves existing
data and metadata while `restore` runs.
After `restore` completes, the temporary data is deleted.
If the restore process fails, InfluxDB preserves the data in the temporary location.

_For information about recovering from a failed restore process, see
[Restore data](/influxdb/v2.0/backup-restore/restore/#recover-from-a-failed-restore)._

By default, `restore` rebuilds the index and series file using the default options
for [`influxd inspect build-tsi`](/influxdb/v2.0/reference/cli/influxd/inspect/build-tsi/).
To customize the [`build-tsi` performance options](/influxdb/v2.0/reference/cli/influxd/inspect/build-tsi/#adjust-performance),
include `--rebuild-index false` with `influxd restore`, then manually run `influxd inspect build-tsi`.

## Usage

```
influxd restore [flags]
```

## Flags

| Flag |                      | Description                                                                            | Input type |
|:---- |:---                  |:-----------                                                                            |:----------:|
|      | `--bolt-path`        | Path to target boltdb database (default is `~/.influxdbv2/influxd.bolt`)               | string     |
|      | `--engine-path`      | Path to target persistent engine files (default is `~/.influxdbv2/engine`)             | string     |
|      | `--credentials-path` | Path to target persistent credentials files (default is `~/.influxdbv2/credentials`)   | string     |
|      | `--backup-path`      | Path to backup files                                                                   | string     |
|      | `--rebuild-index`    | Rebuild the TSI index and series file based on the `--engine-path` (default is `true`) |            |
| `-h` | `--help`             | Help for the `restore` command                                                         |            |
