---
title: influx config delete
description: The 'influx config delete' command deletes an InfluxDB connection configuration.
menu:
  v2_0_ref:
    name: influx config delete
    parent: influx config
weight: 201
---

The `influx config delete` command deletes an InfluxDB connection configuration from the `configs` file (by default, stored at `~/.influxdbv2/configs`).

## Usage
```
influx config delete [flags]
```

## Flags
| Flag                | Description                                                        | Input type  |
|:----                |:-----------                                                        |:----------: |
| `-h`, `--help`      | Help for the `delete` command                                      |             |
| `-n`, `--name`      | (**Required**) Name of InfluxDB connection configuration to delete | string      |

{{% cli/influx-global-flags %}}
