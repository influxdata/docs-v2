---
title: influxd - InfluxDB service
description: The `influxd` service starts and runs all the processes necessary for InfluxDB to function.
influxdb/v2.1/tags: [influxd, cli]
menu:
  influxdb_2_1_ref:
    name: influxd
    parent: Command line tools
weight: 102
related:
  - /influxdb/v2.1/reference/config-options/
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
[InfluxDB configuration options](/influxdb/v2.1/reference/config-options/).
{{% /note %}}

## Commands

| Command                                                           | Description                                                  |
| :---------------------------------------------------------------- | :----------------------------------------------------------- |
| [inspect](/influxdb/v2.1/reference/cli/influxd/inspect)           | Inspect on-disk database data                                |
| [print-config](/influxdb/v2.1/reference/cli/influxd/print-config) | Print full influxd configuration for the current environment |
| [run](/influxdb/v2.1/reference/cli/influxd/run)                   | Start the influxd server _**(default)**_                     |
| [upgrade](/influxdb/v2.1/reference/cli/influxd/upgrade)           | Upgrade a 1.x version of InfluxDB to {{< current-version >}} |
| [version](/influxdb/v2.1/reference/cli/influxd/version)           | Output the current version of InfluxDB                       |

## Flags

<!-- Influxd flags are maintained in data/influxd_flags.yml -->
{{< cli/influxd-flags >}}
