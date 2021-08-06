---
title: influx org list
description: The `influx org list` lists and searches for organizations in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx org list
    parent: influx org
weight: 201
aliases:
  - /influxdb/v2.0/reference/influx/org/find
---

The `influx org list` lists and searches for organizations in InfluxDB.

## Usage
```
influx org list [flags]
```

#### Command aliases
`list`, `ls`, `find`

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :---------------- | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-c` | `--active-config` | CLI configuration to use for command                                  |   string   |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `list` command                                           |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            |   string   | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          |   string   |                       |
| `-i` | `--id`            | Organization ID                                                       |   string   | `INFLUX_ORG`          |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`          | Organization name                                                     |   string   | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            |                       |
| `-t` | `--token`         | Authentication token                                                  |   string   | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

- [List all organizations](#list-all-organizations)
- [List a specific organization by name](#list-a-specific-organization-by-name)
- [List a specific organization by ID](#list-a-specific-organization-by-id)

##### List all organizations
```sh
influx org list
```

##### List a specific organization by name
```sh
influx org list --name example-org
```

##### List a specific organization by ID
```sh
influx org list --id 0Xx0oox00XXoxxoo1
```