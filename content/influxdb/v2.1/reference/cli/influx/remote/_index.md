---
title: influx remote
description: Manage remote connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx remote
    parent: influx
weight: 101
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

Use the `influx remote` command to replicate data at the bucket level to
one or more remote instances of InfluxDB.

<!-- If you have multiple edge deployments of InfluxDB OSS that are collecting data locally, -->
<!-- and and would like an easy way to analyze this data in aggregate. -->
<!-- As a user, I have multiple edge deployments of InfluxDB OSS -->
<!-- that are collecting data locally with limited or no connectivity to the cloud. -->
<!-- I would like an easy way to analyze this data in aggregate once network connection is restored. -->

## Usage
```
influx remote [commond options] [arguments...]
```

## Subcommands
|:------------------------------------------------------------|:-------------------------------------|
| [create](/influxdb/v2.1/reference/cli/influx/remote/create) | Create a new remote connection       |
| [delete](/influxdb/v2.1/reference/cli/influx/remote/delete) | Delete an existing remote connection |
| [list](/influxdb/v2.1/reference/cli/influx/remote/list)     | List all remote connections          |
| [update](/influxdb/v2.1/reference/cli/influx/remote/update) | Update an existing remote connection |

## Flags
| Flag |          | Description                   | Input type | {{< cli/mapped >}} |
|:-----|:---------|:------------------------------|:----------:|:-------------------|
| `-h` | `--help` | Help for the `remote` command |            |                    |


