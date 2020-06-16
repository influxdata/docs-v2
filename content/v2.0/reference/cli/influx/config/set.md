---
title: influx config set
description: The 'influx config set' command updates an InfluxDB connection configuration.
menu:
  v2_0_ref:
    name: influx config set
    parent: influx config
weight: 201
---

The `influx config set` command updates information in an InfluxDB connection
configuration in the `configs` file (by default, stored at `~/.influxdbv2/configs`).

## Usage
```
influx config set [flags]
```

#### Aliases
`set` , `update`

## Flags
| Flag |                  | Description                                                               | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                               |:----------: |:------------------    |
| `-a` | --active`        | Set the specified connection to active                                    |             |                       |
| `-h` | --help`          | Help for the `set` command                                                |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                                      |             | `INFLUX_HIDE_HEADERS` |
|      | `--json`         | Output data as JSON (default `false`)                                     |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | --name`          | Name for the InfluxDB connection configuration to set or update           | string      |                       |
| `-o` | `--org`          | Organization name for the connection configuration                        | string      |                       |
| `-u` | --url`           | (**Required**) URL for InfluxDB connection configuration to set or update | string      |                       |

{{% cli/influx-global-flags %}}
