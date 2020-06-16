---
title: influx task create
description: The 'influx task create' command creates a new task in InfluxDB.
menu:
  v2_0_ref:
    name: influx task create
    parent: influx task
weight: 201
---

The `influx task create` command creates a new task in InfluxDB.

## Usage
```
influx task create [query literal] [flags]
```

## Flags
| Flag |                  | Description                           | Input type | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                           |:----------:|:--------------------- |
| `-f` | `--file`         | Path to Flux script file              | string     |                       |
| `-h` | `--help`         | Help for the `create` command         |            |                       |
|      | `--hide-headers` | Hide table headers (default `false`)  |            | `INFLUX_HIDE_HEADERS` |
|      | `--json`         | Output data as JSON (default `false`) |            | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`          | Organization name                     | string     | `INFLUX_ORG`          |
|      | `--org-id`       | Organization ID                       | string     | `INFLUX_ORG_ID`       |


{{% cli/influx-global-flags %}}
