---
title: influxd inspect verify-seriesfile
description: >
  The `influxd inspect verify-seriesfile` command verifies the integrity of series files.
influxdb/v2.1/tags: [inspect]
menu:
  influxdb_2_1_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect verify-seriesfile` command verifies the integrity of series files.

## Usage
```sh
influxd inspect verify-seriesfile [flags]
```

## Flags
| Flag |                 | Description                                                                                   | Input Type |
| :--- | :-------------- | :-------------------------------------------------------------------------------------------- | :--------: |
|      | `--bucket-id`   | Verify series files from a specific bucket.                                              |   string   |
| `-c` | `--concurrency` | Number of workers to run concurrently (defaults to the number of available processing units). |  integer   |
|      | `--data-path`   | Path to data directory (defaults to `~/.influxdbv2/engine/data`).                             |   string   |
| `-h` | `--help`        | Help for the `verify-seriesfile` command.                                                     |            |
|      | `--series-path` | Path to series file (overrides `--data-path` and `--bucket-id`).                              |   string   |
| `-v` | `--verbose`     | Enable verbose output.                                                                        |            |
