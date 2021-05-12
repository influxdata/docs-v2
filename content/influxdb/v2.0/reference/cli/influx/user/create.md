---
title: influx user create
description: The `influx user create` command creates a user in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx user create
    parent: influx user
weight: 201
canonical: /{{< latest "influxdb" "v2" >}}/reference/cli/influx/user/create/
---

The `influx user create` command creates a user in InfluxDB.

## Usage
```
influx user create [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---               |:-----------                                                           |:----------: |:------------------    |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string      |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`          | Help for the `create` command                                         |             |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string      | `INFLUX_HOST`         |
|      | `--json`          | Output data as JSON (default `false`)                                 |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`          | ({{< req >}}) Username                                                | string      | `INFLUX_NAME`         |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                | string      | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                     | string      | `INFLUX_ORG_ID`       |
| `-p` | `--password`      | User password                                                         | string      |                       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |             |                       |
| `-t` | `--token`         | Authentication token                                                  | string      | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### Create a user
```sh
influx user create \
  --name example-username \
  --password ExAmPl3PA55W0rD
```
