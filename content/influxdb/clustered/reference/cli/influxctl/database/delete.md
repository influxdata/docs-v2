---
title: influxctl database delete
description: >
  The `influxctl database delete` command deletes a database from an InfluxDB
  cluster.
menu:
  influxdb_clustered:
    parent: influxctl database
weight: 302
---

The `influxctl database delete` command deletes a database from an InfluxDB
cluster.

## Usage

```sh
influxctl database delete <DATABASE_NAME>
```

{{% warn %}}
#### Cannot be undone

Deleting a database is a destructive action that cannot be undone.

#### Cannot reuse deleted database names

After deleting a database, you cannot reuse the name of the deleted database
when creating a new database.
{{% /warn %}}

## Arguments

| Argument          | Description                    |
| :---------------- | :----------------------------- |
| **DATABASE_NAME** | Name of the database to delete |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |

## Examples

##### Delete a database named "mydb"

```sh
influxctl database delete mydb
```