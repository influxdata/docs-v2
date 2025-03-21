---
title: influxd - InfluxDB daemon
description: >
  The influxd daemon starts and runs all the processes necessary for InfluxDB to function.
menu:
 influxdb_v1:
    name: influxd
    weight: 10
    parent: Tools
alt_links:
  v2: /influxdb/v2/reference/cli/influxd/
---

The `influxd` command starts and runs all the processes necessary for InfluxDB to function.

## Usage

```
influxd [[command] [arguments]]
```

## Commands
| Command                                               | Description                                              |
|-------------------------------------------------------|----------------------------------------------------------|
| [backup](/influxdb/v1/tools/influxd/backup)   | Download a snapshot of a data node and saves it to disk. |
| [config](/influxdb/v1/tools/influxd/config)   | Display the default configuration.                       |
| help                                                  | Display the help message.                                |
| [restore](/influxdb/v1/tools/influxd/restore) | Use a snapshot of a data node to rebuild a cluster.      |
| [run](/influxdb/v1/tools/influxd/run)         | Run node with existing configuration.                    |
| [version](/influxdb/v1/tools/influxd/version) | Display the InfluxDB version.                            |
