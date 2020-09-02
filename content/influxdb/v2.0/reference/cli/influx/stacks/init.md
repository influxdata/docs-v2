---
title: influx stacks init
description: The `influx stacks init` command initializes an InfluxDB stack.
menu:
  influxdb_2_0_ref:
    name: influx stacks init
    parent: influx stacks
weight: 201
aliases:
  - /influxdb/v2.0/reference/cli/influx/pkg/stack/init/
influxdb/v2.0/tags: [templates]
---

The `influx stacks init` command initializes an InfluxDB stack.

## Usage
```
influx stacks init [flags]
```

## Flags
| Flag |                       | Description                                                           | Input type      | {{< cli/mapped >}}    |
|:---- |:---                   |:-----------                                                           |:----------:     |:------------------    |
|      | `--configs-path`      | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string          |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`              | Help for the `init` command                                           |                 |                       |
|      | `--hide-headers`      | Hide table headers (default `false`)                                  |                 | `INFLUX_HIDE_HEADERS` |
|      | `--host`              | HTTP address of InfluxDB (default `http://localhost:9999`)            | string          | `INFLUX_HOST`         |
|      | `--json`              | Output data as JSON (default `false`)                                 |                 | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`               | Organization name                                                     | string          | `INFLUX_ORG`          |
|      | `--org-id`            | Organization ID                                                       | string          | `INFLUX_ORG_ID`       |
|      | `--skip-verify`       | Skip TLS certificate verification                                     |                 |                       |
| `-d` | `--stack-description` | Stack description                                                     | string          |                       |
| `-n` | `--stack-name`        | Stack name                                                            | string          |                       |
| `-u` | `--template-url`      | Template URLs to associate with a stack                               | list of strings |                       |
| `-t` | `--token`             | Authentication token                                                  | string          | `INFLUX_TOKEN`        |

## Examples
```sh
# Initialize a stack with a name and description
influx stack init -n $STACK_NAME -d $STACK_DESCRIPTION

# Initialize a stack with a name and urls to associate with stack.
influx stack init -n $STACK_NAME -u $PATH_TO_TEMPLATE
```
