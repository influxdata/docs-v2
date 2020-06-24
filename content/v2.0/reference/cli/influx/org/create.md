---
title: influx org create
description: The 'influx org create' creates a new organization in InfluxDB.
menu:
  v2_0_ref:
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
| Flag |                  | Description                                                | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                |:----------: |:------------------    |
| `-d` | `--description`  | Description of the organization                            |             |                       |
| `-h` | `--help`         | Help for the `create` command                              |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                       |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`) | string      | `INFLUX_HOST`         |
|      | `--json`         | Output data as JSON (default `false`)                      |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`         | Organization name                                          | string      |                       |
|      | `--skip-verify`  | Skip TLS certificate verification                          |             |                       |
| `-t` | `--token`        | Authentication token                                       | string      | `INFLUX_TOKEN`        |
