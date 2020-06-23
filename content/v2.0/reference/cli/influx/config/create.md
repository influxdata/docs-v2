---
title: influx config create
description: The `influx config create` command creates a new InfluxDB connection configuration.
menu:
  v2_0_ref:
    name: influx config create
    parent: influx config
weight: 201
---

The `influx config create` command creates a new InfluxDB connection configuration
and stores it in the `configs` file (by default, stored at `~/.influxdbv2/configs`).

## Usage
```
influx config create [flags]
```

## Flags
| Flag |                  | Description                                                  | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                  |:----------: |:------------------    |
| `-a` | `--active`       | Set the specified connection to be the active configuration. |             |                       |
| `-h` | `--help`         | Help for the `create` command                                |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                         |             | `INFLUX_HIDE_HEADERS` |
|      | `--json`         | Output data as JSON (default `false`)                        |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`         | (**Required**) Name of the new configuration.                | string      |                       |
| `-o` | `--org`          | Organization name                                            | string      |                       |
| `-u` | `--url`          | (**Required**) Connection URL for the new configuration.     | string      |                       |

{{% cli/influx-global-flags %}}
