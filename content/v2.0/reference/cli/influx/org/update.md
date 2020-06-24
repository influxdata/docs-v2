---
title: influx org update
description: The 'influx org update' command updates information related to organizations in InfluxDB.
menu:
  v2_0_ref:
    name: influx org update
    parent: influx org
weight: 201
---

The `influx org update` command updates information related to organizations in InfluxDB.

## Usage
```
influx org update [flags]
```

## Flags
| Flag |                  | Description                                                | Input type | {{< cli/mapped >}}       |
|:---- |:---              |:-----------                                                |:----------:|:------------------       |
| `-d` | `--description`  | Description for the organization                           | string     | `INFLUX_ORG_DESCRIPTION` |
| `-h` | `--help`         | Help for the `update` command                              |            |                          |
|      | `--hide-headers` | Hide table headers (default `false`)                       |            | `INFLUX_HIDE_HEADERS`    |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`) | string     | `INFLUX_HOST`            |
| `-i` | `--id`           | **(Required)** Organization ID                             | string     | `INFLUX_ORG_ID`          |
|      | `--json`         | Output data as JSON (default `false`)                      |            | `INFLUX_OUTPUT_JSON`     |
| `-n` | `--name`         | Organization name                                          | string     | `INFLUX_ORG`             |
|      | `--skip-verify`  | Skip TLS certificate verification                          |            |                          |
| `-t` | `--token`        | Authentication token                                       | string     | `INFLUX_TOKEN`           |
