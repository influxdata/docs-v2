---
title: influx stacks
description: >
  The `influx stacks` command and its subcommands list and manage InfluxDB stacks
  and associated resources.
menu:
  influxdb_2_0_ref:
    name: influx stacks
    parent: influx
weight: 101
aliases:
  - /influxdb/v2.0/reference/cli/influx/pkg/stack/list/
influxdb/v2.0/tags: [templates]
---

The `influx stacks` command and its subcommands list and manage InfluxDB stacks
and associated resources.

## Usage
```
influx stacks [flags]
influx stacks [command]
```

## Subcommands
| Subcommand                                                   | Description        |
|:-------                                                      |:-----------        |
| [init](/influxdb/v2.0/reference/cli/influx/stacks/init/)     | Initialize a stack |
| [remove](/influxdb/v2.0/reference/cli/influx/stacks/remove/) | Remove a stack     |

## Flags
| Flag |                   | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---               |:-----------                                                           |:----------: |:------------------    |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string      |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`          | Help for the `stacks` command                                         |             |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string      | `INFLUX_HOST`         |
|      | `--json`          | Output data as JSON (default `false`)                                 |             | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`           | Organization name                                                     | string      | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID                                                       | string      | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |             |                       |
|      | `--stack-id`      | Stack IDs to filter by                                                | stringArray |                       |
|      | `--stack-name`    | Stack names to filter by                                              | stringArray |                       |
| `-t` | `--token`         | Authentication token                                                  | string      | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

- [List all stacks](#list-all-stacks)
- [Filter stacks by name](#filter-stacks-by-name)
- [Filter stacks by ID](#filter-stacks-by-id)

##### List all stacks
```sh
influx stacks
```

##### Filter stacks by name
```sh
influx stacks \
  --stack-name stack1 \
  --stack-name stack2
```

##### Filter stacks by ID
```sh
influx stacks \
  --stack-id 0Xx0oox00XXoxxoo1 \
  --stack-id 0Xx0oox00XXoxxoo2
```
