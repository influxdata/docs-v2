---
title: influx telegrafs
description: >
  The `influx telegrafs` command lists Telegraf configurations.
  Subcommands manage Telegraf configurations.
menu:
  influxdb_2_1_ref:
    name: influx telegrafs
    parent: influx
weight: 101
influxdb/v2.1/tags: [telegraf]
cascade:
  related:
    - /influxdb/v2.1/telegraf-configs/
    - /influxdb/v2.1/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
    - /influxdb/v2.1/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
  metadata: [influx CLI 2.0.0+, InfluxDB 2.0.0+]
---

The `influx telegrafs` command lists Telegraf configurations.
Subcommands manage Telegraf configurations.

## Usage
```sh
influx telegrafs [flags]
influx telegrafs [command]
```

## Subcommands
| Subcommand                                                     | Description                     |
|:----------                                                     |:-----------                     |
| [create](/influxdb/v2.1/reference/cli/influx/telegrafs/create) | Create a Telegraf configuration |
| [rm](/influxdb/v2.1/reference/cli/influx/telegrafs/rm)         | Remove a Telegraf configuration |
| [update](/influxdb/v2.1/reference/cli/influx/telegrafs/update) | Update a Telegraf configuration |

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `telegrafs` command                                      |            |                       |
|      | `--hide-headers`  | Hide table headers                                                    |            | `INFLUX_HIDE_HEADERS` |
| `-i` | `--id`            | Telegraf configuration ID to retrieve                                 | string     |                       |
|      | `--json`          | Output data as JSON                                                   |            | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                | string     | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                     | string     | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### List all Telegraf configurations
```sh
influx telegrafs
```

##### List a Telegraf configuration with the specified ID
```sh
influx telegrafs --id 0Xx0oox00XXoxxoo1
```
