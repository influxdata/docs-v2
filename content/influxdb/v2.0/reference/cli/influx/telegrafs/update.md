---
title: influx telegrafs update
description: >
  The `influx telegrafs update` command updates a Telegraf configuration to match the specified parameters.
  If a name or description are not provided, they are set to an empty string.
menu:
  influxdb_2_0_ref:
    name: influx telegrafs update
    parent: influx telegrafs
weight: 201
---

The `influx telegrafs update` command updates a Telegraf configuration to match the specified parameters.
If a name or description are not provided, they are set to an empty string.

## Usage
```sh
influx telegrafs update [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---               |:-----------                                                           |:----------: |:------------------    |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string      |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-d` | `--description`   | Telegraf configuration description                                    | string      |                       |
| `-f` | `--file`          | Path to Telegraf configuration                                        | string      |                       |
| `-h` | `--help`          | Help for the `update` command                                         |             |                       |
|      | `--hide-headers`  | Hide table headers                                                    |             | `INFLUX_HIDE_HEADERS` |
|      | `--json`          | Output data as JSON                                                   |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`          | Telegraf configuration name                                           | string      |                       |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                | string      | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                     | string      | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |             |                       |
| `-t` | `--token`         | API token                                                  | string      | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### Update a Telegraf configuration
```sh
influx telegrafs update \
  --id 0Xx0oox00XXoxxoo1 \
  --name "Example configuration name" \
  --description "Example Telegraf configuration description" \
  --file /path/to/telegraf.conf
```

##### Update a Telegraf configuration via stdin
```sh
cat /path/to/telegraf.conf | influx telegrafs update \
  --id 0Xx0oox00XXoxxoo1 \
  --name "Example configuration name" \
  --description "Example Telegraf configuration description" \
```
