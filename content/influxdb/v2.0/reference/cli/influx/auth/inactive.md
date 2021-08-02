---
title: influx auth inactive
description: The `influx auth inactive` command inactivates an authentication token in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx auth inactive
    parent: influx auth
weight: 201
---

The `influx auth inactive` command inactivates an authentication token in InfluxDB.
Inactive tokens **do not** authorize access to InfluxDB.

To temporarily disable client access to InfluxDB, inactivate the authentication
token the client is using rather than delete the token.
If you delete the token, you have to generate a new token and update the client
with the new token.
By setting a token to inactive, you can [activate the token](/influxdb/v2.0/reference/cli/influx/auth/active/)
to grant the client access without having to modify the client.

## Usage
```
influx auth inactive [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :---------------- | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-c` | `--active-config` | CLI configuration to use for command                                  |   string   |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `inactive` command                                       |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            |   string   | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          |   string   |                       |
| `-i` | `--id`            | ({{< req >}}) Authentication token ID                                 |   string   |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            |                       |
| `-t` | `--token`         | Authentication token                                                  |   string   | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### Inactivate an authentication token
```sh
influx auth inactive --id 06c86c40a9f36000
```
