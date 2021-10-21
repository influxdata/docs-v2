---
title: influx v1 dbrp
description: >
  The `influx v1 dbrp` subcommands manage database and retention policy mappings (DBRP)
  for the [InfluxDB 1.x compatibility API](/influxdb/v2.1/reference/api/influxdb-1x/).
menu:
  influxdb_2_1_ref:
    name: influx v1 dbrp
    parent: influx v1
weight: 101
influxdb/v2.1/tags: [DBRP]
metadata: [influx CLI 2.0.1+, InfluxDB 2.0.1+]
---

The `influx v1 dbrp` subcommands manage database and retention policy mappings (DBRP)
for the [InfluxDB 1.x compatibility API](/influxdb/v2.1/reference/api/influxdb-1x/).

## Usage
```
influx v1 dbrp [flags]
influx v1 dbrp [command]
```

## Commands

| Command                                                       | Description           |
|:------------------------------------------------------------- |:--------------------- |
| [create](/influxdb/v2.1/reference/cli/influx/v1/dbrp/create/) | Create a DBRP mapping |
| [delete](/influxdb/v2.1/reference/cli/influx/v1/dbrp/delete/) | Delete a DBRP mapping |
| [list](/influxdb/v2.1/reference/cli/influx/v1/dbrp/list/)     | List DBRP mappings    |
| [update](/influxdb/v2.1/reference/cli/influx/v1/dbrp/update/) | Update a DBRP mapping |

## Flags
| Flag |          | Description                     |
|:-----|:---------|:--------------------------------|
| `-h` | `--help` | Help for the `v1 dbrp ` command |
