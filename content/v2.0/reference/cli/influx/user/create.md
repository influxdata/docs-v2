---
title: influx user create
description: The `influx user create` command creates a user in InfluxDB.
menu:
  v2_0_ref:
    name: influx user create
    parent: influx user
weight: 201
---

The `influx user create` command creates a new user in InfluxDB.

## Usage
```
influx user create [flags]
```

## Flags
| Flag |                  | Description                                                | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                |:----------: |:------------------    |
| `-h` | `--help`         | Help for the `create` command                              |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                       |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`) | string      | `INFLUX_HOST`         |
|      | `--json`         | Output data as JSON (default `false`)                      |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`         | **(Required)** Username                                    | string      | `INFLUX_NAME`         |
| `-o` | `--org`          | Organization name                                          | string      | `INFLUX_ORG`          |
|      | `--org-id`       | Organization ID                                            | string      | `INFLUX_ORG_ID`       |
| `-p` | `--password`     | User password                                              | string      |                       |
|      | `--skip-verify`  | Skip TLS certificate verification                          |             |                       |
| `-t` | `--token`        | Authentication token                                       | string      | `INFLUX_TOKEN`        |
