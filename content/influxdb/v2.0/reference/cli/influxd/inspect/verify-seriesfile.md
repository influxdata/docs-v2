---
title: influxd inspect verify-seriesfile
description: >
  The `influxd inspect verify-seriesfile` command verifies the integrity of series files.
influxdb/v2.0/tags: [inspect]
menu:
  influxdb_2_0_ref:
    parent: influxd inspect
weight: 301
draft: true
---

The `influxd inspect verify-seriesfile` command verifies the integrity of series files.

## Usage
```sh
influxd inspect verify-seriesfile [flags]
```

## Flags
| Flag |                | Description                                                       | Input Type |
|:---- |:---            |:-----------                                                       |:----------:|
| `-c` | `--c`          | Number of workers to run concurrently (defaults to 8).            | integer    |
| `-h` | `--help`       | Help for the `verify-seriesfile` command.                         |            |
|      |`--series-file` | Path to series file (defaults to `~/.influxdbv2/engine/_series`). | string     |
| `-v` | `--verbose`    | Enable verbose output.                                            |            |
