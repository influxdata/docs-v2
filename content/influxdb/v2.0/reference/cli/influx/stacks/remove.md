---
title: influx stacks remove
description: The `influx stacks remove` command removes an InfluxDB stack and all associated resources.
menu:
  influxdb_2_0_ref:
    name: influx stacks remove
    parent: influx stacks
weight: 201
aliases:
  - /influxdb/v2.0/reference/cli/influx/pkg/stack/remove/
influxdb/v2.0/tags: [templates]
---

The `influx stacks remove` command removes an InfluxDB stack and all associated resources.

## Usage
```
influx stacks remove [flags]
```

#### Command aliases
`remove`, `rm`, `uninstall`

## Flags
| Flag |                   | Description                                                           | Input type      | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:---------------:|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string          |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string          | `INFLUX_CONFIGS_PATH` |
|      | `--force`         | Skip confirmation prompt.                                             |                 |                       |
| `-h` | `--help`          | Help for the `remove` command                                         |                 |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |                 | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string          | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string          |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |                 | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                | string          | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                     | string          | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |                 | `INFLUX_SKIP_VERIFY`  |
|      | `--stack-id`      | Stack IDs to remove                                                   | list of strings |                       |
| `-t` | `--token`         | API token                                                             | string          | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### Remove a stack and all of its associated resources
```sh
influx stacks remove --stack-id 0Xx0oox00XXoxxoo1
```
