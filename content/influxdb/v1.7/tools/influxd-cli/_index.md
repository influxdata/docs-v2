---
title: influxd - InfluxDB daemon
description: The influxd daemon starts and runs all the processes necessary for InfluxDB to function.
menu:
 influxdb_1_7:
    name: influxd
    weight: 10
    parent: Tools
---

The `influxd` command line interface (CLI) starts and runs all the processes necessary for InfluxDB to function.

## Usage

```
influxd [[command] [arguments]]
```

## Commands
| Command                                               | Description                                              |
|-------------------------------------------------------|----------------------------------------------------------|
| [backup](/{{< latest "influxdb" "v1" >}}/tools/influxd-cli/backup)   | Download a snapshot of a data node and saves it to disk. |
| [config](/{{< latest "influxdb" "v1" >}}/tools/influxd-cli/config)   | Display the default configuration.                       |
| help                                                  | Display the help message.                                |
| [restore](/{{< latest "influxdb" "v1" >}}/tools/influxd-cli/restore) | Use a snapshot of a data node to rebuild a cluster.      |
| [run](/{{< latest "influxdb" "v1" >}}/tools/influxd-cli/run)         | Run node with existing configuration.                    |
| [version](/{{< latest "influxdb" "v1" >}}/tools/influxd-cli/version) | Display the InfluxDB version.                            |
