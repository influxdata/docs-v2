---
title: influxctl database delete
description: >
  The `influxctl database delete` command deletes a database from an InfluxDB
  Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl database
weight: 301
---

The `influxctl database delete` command deletes a database from an InfluxDB
Cloud Dedicated cluster.

## Usage

```sh
influxctl database delete [command options] [--force] <DATABASE_NAME> [<DATABASE_NAME_N>...]
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

| Flag |           | Description                                                 |
| :--- | :-------- | :---------------------------------------------------------- |
|      | `--force` | Do not prompt for confirmation to delete (default is false) |
| `-h` | `--help`  | Output command help                                         |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb/cloud-dedicated/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

##### Delete a database named "mydb"

```sh
influxctl database delete mydb
```

##### Delete multiple databases

```sh
influxctl database delete mydb1 mydb2
```
