---
title: influx config
description: The 'influx config' command and subcommands manage multiple InfluxDB connection configurations.
menu:
  v2_0_ref:
    name: influx config
    parent: influx
weight: 101
v2.0/tags: [config]
---

The `influx config` command manages multiple InfluxDB connection configurations file (by default, stored at `~/.influxdbv2/configs`). Each connection includes a URL, token, associated organization, and active setting. InfluxDB reads the token from the active connection configuration, so you don't have to manually enter a token to log into InfluxDB.

## Usage
```
influx config [flags]
influx config [command]
```

## Subcommands
| Subcommand                                         | Description   |
|:----                                               |:-----------   |
| [create](/v2.0/reference/cli/influx/config/create) | Create a new connection configuration to include in the configuration (`config`) file (by default, at `~/.influxdbv2/config`).
| [list](/v2.0/reference/cli/influx/config/create)   | List connection configurations.
| [delete](/v2.0/reference/cli/influx/config/delete  | Delete a connection configuration.
| [set](/v2.0/reference/cli/influx/config/set)       | Set or update a connection configuration.
| `-h`, `--help`                                     | Help for the `config` command.

{{% cli/influx-global-flags %}}
