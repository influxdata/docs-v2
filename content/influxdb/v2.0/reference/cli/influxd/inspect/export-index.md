---
title: influxd inspect export-index
description: >
  The `influxd inspect export-index` command exports all series in a TSI index to
  SQL format for inspection and debugging.
influxdb/v2.0/tags: [inspect]
menu:
  influxdb_2_0_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect export-index` command exports all series in a TSI index to
SQL format for inspection and debugging.

## Usage
```sh
influxd inspect export-index [flags]
```

## Flags
| Flag |                | Description                                                             | Input type |
|:---- |:---            |:-----------                                                             |:----------:|
| `-h` | `--help`       | Help for the `export-index` command.                                    |            |
|      |`--index-path`  | Path to the index directory. Defaults to `~/.influxdbv2/engine/index`). | string     |
|      |`--series-path` | Path to series file. Defaults to `~/.influxdbv2/engine/_series`).       | string     |
