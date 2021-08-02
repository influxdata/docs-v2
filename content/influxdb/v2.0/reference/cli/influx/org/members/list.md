---
title: influx org members list
description: The `influx org members list` command lists members within an organization in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx org members list
    parent: influx org members
weight: 301
---

The `influx org members list` command lists members within an organization in InfluxDB.

## Usage
```
influx org members list [flags]
```

## Flags
| Flag |                  | Description                                                | Input type | {{< cli/mapped >}}    |
| :--- | :--------------- | :--------------------------------------------------------- | :--------: | :-------------------- |
| `-h` | `--help`         | Help for the `list` command                                |            |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                       |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:8086`) |   string   | `INFLUX_HOST`         |
|      | `--http-debug`   | Inspect communication with InfluxDB servers.               |   string   |                       |
| `-i` | `--id`           | Organization ID                                            |   string   | `INFLUX_ORG_ID`       |
|      | `--json`         | Output data as JSON (default `false`)                      |            | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`         | Organization name                                          |   string   | `INFLUX_ORG`          |
|      | `--skip-verify`  | Skip TLS certificate verification                          |            |                       |
| `-t` | `--token`        | Authentication token                                       |   string   | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### List members of an organization
```sh
influx org members list \
  --name example-org
```