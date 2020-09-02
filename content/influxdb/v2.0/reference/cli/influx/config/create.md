---
title: influx config create
description: The `influx config create` command creates a new InfluxDB connection configuration.
menu:
  influxdb_2_0_ref:
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
| `-n` | `--config-name`  | (**Required**) Name of the new configuration.                | string      |                       |
| `-h` | `--help`         | Help for the `create` command                                |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                         |             | `INFLUX_HIDE_HEADERS` |
| `-u` | `--host-url`     | (**Required**) Connection URL for the new configuration.     | string      |                       |
|      | `--json`         | Output data as JSON (default `false`)                        |             | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`          | Organization name                                            | string      |                       |
| `-t` | `--token`        | Authentication token                                         | string      | `INFLUX_TOKEN`         |

## Examples
```sh
# Create a connection configuration and set it active
influx config create --active \
  -n config-name \
  -u http://localhost:9999 \
  -t mySuP3rS3cr3tT0keN \
  -o example-org

# Create a connection configuration without setting it active
influx config create \
  -n config-name \
  -u http://localhost:9999 \
  -t mySuP3rS3cr3tT0keN \
  -o example-org
```
