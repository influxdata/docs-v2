---
title: influx backup
description: The `influx backup` command backs up data stored in InfluxDB to a specified directory.
menu:
  influxdb_2_0_ref:
    name: influx backup
    parent: influx
weight: 101
influxdb/v2.0/tags: [backup]
related:
  - /influxdb/v2.0/backup-restore/backup/
---

The `influx backup` command backs up data stored in InfluxDB to a specified directory.

## Usage
```
influx backup [flags] path
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|------|-------------------|-------------------------------------------------------------          |------------|--------------------   |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--bucket-id`     | ID of the bucket to back up from                                      | string     |                       |
| `-b` | `--bucket`        | Name of the bucket to back up from                                    | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`          | Help for the `backup` command                                         |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default: `http://localhost:8086`)           | string     | `INFLUX_HOST`         |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`           | Organization name                                                     | string     | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID                                                       | string     | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     | string     |                       |
| `-t` | `--token`         | Authentication token                                                  | string     | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

- [Back up all data to a directory](#back-up-all-data-to-a-directory)
- [Back up all data to the current working directory](#back-up-all-data-to-the-current-working-directory)
- [Back up a specific bucket to a directory](#back-up-a-specific-bucket-to-a-directory)

##### Back up all data to a directory
```sh
influx backup /path/to/backup/dir/
```

##### Back up all data to the current working directory
```sh
influx backup ./
```

##### Back up a specific bucket to a directory
```sh
influx backup --bucket example-bucket /path/to/backup/dir/
```