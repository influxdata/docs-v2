---
title: influxd inspect export-index
description: >
  The `influxd inspect export-index` command exports all series in a TSI index to
  SQL format for inspection and debugging.
influxdb/v2/tags: [inspect]
menu:
  influxdb_v2:
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
| Flag |                 | Description                                                                                                               | Input type |
| :--- | :-------------- | :------------------------------------------------------------------------------------------------------------------------ | :--------: |
| `-h` | `--help`        | Help for the `export-index` command.                                                                                      |            |
|      | `--index-path`  | Path to the [`index` directory](/influxdb/v2/reference/internals/file-system-layout/#tsm-directories-and-files-layout).   |   string   |
|      | `--series-path` | Path to the [`_series` directory](/influxdb/v2/reference/internals/file-system-layout/#tsm-directories-and-files-layout). |   string   |
