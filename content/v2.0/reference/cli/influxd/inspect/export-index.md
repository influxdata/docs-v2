---
title: influxd inspect export-index
description: >
  The `influxd inspect export-index` command exports all series in a TSI index to
  SQL format for inspection and debugging.
v2.0/tags: [inspect]
menu:
  v2_0_ref:
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
| Flag            | Description                                                            | Input type |
|:----            |:-----------                                                            |:----------:|
| `-h`, `--help`  | Help for `export-index`.                                               |            |
| `--index-path`  | Path to the index directory (defaults to `~/.influxdbv2/engine/index`) | string     |
| `--series-path` | Path to series file (defaults to `~/.influxdbv2/engine/_series`)       | string     |
