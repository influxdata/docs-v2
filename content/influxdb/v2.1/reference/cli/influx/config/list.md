---
title: influx config list
description: The `influx config list` command lists all InfluxDB connection configurations.
menu:
  influxdb_2_1_ref:
    name: influx config list
    parent: influx config
weight: 201
---

The `influx config list` command lists all InfluxDB connection configurations in
the `configs` file (by default, stored at `~/.influxdbv2/configs`).
Each connection configuration includes a URL, API token, and active setting.
An asterisk (`*`) indicates the active configuration.

## Usage
```
influx config list [flags]
```

#### Command aliases
`list`, `ls`

## Flags
| Flag |                  | Description                                  | {{< cli/mapped >}}    |
| :--- | :--------------- | :------------------------------------------- | :-------------------- |
| `-h` | `--help`         | Help for the `list` command                  |                       |
|      | `--hide-headers` | Hide table headers (default `false`)         | `INFLUX_HIDE_HEADERS` |
|      | `--json`         | Output data as JSON (default `false`)        | `INFLUX_OUTPUT_JSON`  |
