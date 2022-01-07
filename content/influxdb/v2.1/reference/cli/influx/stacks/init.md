---
title: influx stacks init
description: The `influx stacks init` command initializes an InfluxDB stack.
menu:
  influxdb_2_1_ref:
    name: influx stacks init
    parent: influx stacks
weight: 201
aliases:
  - /influxdb/v2.1/reference/cli/influx/pkg/stack/init/
influxdb/v2.1/tags: [templates]
---

The `influx stacks init` command initializes an InfluxDB stack.

## Usage
```
influx stacks init [flags]
```

## Flags
| Flag |                       | Description                                                           | Input type      | {{< cli/mapped >}}    |
|:-----|:----------------------|:----------------------------------------------------------------------|:---------------:|:----------------------|
| `-c` | `--active-config`     | CLI configuration to use for command                                  | string          |                       |
|      | `--configs-path`      | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string          | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`              | Help for the `init` command                                           |                 |                       |
|      | `--hide-headers`      | Hide table headers (default `false`)                                  |                 | `INFLUX_HIDE_HEADERS` |
|      | `--host`              | HTTP address of InfluxDB (default `http://localhost:8086`)            | string          | `INFLUX_HOST`         |
|      | `--http-debug`        | Inspect communication with InfluxDB servers.                          | string          |                       |
|      | `--json`              | Output data as JSON (default `false`)                                 |                 | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`               | Organization name (mutually exclusive with `--org-id`)                | string          | `INFLUX_ORG`          |
|      | `--org-id`            | Organization ID (mutually exclusive with `--org`)                     | string          | `INFLUX_ORG_ID`       |
|      | `--skip-verify`       | Skip TLS certificate verification                                     |                 | `INFLUX_SKIP_VERIFY`  |
| `-d` | `--stack-description` | Stack description                                                     | string          |                       |
| `-n` | `--stack-name`        | Stack name                                                            | string          |                       |
| `-u` | `--template-url`      | Template URLs to associate with a stack                               | list of strings |                       |
| `-t` | `--token`             | API token                                                             | string          | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### Initialize a stack with a name and description

```sh
influx stack init -n "Example Stack" -d "InfluxDB stack for monitoring some awesome stuff"
```

##### Initialize a stack with a name and URLs to associate with the stack

```sh
influx stack init -n "Example Stack" -u https://example.com/template-1.yml
```
