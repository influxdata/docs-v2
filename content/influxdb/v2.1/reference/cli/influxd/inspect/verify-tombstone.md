---
title: influxd inspect verify-tombstone
description: >
  The `influxd inspect verify-tombstone` command verifies the integrity of tombstone files.
influxdb/v2.1/tags: [inspect]
menu:
  influxdb_2_1_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect verify-tombstone` command verifies the integrity of tombstone files.

## Usage
```sh
influxd inspect verify-tombstone [flags]
```

## Flags
| Flag |                 | Description                                                          | Input Type |
| :--- | :-------------- | :------------------------------------------------------------------- | :--------: |
|      | `--engine-path` | Path to find tombstone files (defaults to `~/.influxdbv2/engine`).   |   string   |
| `-h` | `--help`        | Help for `verify-tombstone`.                                         |            |
| `-v` | `--verbose`     | Verbose output (emit periodic progress).                             |            |
|      | `--vv`          | Very verbose output (emit every tombstone entry key and time range). |            |
