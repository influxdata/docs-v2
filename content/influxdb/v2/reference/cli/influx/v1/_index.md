---
title: influx v1
description: >
  The `influx v1` command provides commands for working with the InfluxDB 1.x API in InfluxDB 2.x.
menu:
  influxdb_v2:
    name: influx v1
    parent: influx
weight: 101
related:
  - /influxdb/v2/install/upgrade/v1-to-v2/
  - /influxdb/v2/reference/api/influxdb-1x/
  - /influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/v2/reference/cli/influx/#flag-patterns-and-conventions, `influx` CLI—Flag patterns and conventions
cascade:
  metadata: [influx CLI 2.0.0+, InfluxDB 2.0.0+]
---

The `influx v1` command provides commands for working with the [InfluxDB 1.x compatibility API](/influxdb/v2/reference/api/influxdb-1x/) in InfluxDB {{< current-version >}}.

## Usage
```
influx v1 [flags]
influx v1 [command]
```

## Subcommands
| Subcommand                                             | Description                                                       |
| :----------------------------------------------------- | :---------------------------------------------------------------- |
| [auth](/influxdb/v2/reference/cli/influx/v1/auth/)   | Authorization management commands for v1 APIs                     |
| [dbrp](/influxdb/v2/reference/cli/influx/v1/dbrp/)   | Database retention policy mapping management commands for v1 APIs |
| [shell](/influxdb/v2/reference/cli/influx/v1/shell/) | Start an InfluxQL shell                                           |

## Flags
| Flag |          | Description               |
|:-----|:---------|:--------------------------|
| `-h` | `--help` | Help for the `v1` command |
