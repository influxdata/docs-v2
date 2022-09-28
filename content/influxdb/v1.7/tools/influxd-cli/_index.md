---
title: influxd - InfluxDB daemon
description: The influxd daemon starts and runs all the processes necessary for InfluxDB to function.
menu:
 influxdb_1_7:
    name: influxd
    weight: 10
    parent: Tools
canonical: /{{< latest "influxdb" "v1" >}}/tools/influxd/
v2: /influxdb/v2.0/reference/cli/influxd/
---

The `influxd` command line interface (CLI) starts and runs all the processes necessary for InfluxDB to function.

## Usage

```
influxd [[command] [arguments]]
```

## Commands
| Command                                               | Description                                              |
|-------------------------------------------------------|----------------------------------------------------------|
| [backup](/influxdb/v1.7/tools/influxd-cli/backup)   | Download a snapshot of a data node and saves it to disk. |
| [config](/influxdb/v1.7/tools/influxd-cli/config)   | Display the default configuration.                       |
| help                                                  | Display the help message.                                |
| [restore](/influxdb/v1.7/tools/influxd-cli/restore) | Use a snapshot of a data node to rebuild a cluster.      |
| [run](/influxdb/v1.7/tools/influxd-cli/run)         | Run node with existing configuration.                    |
| [version](/influxdb/v1.7/tools/influxd-cli/version) | Display the InfluxDB version.                            |
