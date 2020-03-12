---
title: influx config list
description: The 'influx config list' command lists all InfluxDB connection configurations.
menu:
  v2_0_ref:
    name: influx config list
    parent: influx config
weight: 201
---

The `influx config list` command lists all InfluxDB connection configurations in the `config` file (by default, stored at `~/.influxdbv2/config`). Each connection configuration includes a url, authentication token, and active setting. By default, the list includes an asterisk next to the active connection configuration. InfluxDB reads the token from the active connection configuration, so you don't have to manually enter a token to log into InfluxDB.

## Usage
```
influx config list [flags]
```

## Flags
| Flag               | Description                               | Input type  |
|:----               |:-----------                               |:----------: |
| `-h`, `--help`     | Help for the `find` command               |             |

{{% cli/influx-global-flags %}}
