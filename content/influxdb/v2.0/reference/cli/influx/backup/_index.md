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
| Flag |                   | Description                                                 | Input type | {{< cli/mapped >}} |
|------|-------------------|-------------------------------------------------------------|------------|--------------------|
| `-c` | `--active-config` | CLI configuration to use for command                        | string     |                    |
|      | `--bucket-id`     | ID of the bucket to back up from                            | string     |                    |
| `-b` | `--bucket`        | Name of the bucket to back up from                          | string     |                    |
| `-h` | `--help`          | Help for the `backup` command                               |            |                    |
|      | `--host`          | HTTP address of InfluxDB (default: `http://localhost:8086`) | string     | `INFLUX_HOST`      |
|      | `--skip-verify`   | Skip TLS certificate verification                           | string     |                    |
| `-t` | `--token`         | Authentication token                                        | string     | `INFLUX_TOKEN`     |
