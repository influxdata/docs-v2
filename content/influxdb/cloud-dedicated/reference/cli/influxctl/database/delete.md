---
title: influxctl database delete
description: >
  The `influxctl database delete` command deletes a database from an InfluxDB
  Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl database
weight: 302
---

The `influxctl database delete` command deletes a database from an InfluxDB
Cloud Dedicated cluster.

## Usage

```sh
influxctl database delete {name}
```

{{% warn %}}
#### Cannot be undone

Deleting a database is a destructive action that cannot be undone.

#### Cannot reuse deleted database names

After deleting a database, you cannot reuse the name of the deleted database
when creating a new database.
{{% /warn %}}

## Arguments

| Argument | Description                    |
| :------- | :----------------------------- |
| **name** | Name of the database to delete |

## Examples

##### Delete a database named "mydb"

```sh
influxctl database delete mydb
```