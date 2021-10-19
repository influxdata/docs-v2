---
title: influxd inspect compact-series-file
description: >
  The `influxd inspect compact-series-file` command compacts the series file by
  removing deleted series.
influxdb/v2.1/tags: [inspect]
menu:
  influxdb_2_1_ref:
    parent: influxd inspect
weight: 301
draft: true
---

The `influxd inspect compact-series-file` command compacts the [series file](/influxdb/v2.1/reference/glossary/#series-file)
by removing deleted series.

## Usage
```sh
influxd inspect compact-series-file [flags]
```

## Flags
| Flag |                | Description                                                                   | Input Type |
|:---- |:---            |:-----------                                                                   |:----------:|
|      |`--concurrency` | Number of workers to dedicate to compaction (default = `GOMAXPROCS`, max `8`) | integer    |
| `-h` | `--help`       | Help for the `compact-series-file` command                                    |            |
|      | `--sfile-path` | Path to the series file directory (default: `~/.influxdbv2/engine/_series`)   | string     |
|      | `--tsi-path`   | Path to the TSI index directory (default: `~/.influxdbv2/engine/index`)       | string     |
