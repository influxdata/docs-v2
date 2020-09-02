---
title: influx stacks remove
description: The `influx stacks remove` command removes an InfluxDB stack and all associated resources.
menu:
  influxdb_2_0_ref:
    name: influx stacks remove
    parent: influx stacks
weight: 201
aliases:
  - /v2.0/reference/cli/influx/pkg/stack/remove/
influxdb/v2.0/tags: [templates]
---

The `influx stacks remove` command removes an InfluxDB stack and all associated resources.

## Usage
```
influx stacks remove [flags]
```

#### Aliases
`remove`, `rm`, `uninstall`

## Flags
| Flag |                  | Description                                                           | Input type      | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                           |:----------:     |:------------------    |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string          |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`         | Help for the `remove` command                                         |                 |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                                  |                 | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`)            | string          | `INFLUX_HOST`         |
|      | `--json`         | Output data as JSON (default `false`)                                 |                 | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`          | Organization name                                                     | string          | `INFLUX_ORG`          |
|      | `--org-id`       | Organization ID                                                       | string          | `INFLUX_ORG_ID`       |
|      | `--skip-verify`  | Skip TLS certificate verification                                     |                 |                       |
|      | `--stack-id`     | Stack IDs to remove                                                   | list of strings |                       |
| `-t` | `--token`        | Authentication token                                                  | string          | `INFLUX_TOKEN`        |
