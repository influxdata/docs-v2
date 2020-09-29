---
title: influxd generate
description: >
  The `influxd generate` command generates time series data direct to disk using
  a schema defined in a TOML file.
influxdb/v2.0/tags: [sample-data]
menu:
  influxdb_2_0_ref:
    parent: influxd
weight: 201
products: [oss]
---

The `influxd generate` command generates time series data direct to disk using a schema defined in a TOML file.

{{% note %}}
#### Important notes
- `influxd generate` cannot run while the `influxd` server is running.
  The `generate` command modifies index and Time-Structured Merge Tree (TSM) data.
- Use `influxd generate` for **development and testing purposes only**.
  Do not run it on a production server.
{{% /note %}}

## Usage
```sh
influxd generate <schema.toml> [flags]
influxd generate [subcommand]
```

## Subcommands
| Subcommand                                                      | Description                                             |
|:-------                                                         |:-----------                                             |
| [help-schema](/influxdb/v2.0/reference/cli/influxd/generate/help-schema) | Print a documented example TOML schema to stdout.       |
| [simple](/influxdb/v2.0/reference/cli/influxd/generate/simple)           | Generate simple data sets using defaults and CLI flags. |

## Flags
| Flag |                | Description                                                               | Input Type |
|:---- |:---            |:-----------                                                               |:----------:|
|      | `--print`      | Print data spec and exit                                                  |            |
|      | `--org`        | Organiztion name                                                          | string     |
|      | `--bucket`     | Bucket Name                                                               | string     |
|      | `--start-time` | Start time (`YYYY-MM-DDT00:00:00Z`) (default is 00:00:00 of one week ago) | string     |
|      | `--end-time`   | End time (`YYYY-MM-DDT00:00:00Z`) (default is 00:00:00 of current day)    | string     |
|      | `--clean`      | Clean time series data files (`none`, `tsm` or `all`) (default `none`)    | string     |
|      | `--cpuprofile` | Collect a CPU profile                                                     | string     |
|      | `--memprofile` | Collect a memory profile                                                  | string     |
| `-h` | `--help`       | Help for the `generate` command                                           |            |
