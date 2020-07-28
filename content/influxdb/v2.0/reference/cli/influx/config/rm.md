---
title: influx config rm
description: The `influx config rm` command removes an InfluxDB connection configuration.
menu:
  influxdb_2_0_ref:
    name: influx config rm
    parent: influx config
weight: 201
aliases:
  - /v2.0/reference/cli/influx/config/delete/
  - /v2.0/reference/cli/influx/config/rm/
---

The `influx config rm` command removes an InfluxDB connection configuration
from the `configs` file (by default, stored at `~/.influxdbv2/configs`).

## Usage
```
influx config rm <config-name> [flags]
```

#### Aliases
`rm`, `remove`, `delete`


## Flags
| Flag |                  | Description                                                        | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                        |:----------: |:------------------    |
| `-h` | `--help`         | Help for the `delete` command                                      |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                               |             | `INFLUX_HIDE_HEADERS` |
|      | `--json`         | Output data as JSON (default `false`)                              |             | `INFLUX_OUTPUT_JSON`  |

## Examples
```sh
# Delete a connection configuration
influx config rm local-config

# Delete multiple connection configurations
influx config rm config-1 config-2
```
