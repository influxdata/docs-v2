---
title: influx config update
description: The 'influx config update' command updates an InfluxDB connection configuration.
menu:
  v2_0_ref:
    name: influx config update
    parent: influx config
weight: 201
---

The `influx config update` command updates information in an InfluxDB connection configuration in the `config` file (by default, stored at `~/.influxdbv2/config`).

## Usage
```
influx config update [flags]
```

## Flags
| Flag                | Description                                                      | Input type  | {{< cli/mapped >}}   |
|:----                |:-----------                                                      |:----------: |:------------------   |
| `-a`, `--active`    | Set the specified connection to active                           |             |                      |
| `-h`, `--help`      | Help for the `update` command                                    |             |                      |
| `--org`             | Organization name for the connection configuration               | string      |                      |
| `-n`, `--name`      | Name of InfluxDB connection configuration to update              | string      |                      |

{{% cli/influx-global-flags %}}
