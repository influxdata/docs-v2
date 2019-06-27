---
title: influxd inspect
description: The `influxd inspect` commands and subcommands inspecting on-disk InfluxDB time series data.
v2.0/tags: [inspect]
menu:
  v2_0_ref:
    parent: influxd
weight: 201
---

The `influxd inspect` commands and subcommands inspecting on-disk InfluxDB time series data.

## Usage
```sh
influxd inspect [command]
```

## Subcommands
| Subcommand                                                    | Description                 |
|:----------                                                    |:-----------                 |
| [report-tsm](/v2.0/reference/cli/influxd/inspect/report-tsm/) | Run TSM report              |
| [verify-wal](/v2.0/reference/cli/influxd/inspect/verify-wal/) | Check for corrupt WAL files |

## Flags
| Flag           | Description      |
|:----           |:-----------      |
| `-h`, `--help` | help for inspect |
