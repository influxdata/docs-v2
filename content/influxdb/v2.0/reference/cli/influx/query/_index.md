---
title: influx query
description: >
  The `influx query` command executes a literal Flux query provided as a string
  or a literal Flux query contained in a file.
menu:
  influxdb_2_0_ref:
    name: influx query
    parent: influx
weight: 101
influxdb/v2.0/tags: [query]
---

The `influx query` command executes a literal Flux query provided as a string
or a literal Flux query contained in a file.

## Usage
```
influx query [query literal] [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}   |
|:---- |:---               |:-----------                                                           |:----------:|:------------------   |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                      |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     |`INFLUX_CONFIGS_PATH` |
| `-f` | `--file`          | Path to Flux script file                                              | string     |                      |
| `-h` | `--help`          | Help for the `query` command                                          |            |                      |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`        |
| `-o` | `--org`           | Organization name                                                     | string     | `INFLUX_ORG`         |
|      | `--org-id`        | Organization ID                                                       | string     | `INFLUX_ORG_ID`      |
| `-r` | `--raw`           | Output raw query results (annotated CSV)                              |            |                      |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            |                      |
| `-t` | `--token`         | Authentication token                                                  | string     | `INFLUX_TOKEN`       |

## Examples

{{< cli/influx-creds-note >}}

- [Query InfluxDB with a Flux string](#query-influxdb-with-a-flux-string)
- [Query InfluxDB using a Flux file](#query-influxdb-with-a-flux-file)
- [Query InfluxDB and return annotated CSV](#query-influxdb-and-return-annotated-csv)

##### Query InfluxDB with a Flux string
```sh
influx query 'from(bucket:"example-bucket") |> range(start:-1m)'
```

##### Query InfluxDB with a Flux file
```sh
influx query --file /path/to/example-query.flux
```

##### Query InfluxDB and return annotated CSV
```sh
influx query 'from(bucket:"example-bucket") |> range(start:-1m)' --raw
```