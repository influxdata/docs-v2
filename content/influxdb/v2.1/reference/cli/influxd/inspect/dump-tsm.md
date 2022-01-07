---
title: influxd inspect dump-tsm
description: >
  The `influxd inspect dump-tsm` command outputs low-level information about `tsi1` files.
influxdb/v2.1/tags: [tsm, inspect]
menu:
  influxdb_2_1_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect dump-tsm` command outputs low-level information about
Time Series Merge Tree (`tsm1`) files.

## Usage
```sh
influxd inspect dump-tsm [flags]
```

## Flags
| Flag |                | Description                                    | Input Type |
| :--- | :------------- | :--------------------------------------------- | :--------: |
|      | `--all`        | Output all TSM data {{< req " \*" >}}          |            |
|      | `--blocks`     | Output raw block data.                         |            |
|      | `--file-path`  | Path to TSM file.                              |   string   |
|      | `--filter-key` | Only display data matching this key substring. |   string   |
| `-h` | `--help`       | Help for `dump-tsm`.                           |            |
|      | `--index`      | Dump raw index data.                           |            |

_{{< req "\*" >}} Using the `--all` flag may print a significant amount of information._
