---
title: influx config
description: The `influx config` command and subcommands manage multiple InfluxDB connection configurations.
menu:
  influxdb_2_0_ref:
    name: influx config
    parent: influx
weight: 101
influxdb/v2.0/tags: [config]
cascade:
  related:
    - /influxdb/v2.0/reference/cli/influx/#patterns-and-conventions, influx CLI patterns and conventions
---

The `influx config` command displays the active InfluxDB connection configuration
and manages multiple connection configurations stored, by default, in `~/.influxdbv2/configs`.
Each connection includes a URL, token, associated organization, and active setting.
InfluxDB reads the token from the active connection configuration, so you don't
have to manually enter a token to log into InfluxDB.

## Usage
```
influx config [flags]
influx config [command]
influx config <config-name>
```

##### Quickly switch between configurations
```sh
# Syntax
influx config <config-name>

# Example
influx config local-config
```

To quickly switch back to the previous configuration, use the following command:

```sh
influx config -
```

## Examples
```sh
# Show the active connection configuration
influx config

# Set a connection configuration as active
influx config local-config
```

## Subcommands
| Subcommand                                                  | Description                              |
|:----                                                        |:-----------                              |
| [create](/influxdb/v2.0/reference/cli/influx/config/create) | Create a new connection configuration    |
| [list](/influxdb/v2.0/reference/cli/influx/config/create)   | List connection configurations           |
| [delete](/influxdb/v2.0/reference/cli/influx/config/rm)     | Delete a connection configuration        |
| [set](/influxdb/v2.0/reference/cli/influx/config/set)       | Set or update a connection configuration |

## Flags
| Flag |          | Description                   |
|:---- |:---      |:-----------                   |
| `-h` | `--help` | Help for the `config` command |
