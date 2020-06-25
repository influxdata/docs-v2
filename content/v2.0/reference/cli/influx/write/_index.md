---
title: influx write
description: >
  The `influx write` command writes data to InfluxDB via stdin or from a specified file.
  Write data using line protocol or annotated CSV.
menu:
  v2_0_ref:
    name: influx write
    parent: influx
weight: 101
v2.0/tags: [write]
related:
  - /v2.0/write-data/
  - /v2.0/write-data/csv/
---

The `influx write` command writes data to InfluxDB via stdin or from a specified file.
Write data using [line protocol](/v2.0/reference/syntax/line-protocol) or
[annotated CSV](/v2.0/reference/syntax/annotated-csv).

## Usage
```
influx write [flags]
influx write [command]
```

## Subcommands
| Subcommand                                        | Description                         |
|:----------                                        |:-----------                         |
| [dryrun](/v2.0/reference/cli/influx/write/dryrun) | Write to stdout instead of InfluxDB |

## Flags
| Flag |                    | Description                                                | Input type | {{< cli/mapped >}}   |
|:---- |:---                |:-----------                                                |:----------:|:------------------   |
| `-b` | `--bucket`         | Bucket name                                                | string     | `INFLUX_BUCKET_NAME` |
|      | `--bucket-id`      | Bucket ID                                                  | string     | `INFLUX_BUCKET_ID`   |
|      | `--debug`          | Output errors to stderr                                    |            |                      |
|      | `--encoding`       | Character encoding of input (default `UTF-8`)              | string     |                      |
| `-f` | `--file`           | File to import                                             | string     |                      |
|      | `--format`         | Input format (`lp` or `csv`, default `lp`)                 | string     |                      |
|      | `--header`         | Prepend header line to CSV input data                      | string     |                      |
| `-h` | `--help`           | Help for the `dryrun` command                              |            |                      |
|      | `--host`           | HTTP address of InfluxDB (default `http://localhost:9999`) | string     | `INFLUX_HOST`        |
| `-o` | `--org`            | Organization name                                          | string     | `INFLUX_ORG`         |
|      | `--org-id`         | Organization ID                                            | string     | `INFLUX_ORG_ID`      |
| `-p` | `--precision`      | Precision of the timestamps (default `ns`)                 | string     | `INFLUX_PRECISION`   |
|      | `--skipHeader`     | Skip first n rows of input data                            | integer    |                      |
|      | `--skipRowOnError` | Output CSV errors to stderr, but continue processing       |            |                      |
|      | `--skip-verify`    | Skip TLS certificate verification                          |            |                      |
| `-t` | `--token`          | Authentication token                                       | string     | `INFLUX_TOKEN`       |
| `-u` | `--url`            | URL to import data from                                    | string     |                      |
