---
title: Create a table
description: >
  Use the [`influxctl table create` command](/influxdb/cloud-dedicated/reference/cli/influxctl/table/create/)
  to create a new table in a specified database your InfluxDB cluster.
  Provide the database name and a table name.
menu:
  influxdb_cloud_dedicated:
    parent: Manage tables
weight: 201
list_code_example: |
  ```sh
  influxctl table create <DATABASE_NAME> <TABLE_NAME>
  ```
related:
  - /influxdb/cloud-dedicated/reference/cli/influxctl/table/create/
  - /influxdb/cloud-dedicated/admin/custom-partitions/
---

Use the [`influxctl table create` command](/influxdb/cloud-dedicated/reference/cli/influxctl/table/create/)
to create a table in a specified database in your
{{< product-name omit=" Clustered" >}} cluster.

With {{< product-name >}}, tables and measurements are synonymous.
Typically, tables are created automatically on write using the measurement name
specified in line protocol written to InfluxDB.
However, to apply a [custom partition template](/influxdb/cloud-dedicated/admin/custom-partitions/)
to a table, you must manually create the table before you write any data to it.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run the `influxctl table create` command and provide the following:

    - _Optional_: [InfluxDB tags](/influxdb/cloud-dedicated/reference/glossary/#tag)
      to use in the partition template _(supports up to 7 different tags)_
    - _Optional_: A [Rust strftime date and time string](/influxdb/cloud-dedicated/admin/custom-partitions/partition-templates/#time-part-templates)
      that specifies the time format in the partition template and determines
      the time interval to partition by _(default is `%Y-%m-%d`)_
    - The name of the database to create the table in
    - The name of the table to create

{{% code-placeholders "(DATABASE|TABLE)_NAME" %}}
```sh
influxctl table create \
  --template-tag tag1 \
  --template-tag tag2 \
  --template-time '%Y-%m-%d' \
  DATABASE_NAME \
  TABLE_NAME
```
{{% /code-placeholders %}}

### Custom partitioning

{{< product-name >}} lets you define a custom partitioning strategy for each table.
A _partition_ is a logical grouping of data stored in [Apache Parquet](https://parquet.apache.org/)
format in the InfluxDB v3 storage engine. By default, data is partitioned by day,
but, depending on your schema and workload, customizing the partitioning
strategy can improve query performance.

Use the `--template-tag` and `--template-time` flags define partition template
parts used to generate partition keys for the table.
If no template flags are provided, the table uses the partition template of the
target database.
For more information, see [Manage data partitioning](/influxdb/cloud-dedicated/admin/custom-partitions/).

{{% note %}}
#### Partition templates can only be applied on create

You can only apply a partition template when creating a table.
There is no way to update a partition template on an existing table.
{{% /note %}}
