---
title: influxd inspect report-tsi
description: >
  The `influxd inspect report-tsi` command analyzes Time Series Index (TSI) files
  in a storage directory and reports the cardinality of data stored in the files.
influxdb/v2.1/tags: [tsi, cardinality, inspect]
menu:
  influxdb_2_1_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect report-tsi` command analyzes Time Series Index (TSI) within
a specified bucket and reports the cardinality of data stored in the bucket
segmented by shard and measurement.

## Usage
```sh
influxd inspect report-tsi [flags]
```

## Flags
| Flag  |                  | Description                                                                                  | Input Type |
| :---- | :--------------- | :------------------------------------------------------------------------------------------- | :--------: |
| `-b`  | `--bucket-id`    | ({{< req >}}) Process data for specified bucket ID.                                          |   string   |
| `-c ` | `--concurrency`  | Number of workers to run concurrently (default is the number of available processing units). |  integer   |
|       | `--data-path`    | Path to data directory (default `~/.influxdbv2/engine/data`).                                |   string   |
| `-h`  | `--help`         | View Help for the `report-tsi` command.                                                      |            |
| `-t`  | `-top`           | Limit results to the top n.                                                                  |  integer   |
