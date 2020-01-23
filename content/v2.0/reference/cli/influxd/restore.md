---
title: influxd restore
description: The `influxd restore` command restores data and metadata from an InfluxDB backup file set.
v2.0/tags: [restore]
menu:
  v2_0_ref:
    parent: influxd
weight: 201
---

The `influxd restore` command restores data and metadata from an InfluxDB backup file set.

{{% warn %}}
Shut down `influxd` server before restoring data.
{{% /warn %}}

### The restore process
When restoring data from a backup file set, InfluxDB temporarily moves existing
data and metadata while `restore` runs.
After `restore` completes, the temporary data is deleted.

By default, `restore` rebuilds the index and series file using the default options
for [`influxd inspect build-tsi`](/v2.0/reference/cli/influxd/inspect/build-tsi/).
To customize the [`build-tsi` performance options](/v2.0/reference/cli/influxd/inspect/build-tsi/#adjust-performance),
include `--rebuild-index false` with `influxd restore`, then manually run `influxd inspect build-tsi`.

## Usage

```
influxd restore [flags]
```

## Flags

| Flag                 | Description                                                                            | Input type |
|:----                 |:-----------                                                                            |:----------:|
| `--bolt-path`        | Path to target boltdb database (default is `~/.influxdbv2/influxd.bolt`)               | string     |
| `--engine-path`      | Path to target persistent engine files (default is `~/.influxdbv2/engine`)             | string     |
| `--credentials-path` | Path to target persistent credentials files (default is `~/.influxdbv2/credentials`)   | string     |
| `--backup-path`      | Path to backup files                                                                   | string     |
| `--rebuild-index`    | Rebuild the TSI index and series file based on the `--engine-path` (default is `true`) |            |
| `-h`, `--help`       | Help for `restore`                                                                     |            |
