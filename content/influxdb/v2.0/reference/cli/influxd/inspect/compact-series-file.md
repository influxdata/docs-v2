---
title: influxd inspect compact-series-file
description: >
  The `influxd inspect compact-series-file` command compacts the series file by
  removing deleted series.
v2.0/tags: [inspect]
menu:
  v2_0_ref:
    parent: influxd inspect
weight: 301
aliases:
  - /v2.0/reference/cli/influxd/inspect/compact-series-file/
products: [oss]
---

The `influxd inspect compact-series-file` command compacts the [series file](/v2.0/reference/glossary/#series-file)
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
