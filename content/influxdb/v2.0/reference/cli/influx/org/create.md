---
title: influx org create
description: The `influx org create` creates a new organization in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx org create
    parent: influx org
weight: 201
---

The `influx org create` creates a new organization in InfluxDB.

## Usage
```
influx org create [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---               |:-----------                                                           |:----------: |:------------------    |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string      |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-d` | `--description`   | Description of the organization                                       |             |                       |
| `-h` | `--help`          | Help for the `create` command                                         |             |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string      | `INFLUX_HOST`         |
|      | `--json`          | Output data as JSON (default `false`)                                 |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`          | ({{< req >}}) Organization name                                       | string      |                       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |             |                       |
| `-t` | `--token`         | Authentication token                                                  | string      | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### Create a new organization
```sh
influx org create --name example-org
```

##### Create a new organization with a description
```sh
influx org create \
  --name example-org \
  --description "Example organization description"
```