---
title: influxd upgrade
description: The `influxd upgrade` command upgrades a InfluxdDB 1.x instance to 2.0.
menu:
  influxdb_2_0_ref:
    parent: influxd
weight: 201
products: [oss]
---

Use the `influxd upgrade` command to upgrade an instance of InfluxDB 1.x to InfluxDB 2.0.
This command copies all data in [databases](/influxdb/v1.8/concepts/glossary/#database) and
[retention policies](/influxdb/v1.8/concepts/glossary/#retention-policy-rp) (used in 1.x)
over to [buckets](/influxdb/v2.0/reference/glossary/#bucket) (used in 2.0).

{{% warn %}}
Be sure to back up all data before upgrading with `influx upgrade`.
{{% /warn %}}

This command performs the following actions:

1. Creates the InfluxDB 2.x configuration file using 1.x configuration file options.
   Unsupported 1.x options are reported to standard output.
   If the configuration file is not available, the 1.x database folder can be passed via th `--v1-dir` flag.
2. Copies and upgrades 1.x database files.

The target 2.x database directory is specified by the `--engine-path` option.
If changed, the bolt path can be specified by the `--bolt-path` option.

## Usage

```
influxd upgrade [flags]
influxd upgrade [command]
```

## Flags

| Flag |                                  | Description                                                                                                | Input type |
|:-----|:------------------------         |:-----------------------------------------------------------------------------------------------------------|:----------:|
| `-m` | `--bolt-path`                    | Path for boltdb database (default `~/.influxdbv2/influxd.bolt`)                                            | string     |
| `-b` | `--bucket`                       | Primary bucket name                                                                                        | string     |
|      | `--config-file`                  | Custom InfluxDB 1.x config file path (default `~/.influxdb/influxdb.conf`)                                 | string     |
|      | `--continuous-query-export-path` | Path for exported 1.x continuous queries (default `~/continuous_queries.txt`)                              | string     |
| `-e` | `--engine-path`                  | Path for persistent engine files (default `~/.influxdbv2/engine`)                                          | string     |
| `-f` | `--force`                        | Skip the confirmation prompt                                                                               |            |
| `-h` | `--help`                         | Help for `influxd upgrade`                                                                                 |            |
| `-c` | `--influx-configs-path`          | Path for 2.x `influx` CLI configurations file (default `~/.influxdbv2/configs`)                            |            |
|      | `--log-level`                    | Supported log levels are `debug`, `info`, `warn`, and `error` (default `info`)                             | string     |
|      | `--log-path`                     | Custom log file path (default `~/upgrade.log`)                                                             | string     |
| `-o` | `--org`                          | Primary organization name                                                                                  | string     |
|      | `--overwrite-existing-v2`        | Overwrite existing files at the output path instead of aborting the upgrade process                        |            |
| `-p` | `--password`                     | Password for username                                                                                      | string     |
| `-r` | `--retention`                    | Duration bucket will retain data (default `0`; retains data infinitely)                                    | string     |
| `-t` | `--token`                        | Token for username. If not specified, a token is auto-generated.                                           | string     |
| `-u` | `--username`                     | Primary username                                                                                           | string     |
|      | `--v1-dir`                       | Path to source 1.x `db` directory containing `meta`, `data`, and `wal` sub-folders (default `~/.influxdb`) | string     |
|      | `--v2-config-path`               | Destination path for upgraded 2.x configuration file (default `~/.influxdbv2/config.toml`)                 | string     |
| `-v` | `--verbose`                      | Verbose output                                                                                             |            |
