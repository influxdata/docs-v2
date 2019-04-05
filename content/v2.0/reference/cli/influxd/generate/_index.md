---
title: influxd generate
description: >
  The `influxd generate` command generates time series data direct to disk using
  a schema defined in a TOML file.
v2.0/tags: [sample-data]
menu:
  v2_0_ref:
    parent: influxd
weight: 201
---

The `influxd generate` command generates time series data direct to disk using a schema defined in a TOML file.

{{% note %}}
#### Important notes
- The `influxd` server cannot not be running when using the `generate` tool.
  It modifies the index and Time-Structured Merge Tree (TSM) data.
- This tool is intended for development and testing purposes only and
  **should not** be run on a production server.
{{% /note %}}

## Usage
```sh
influxd generate <schema.toml> [flags]
influxd generate [subcommand]
```

## Subcommands
| Subcommand                                                      | Description                                             |
|:-------                                                         |:-----------                                             |
| [help-schema](/v2.0/reference/cli/influxd/generate/help-schema) | Print a documented example TOML schema to stdout.       |
| [simple](/v2.0/reference/cli/influxd/generate/simple)           | Generate simple data sets using defaults and CLI flags. |

## Flags
| Flag           | Description                                                               | Input Type |
|:----           |:-----------                                                               |:----------:|
| `--print`      | Print data spec and exit                                                  |            |
| `--org`        | Name of organization                                                      | string     |
| `--bucket`     | Name of bucket                                                            | string     |
| `--start-time` | Start time (`YYYY-MM-DDT00:00:00Z`) (default is 00:00:00 of one week ago) | string     |
| `--end-time`   | End time (`YYYY-MM-DDT00:00:00Z`) (default is 00:00:00 of current day)    | string     |
| `--clean`      | Clean time series data files (`none`, `tsm` or `all`) (default `none`)    | string     |
| `--cpuprofile` | Collect a CPU profile                                                     | string     |
| `--memprofile` | Collect a memory profile                                                  | string     |
| `-h`, `--help` | Help for `generate`                                                       |            |
