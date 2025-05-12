---
title: influxctl database delete
description: >
  The `influxctl database delete` command deletes a database from an 
  {{% product-name omit=" Clustered" %}} cluster.
menu:
  influxdb3_clustered:
    parent: influxctl database
weight: 301
---

The `influxctl database delete` command deletes a database from an 
{{< product-name omit=" Clustered" >}} cluster.

## Usage

<!--Skip tests for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->

```sh
influxctl database delete [command options] [--force] <DATABASE_NAME> [<DATABASE_NAME_N>...]
```

> [!Warning]
> #### Cannot be undone
> 
> Deleting a database is a destructive action that cannot be undone.
> 
> #### Wait before writing to a new database with the same name
>
> After deleting a database from your {{% product-name omit=" Clustered" %}}
> cluster, you can reuse the name to create a new database, but **wait two to
> three minutes** after deleting the previous database before writing to the new
> database to allow write caches to clear.

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
_Also see [`influxctl` global flags](/influxdb3/clustered/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

##### Delete a database named "mydb"

<!--Skip tests for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->

```sh
influxctl database delete mydb
```

##### Delete multiple databases

<!--Skip tests for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->

```sh
influxctl database delete mydb1 mydb2
```
