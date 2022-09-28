---
    title: influx telegrafs create
description: >
  The `influx telegrafs create` command creates a Telegraf configuration in InfluxDB
  using a provided Telegraf configuration file.
menu:
  influxdb_2_0_ref:
    name: influx telegrafs create
    parent: influx telegrafs
weight: 201
---

The `influx telegrafs create` command creates a Telegraf configuration in InfluxDB
using a provided Telegraf configuration file.

## Usage
```sh
influx telegrafs create [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-d` | `--description`   | Telegraf configuration description                                    | string     |                       |
| `-f` | `--file`          | Path to Telegraf configuration                                        | string     |                       |
| `-h` | `--help`          | Help for the `create` command                                         |            |                       |
|      | `--hide-headers`  | Hide table headers                                                    |            | `INFLUX_HIDE_HEADERS` |
|      | `--json`          | Output data as JSON                                                   |            | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`          | Telegraf configuration name                                           | string     |                       |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                | string     | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                     | string     | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### Create a Telegraf configuration
```sh
influx telegrafs create \
  --name "Example configuration name" \
  --description "Example Telegraf configuration description" \
  --file /path/to/telegraf.conf
```

##### Create a Telegraf configuration via stdin
```sh
cat /path/to/telegraf.conf | influx telegrafs create \
  --name "Example configuration name" \
  --description "Example Telegraf configuration description" \
```
