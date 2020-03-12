---
title: influx config list
description: The 'influx config list' command lists all InfluxDB connection configurations.
menu:
  v2_0_ref:
    name: influx config list
    parent: influx config
weight: 201
---

The `influx config list` command lists all InfluxDB connection configurations in the `config` file (by default, stored at `~/.influxdbv2/config`). Each connection configuration includes a url, authentication token, and active setting. An asterisk (`*`) indicates the active configuration.

## Usage
```
influx config list [flags]
```

#### Aliases

`list`, `ls`

## Flags
| Flag               | Description |
|:----               |:----------- |
| `-h`, `--help`     | Help for the `find` command

{{% cli/influx-global-flags %}}
