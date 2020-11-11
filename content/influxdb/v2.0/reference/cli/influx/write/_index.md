---
title: influx write
description: >
  The `influx write` command writes data to InfluxDB via stdin or from a specified file.
  Write data using line protocol or annotated CSV.
menu:
  influxdb_2_0_ref:
    name: influx write
    parent: influx
weight: 101
influxdb/v2.0/tags: [write]
related:
  - /influxdb/v2.0/write-data/
  - /influxdb/v2.0/write-data/csv/
---

The `influx write` command writes data to InfluxDB via stdin or from a specified file.
Write data using [line protocol](/influxdb/v2.0/reference/syntax/line-protocol) or
[annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv).

## Usage
```
influx write [flags]
influx write [command]
```

## Subcommands
| Subcommand                                                 | Description                         |
|:----------                                                 |:-----------                         |
| [dryrun](/influxdb/v2.0/reference/cli/influx/write/dryrun) | Write to stdout instead of InfluxDB |

## Flags
| Flag |                     | Description                                                                     | Input type | {{< cli/mapped >}}    |
|:-----|:--------------------|:--------------------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config`   | CLI configuration to use for command                                            | string     |                       |
| `-b` | `--bucket`          | Bucket name                                                                     | string     | `INFLUX_BUCKET_NAME`  |
|      | `--bucket-id`       | Bucket ID                                                                       | string     | `INFLUX_BUCKET_ID`    |
|      | `--configs-path`    | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)           | string     | `INFLUX_CONFIGS_PATH` |
|      | `--debug`           | Output errors to stderr                                                         |            |                       |
|      | `--encoding`        | Character encoding of input (default `UTF-8`)                                   | string     |                       |
|      | `--error-file`      | Path to a file used for recording rejected row errors                           | string     |                       |
| `-f` | `--file`            | File to import                                                                  | string     |                       |
|      | `--format`          | Input format (`lp` or `csv`, default `lp`)                                      | string     |                       |
|      | `--header`          | Prepend header line to CSV input data                                           | string     |                       |
| `-h` | `--help`            | Help for the `dryrun` command                                                   |            |                       |
|      | `--host`            | HTTP address of InfluxDB (default `http://localhost:9999`)                      | string     | `INFLUX_HOST`         |
|      | `--max-line-length` | Maximum number of bytes that can be read for a single line (default `16000000`) | integer    |                       |
| `-o` | `--org`             | Organization name                                                               | string     | `INFLUX_ORG`          |
|      | `--org-id`          | Organization ID                                                                 | string     | `INFLUX_ORG_ID`       |
| `-p` | `--precision`       | Precision of the timestamps (default `ns`)                                      | string     | `INFLUX_PRECISION`    |
|      | `--rate-limit`      | Throttle write rate (examples: `5 MB / 5 min` or `1MB/s`).                      | string     |                       |
|      | `--skipHeader`      | Skip first *n* rows of input data                                               | integer    |                       |
|      | `--skipRowOnError`  | Output CSV errors to stderr, but continue processing                            |            |                       |
|      | `--skip-verify`     | Skip TLS certificate verification                                               |            |                       |
| `-t` | `--token`           | Authentication token                                                            | string     | `INFLUX_TOKEN`        |
| `-u` | `--url`             | URL to import data from                                                         | string     |                       |
