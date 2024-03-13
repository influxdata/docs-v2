---
title: influxctl table create
description: >
  The `influxctl table create` command creates a new table in the specified database.
menu:
  influxdb_clustered:
    parent: influxctl table
weight: 301
related:
  - /influxdb/clustered/admin/custom-partitions/define-custom-partitions/
  - /influxdb/clustered/admin/custom-partitions/partition-templates/
---

The `influxctl table create` command creates a new table in the specified
database in an {{< product-name omit=" Clustered" >}} cluster.

#### Custom partitioning

You can override the default partition template (the partition template of the target database)
with the `--template-tag` and `--template-timeformat` flags when you create the table.
Provide a time format using [Rust strftime](/influxdb/clustered/admin/custom-partitions/partition-templates/#time-part-templates)
and include specific tags to use in the partition template.
Be sure to follow [partitioning best practices](/influxdb/clustered/admin/custom-partitions/best-practices/).

## Usage

```sh
influxctl table create [flags] <DATABASE_NAME> <TABLE_NAME>
```

## Arguments

| Argument          | Description                 |
| :---------------- | :-------------------------- |
| **DATABASE_NAME** | Name of the target database |
| **TABLE_NAME**    | Table name                  |

## Flags

| Flag |                         | Description                                                          |
| :--- | :---------------------- | :------------------------------------------------------------------- |
|      | `--template-tag`        | Tag to add to partition template (can include multiple of this flag) |
|      | `--template-timeformat` | Timestamp format for partition template (default is `%Y-%m-%d`)      |
| `-h` | `--help`                | Output command help                                                  |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb/clustered/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

- [Create a table](#create-a-table)
- [Create a table with with a custom partition template](#create-a-table-with-with-a-custom-partition-template)

In the following examples, replace:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  The name of the database to create the table in.
- {{% code-placeholder-key %}}`TABLE_NAME` {{% /code-placeholder-key %}}:
  The name of table to create.

### Create a table

{{% code-placeholders "(DATABASE|TABLE)_NAME" %}}
```sh
influxctl table create DATABASE_NAME TABLE_NAME
```
{{% /code-placeholders %}}

### Create a table with with a custom partition template

The following example creates a new table and applies a partition
template that partitions by two tags (`room` and `sensor-type`) and by week using
the time format `%Y wk:%W`:

{{% code-placeholders "(DATABASE|TABLE)_NAME" %}}
```sh
influxctl table create \
  --template-tag room \
  --template-tag sensor-type \
  --template-timeformat '%Y wk:%W' \
  DATABASE_NAME \
  TABLE_NAME
```
{{% /code-placeholders %}}

_For more information about custom partitioning, see
[Manage data partitioning](/influxdb/clustered/admin/custom-partitions/)._
