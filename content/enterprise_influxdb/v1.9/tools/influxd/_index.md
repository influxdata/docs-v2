---
title: influxd - InfluxDB daemon
description: >
  The influxd daemon starts and runs all the processes necessary for InfluxDB to function.
menu:
 enterprise_influxdb_1_9:
    name: influxd
    weight: 10
    parent: Tools
v2: /influxdb/v2.0/reference/cli/influxd/
---

The `influxd` command starts and runs all the processes necessary for InfluxDB to function.

## Usage

```
influxd [[command] [arguments]]
```

## Commands
| Command                                               | Description                                              |
|-------------------------------------------------------|----------------------------------------------------------|
| [backup](/enterprise_influxdb/v1.9/tools/influxd/backup)   | Download a snapshot of a data node and saves it to disk. |
| [config](/enterprise_influxdb/v1.9/tools/influxd/config)   | Display the default configuration.                       |
| help                                                  | Display the help message.                                |
| [restore](/enterprise_influxdb/v1.9/tools/influxd/restore) | Use a snapshot of a data node to rebuild a cluster.      |
| [run](/enterprise_influxdb/v1.9/tools/influxd/run)         | Run node with existing configuration.                    |
| [version](/enterprise_influxdb/v1.9/tools/influxd/version) | Display the InfluxDB version.                            |
