---
title: influx auth active
description: The `influx auth active` command sets an authentication token to active in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx auth active
    parent: influx auth
weight: 201
---

The `influx auth active` command activates an authentication token.
Only active tokens authorize access to InfluxDB.

## Usage
```
influx auth active [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :---------------- | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-c` | `--active-config` | CLI configuration to use for command                                  |   string   |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `active` command                                         |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          |   string   |                       |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            |   string   | `INFLUX_HOST`         |
| `-i` | `--id`            | ({{< req >}}) Authentication token ID                                 |   string   |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            |                       |
| `-t` | `--token`         | Authentication token                                                  |   string   | `INFLUX_TOKEN`        |

## Example

{{< cli/influx-creds-note >}}

##### Activate an authentication token
```sh
influx auth active --id 06c86c40a9f36000
```