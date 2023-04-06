---
title: influxctl database create
description: >
  The `influxctl database create` command creates a new database in an InfluxDB
  Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl database
weight: 301
---

The `influxctl database create` command creates a new database in an InfluxDB
Cloud Dedicated cluster.

## Usage

```sh
influxctl database create [--retention-period 0s] {name}
```

## Arguments

| Argument | Description            |
| :------- | :--------------------- |
| **name** | InfluxDB database name |

## Flags {#command-flags}

| Flag                 | Description                                         |
| :------------------- | :-------------------------------------------------- |
| `--retention-period` | Bucket retention period (default is 0s or infinite) |

## Examples

- [Create a database with an infinite retention period](#create-a-database-with-an-infinite-retention-period)
- [Create a database with a 30 day retention period](#create-a-database-with-a-30-day-retention-period)

##### Create a database with an infinite retention period

```sh
influxctl database create mydb
```

##### Create a database with a 30 day retention period

```sh
influxctl database create \
  --retention-period 30d \
  mydb
```