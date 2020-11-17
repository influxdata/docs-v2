---
title: influx v1 dbrp
description: >
  The `influx v1 dbrp` subcommands provide database retention policy (DBRP) mapping management for the InfluxDB 1.x compatibility API.
menu:
  influxdb_2_0_ref:
    name: influx v1 dbrp
    parent: influx v1
weight: 101
influxdb/v2.0/tags: [DBRP]
---

The `influx v1 dbrp` subcommands provide database retention policy (DBRP) management for the [InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).

## Usage
```
influx v1 dbrp [flags]
influx v1 dbrp [command]
```


## Commands

| Command                                                                     | Description                                  |
|:----------------------------------------------------------------------------|----------------------------------------------|
| [`create`](/influxdb/v2.0/reference/cli/influx/v1/dbrp/create/)             | Create DBRP                        |
| [`delete`](/influxdb/v2.0/reference/cli/influx/v1/dbrp/delete/)             | Delete DBRPs                                 |
| [`list`](/influxdb/v2.0/reference/cli/influx/v1/dbrp/list/)                 | List DBRPs                                   |
| [`update`](/influxdb/v2.0/reference/cli/influx/v1/dbrp/update/)             | Update a DBRP                                |

## Flags
| Flag |          | Description                     |
|:-----|:---------|:--------------------------------|
| `-h` | `--help` | Help for the `v1 dbrp ` command |
