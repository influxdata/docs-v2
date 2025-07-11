---
title: Create a table
description: >
  Use the [`influxctl table create` command](/influxdb3/clustered/reference/cli/influxctl/table/create/)
  to create a new table in a specified database your InfluxDB cluster.
  Provide the database name and a table name.
menu:
  influxdb3_clustered:
    parent: Manage tables
weight: 201
list_code_example: |
  ```sh
  influxctl table create <DATABASE_NAME> <TABLE_NAME>
  ```
related:
  - /influxdb3/clustered/reference/cli/influxctl/table/create/
  - /influxdb3/clustered/reference/naming-restrictions/
  - /influxdb3/clustered/admin/custom-partitions/
---

Use the [`influxctl table create` command](/influxdb3/clustered/reference/cli/influxctl/table/create/)
to create a table in a specified database in your
{{< product-name omit=" Clustered" >}} cluster.

With {{< product-name >}}, tables and measurements are synonymous.
Typically, tables are created automatically on write using the measurement name
specified in line protocol written to InfluxDB.
However, to apply a [custom partition template](/influxdb3/clustered/admin/custom-partitions/)
to a table, you must manually create the table before you write any data to it.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/clustered/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run the `influxctl table create` command and provide the following:

    - _Optional_: [InfluxDB tags](/influxdb3/clustered/reference/glossary/#tag)
      to use in the partition template
    - _Optional_: [InfluxDB tag buckets](/influxdb3/clustered/admin/custom-partitions/partition-templates/#tag-bucket-part-templates)
      to use in the partition template
    - _Optional_: A [Rust strftime date and time string](/influxdb3/clustered/admin/custom-partitions/partition-templates/#time-part-templates)
      that specifies the time format in the partition template and determines
      the time interval to partition by _(default is `%Y-%m-%d`)_
    - The name of the database to create the table in
    - The name of the table to create (see [Table naming restrictions](#table-naming-restrictions))

    > [!Note]
    > _{{< product-name >}} supports up to 7 total tags or tag buckets in the partition template._

{{% code-placeholders "(DATABASE|TABLE)_NAME" %}}
```sh
influxctl table create \
  --template-tag tag1 \
  --template-tag tag2 \
  --template-tag-bucket tag3,100 \
  --template-tag-bucket tag4,300 \
  --template-timeformat '%Y-%m-%d' \
  DATABASE_NAME \
  TABLE_NAME
```
{{% /code-placeholders %}}

### Custom partitioning

{{< product-name >}} lets you define a custom partitioning strategy for each table.
A _partition_ is a logical grouping of data stored in [Apache Parquet](https://parquet.apache.org/)
format in the InfluxDB 3 storage engine. By default, data is partitioned by day,
but, depending on your schema and workload, customizing the partitioning
strategy can improve query performance.

Use the `--template-tag`, `--template-tag-bucket`, and `--template-timeformat`
flags to define partition template parts used to generate partition keys for the table.
If no template flags are provided, the table uses the partition template of the
target database.
For more information, see [Manage data partitioning](/influxdb3/clustered/admin/custom-partitions/).

> [!Warning]
> #### Partition templates can only be applied on create
> 
> You can only apply a partition template when creating a table.
> You can't update a partition template on an existing table.

## Table naming restrictions

Table names in {{< product-name >}} must adhere to the following naming restrictions:

- **Allowed characters**: Alphanumeric characters (a-z, A-Z, 0-9), underscore (`_`), dash (`-`)
- **Starting character**: Should start with a letter or number and should not start with underscore (`_`)
- **Case sensitivity**: Table names are case-sensitive
- **Quoting**: Use double quotes when names contain special characters or whitespace

> [!Caution]
> #### Underscore prefix reserved for system use
>
> Names starting with an underscore (`_`) may be reserved for InfluxDB system use.
> While {{< product-name >}} might not explicitly reject these names, using them risks
> conflicts with current or future system features and may result in
> unexpected behavior or data loss.

