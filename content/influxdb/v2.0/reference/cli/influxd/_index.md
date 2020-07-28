---
title: influxd - InfluxDB service
description: The `influxd` service starts and runs all the processes necessary for InfluxDB to function.
v2.0/tags: [influxd, cli]
menu:
  v2_0_ref:
    name: influxd
    parent: Command line tools
weight: 102
aliases:
  - /v2.0/reference/cli/influxd/
related:
  - /v2.0/reference/config-options/
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
[InfluxDB configuration options](/v2.0/reference/config-options/).
{{% /note %}}

## Commands

| Command                                          | Description                                       |
|:-------                                          |:-----------                                       |
| [generate](/v2.0/reference/cli/influxd/generate) | Generate time series data sets using TOML schema. |
| [inspect](/v2.0/reference/cli/influxd/inspect)   | Inspect on-disk database data.                    |
| [restore](/v2.0/reference/cli/influxd/restore)   | Restore data and metadata from a backup file set  |
| [run](/v2.0/reference/cli/influxd/run)           | Start the influxd server _**(default)**_          |
| [version](/v2.0/reference/cli/influxd/version)   | Output the current version of InfluxDB            |

## Flags

{{% cli/influxd-flags %}}
