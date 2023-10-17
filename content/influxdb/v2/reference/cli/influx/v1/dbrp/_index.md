---
title: influx v1 dbrp
description: >
  The `influx v1 dbrp` subcommands manage database and retention policy mappings (DBRP)
  for the [InfluxDB 1.x compatibility API](/influxdb/v2/reference/api/influxdb-1x/).
menu:
  influxdb_v2_ref:
    name: influx v1 dbrp
    parent: influx v1
weight: 101
influxdb/v2/tags: [DBRP]
cascade:
  related:
    - /influxdb/v2/upgrade/v1-to-v2/
    - /influxdb/v2/reference/api/influxdb-1x/
    - /influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
    - /influxdb/v2/reference/cli/influx/#flag-patterns-and-conventions, `influx` CLI—Flag patterns and conventions
  metadata: [influx CLI 2.0.2+, InfluxDB 2.0.1+]
---

The `influx v1 dbrp` subcommands manage database and retention policy mappings (DBRP)
for the [InfluxDB 1.x compatibility API](/influxdb/v2/reference/api/influxdb-1x/).

## Usage
```
influx v1 dbrp [flags]
influx v1 dbrp [command]
```

## Commands

| Command                                                       | Description           |
|:------------------------------------------------------------- |:--------------------- |
| [create](/influxdb/v2/reference/cli/influx/v1/dbrp/create/) | Create a DBRP mapping |
| [delete](/influxdb/v2/reference/cli/influx/v1/dbrp/delete/) | Delete a DBRP mapping |
| [list](/influxdb/v2/reference/cli/influx/v1/dbrp/list/)     | List DBRP mappings    |
| [update](/influxdb/v2/reference/cli/influx/v1/dbrp/update/) | Update a DBRP mapping |

## Flags
| Flag |          | Description                     |
|:-----|:---------|:--------------------------------|
| `-h` | `--help` | Help for the `v1 dbrp ` command |
