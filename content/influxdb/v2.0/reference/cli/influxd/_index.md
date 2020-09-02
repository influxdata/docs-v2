---
title: influxd - InfluxDB service
description: The `influxd` service starts and runs all the processes necessary for InfluxDB to function.
influxdb/v2.0/tags: [influxd, cli]
menu:
  influxdb_2_0_ref:
    name: influxd
    parent: Command line tools
weight: 102
related:
  - /influxdb/v2.0/reference/config-options/
products: [oss]
---

The `influxd` daemon starts and runs all the processes necessary for InfluxDB to function.

## Usage

```
influxd [flags]
influxd [command]
```

{{% note %}}
For information about other available InfluxDB configuration methods, see
[InfluxDB configuration options](/influxdb/v2.0/reference/config-options/).
{{% /note %}}

## Commands

| Command                                          | Description                                       |
|:-------                                          |:-----------                                       |
| [generate](/influxdb/v2.0/reference/cli/influxd/generate) | Generate time series data sets using TOML schema. |
| [inspect](/influxdb/v2.0/reference/cli/influxd/inspect)   | Inspect on-disk database data.                    |
| [restore](/influxdb/v2.0/reference/cli/influxd/restore)   | Restore data and metadata from a backup file set  |
| [run](/influxdb/v2.0/reference/cli/influxd/run)           | Start the influxd server _**(default)**_          |
| [version](/influxdb/v2.0/reference/cli/influxd/version)   | Output the current version of InfluxDB            |

## Flags

{{% cli/influxd-flags %}}
