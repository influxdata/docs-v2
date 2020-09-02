---
title: influx backup
description: The `influx backup` command backs up data stored in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx backup
    parent: influx
weight: 101
influxdb/v2.0/tags: [backup]
related:
  - /influxdb/v2.0/backup-restore/backup/
---

The `influx backup` command backs up data stored in InfluxDB.

## Usage
```
influx backup [flags]
```

## Flags
| Flag |                  | Description                                                           | Input type | {{< cli/mapped >}}   |
|:---- |:---              |:-----------                                                           |:----------:|:------------------   |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     |`INFLUX_CONFIGS_PATH` |
| `-h` | `--help`         | Help for the `backup` command                                         |            |                      |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`)            | string     | `INFLUX_HOST`        |
| `-p` | `--path`         | Directory path to write backup files to                               | string     | `INFLUX_PATH`        |
|      | `--skip-verify`  | Skip TLS certificate verification                                     |            |                      |
| `-t` | `--token`        | Authentication token                                                  | string     | `INFLUX_TOKEN`       |
