---
title: influx config set
description: The `influx config set` command updates an InfluxDB connection configuration.
menu:
  influxdb_2_1_ref:
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

#### Command aliases
`set` , `update`

## Flags
| Flag |                  | Description                                                     | Input type | {{< cli/mapped >}}    |
| :--- | :--------------- | :-------------------------------------------------------------- | :--------: | :-------------------- |
| `-a` | `--active`       | Set the specified connection to active                          |            |                       |
| `-n` | `--config-name`  | Name for the InfluxDB connection configuration to set or update |   string   |                       |
| `-h` | `--help`         | Help for the `set` command                                      |            |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                            |            | `INFLUX_HIDE_HEADERS` |
| `-u` | `--host-url`     | URL for InfluxDB connection configuration to set or update      |   string   |                       |
|      | `--json`         | Output data as JSON (default `false`)                           |            | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`          | Organization name for the connection configuration              |   string   |                       |

## Examples

##### Update a connection configuration and set it to active
```sh
influx config set --active \
  -n config-name \
  -t mySuP3rS3cr3tT0keN \
  -o example-org
```

##### Update a connection configuration and do not set it to active
```sh
influx config set \
  -n config-name \
  -t mySuP3rS3cr3tT0keN \
  -o example-org
```
