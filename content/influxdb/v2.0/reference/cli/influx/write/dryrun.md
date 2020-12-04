---
title: influx write dryrun
description: >
  The `influx write dryrun` command prints write output to stdout instead of writing
  to InfluxDB. Use this command to test writing data.
menu:
  influxdb_2_0_ref:
    name: influx write dryrun
    parent: influx write
weight: 101
influxdb/v2.0/tags: [write]
related:
  - /influxdb/v2.0/write-data/
  - /influxdb/v2.0/write-data/developer-tools/csv/
  - /influxdb/v2.0/reference/syntax/line-protocol/
  - /influxdb/v2.0/reference/syntax/annotated-csv/
  - /influxdb/v2.0/reference/syntax/annotated-csv/extended/
---

The `influx write dryrun` command prints write output to stdout instead of writing
to InfluxDB. Use this command to test writing data.

Supports [line protocol](/influxdb/v2.0/reference/syntax/line-protocol),
[annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv), and
[extended annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/extended).
Output is always **line protocol**.

## Usage
```
influx write dryrun [flags]
```

## Flags
| Flag |                    | Description                                                           | Input type | {{< cli/mapped >}}   |
|:---- |:---                |:-----------                                                           |:----------:|:------------------   |
| `-c` | `--active-config`  | CLI configuration to use for command                                  | string     |                      |
| `-b` | `--bucket`         | Bucket name                                                           | string     | `INFLUX_BUCKET_NAME` |
|      | `--bucket-id`      | Bucket ID                                                             | string     | `INFLUX_BUCKET_ID`   |
|      | `--configs-path`   | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     |`INFLUX_CONFIGS_PATH` |
|      | `--debug`          | Output errors to stderr                                               |            |                      |
|      | `--encoding`       | Character encoding of input (default `UTF-8`)                         | string     |                      |
| `-f` | `--file`           | File to import                                                        | string     |                      |
|      | `--format`         | Input format (`lp` or `csv`, default `lp`)                            | string     |                      |
|      | `--header`         | Prepend header line to CSV input data                                 | string     |                      |
| `-h` | `--help`           | Help for the `dryrun` command                                         |            |                      |
|      | `--host`           | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`        |
| `-o` | `--org`            | Organization name                                                     | string     | `INFLUX_ORG`         |
|      | `--org-id`         | Organization ID                                                       | string     | `INFLUX_ORG_ID`      |
| `-p` | `--precision`      | Precision of the timestamps (default `ns`)                            | string     | `INFLUX_PRECISION`   |
|      | `--skipHeader`     | Skip first n rows of input data                                       | integer    |                      |
|      | `--skipRowOnError` | Output CSV errors to stderr, but continue processing                  |            |                      |
|      | `--skip-verify`    | Skip TLS certificate verification                                     |            |                      |
| `-t` | `--token`          | Authentication token                                                  | string     | `INFLUX_TOKEN`       |
| `-u` | `--url`            | URL to import data from                                               | string     |                      |
