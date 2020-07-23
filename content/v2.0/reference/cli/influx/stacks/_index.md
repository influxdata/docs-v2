---
title: influx stacks
description: >
  The `influx stacks` command and its subcommands list and manage InfluxDB stacks
  and associated resources.
menu:
  v2_0_ref:
    name: influx stacks
    parent: influx
weight: 101
aliases:
  - /v2.0/reference/cli/influx/pkg/stack/list/
v2.0/tags: [templates]
---

The `influx stacks` command and its subcommands list and manage InfluxDB stacks
and associated resources.

## Usage
```
influx stacks [flags]
influx stacks [command]
```

## Subcommands
| Subcommand                                             | Description        |
|:-------                                                |:-----------        |
| [init](/v2.0/reference/cli/influx/stacks/init/)     | Initialize a stack |
| [remove](/v2.0/reference/cli/influx/stacks/remove/) | Remove a stack     |

## Flags
| Flag |                  | Description                                                           | Input type      | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                           |:----------:     |:------------------    |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string          |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`         | Help for the `stacks` command                                         |                 |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                                  |                 | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`)            | string          | `INFLUX_HOST`         |
|      | `--json`         | Output data as JSON (default `false`)                                 |                 | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`          | Organization name                                                     | string          | `INFLUX_ORG`          |
|      | `--org-id`       | Organization ID                                                       | string          | `INFLUX_ORG_ID`       |
|      | `--skip-verify`  | Skip TLS certificate verification                                     |                 |                       |
|      | `--stack-id`     | Stack IDs to filter by                                                | list of strings |                       |
|      | `--stack-name`   | Stack names to filter by                                              | list of strings |                       |
| `-t` | `--token`        | Authentication token                                                  | string          | `INFLUX_TOKEN`        |
