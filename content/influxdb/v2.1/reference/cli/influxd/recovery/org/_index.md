---
title: influxd recovery org
description: >
  The `influxd recovery org` command and subcommands manage on-disk organization 
  data for recovery purposes.
menu:
  influxdb_2_1_ref:
    parent: influxd recovery
weight: 301
---

The `influxd recovery org` command and subcommands manage on-disk organization 
data for recovery purposes.

## Usage
```sh
influxd recovery org [flags]
influxd recovery org [command]
```

## Subcommands
| Subcommand                                                          | Description        |
| :------------------------------------------------------------------ | :----------------- |
| [create](/influxdb/v2.1/reference/cli/influxd/recovery/org/create/) | Create new org     |
| [list](/influxdb/v2.1/reference/cli/influxd/recovery/org/list/)     | List organizations |

## Flags
| Flag |          | Description    |
| :--- | :------- | :------------- |
| `-h` | `--help` | Help for `org` |