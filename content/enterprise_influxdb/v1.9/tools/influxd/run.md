---
title: influxd run
description: >
  The `influxd run` command starts and runs all the processes necessary for InfluxDB to function.
menu:
  enterprise_influxdb_1_9:
    name: influxd run
    weight: 10
    parent: influxd
v2: /influxdb/v2.0/reference/cli/influxd/run/
---

The `influxd run` command is the default command for `influxd`.
It starts and runs all the processes necessary for InfluxDB to function.

## Usage

```
influxd run [flags]
```

Because `run` is the default command for `influxd`, the following commands are the same:

```bash
influxd
influxd run
```

## Flags {.no-shorthand}

| Flag          | Description                                                                                                                                                                                                                                                                                                           |
|:--------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |
| `-config`     | Path to the configuration file. This defaults to the environment variable `INFLUXDB_CONFIG_PATH`, `~/.influxdb/influxdb.conf`, or `/etc/influxdb/influxdb.conf` if a file is present at either of these locations. Disable the automatic loading of a configuration file using the null device (such as `/dev/null`). |
| `-pidfile`    | Write process ID to a file.                                                                                                                                                                                                                                                                                           |
| `-cpuprofile` | Write CPU profiling information to a file.                                                                                                                                                                                                                                                                            |
| `-memprofile` | Write memory usage information to a file.                                                                                                                                                                                                                                                                             |
