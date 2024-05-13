---
title: Define custom partitions
description: >
  Use the [`influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/)
  to define custom partition strategies when creating a database or table.
menu:
  influxdb_clustered:
    parent: Manage data partitioning
weight: 202
related:
  - /influxdb/clustered/reference/cli/influxctl/database/create/
  - /influxdb/clustered/reference/cli/influxctl/table/create/
---

Use the [`influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/)
to define custom partition strategies when creating a database or table.
By default, {{< product-name >}} partitions data by day.

The partitioning strategy of a database or table is determined by a
[partition template](/influxdb/clustered/admin/custom-partitions/#partition-templates)
which defines the naming pattern for [partition keys](/influxdb/clustered/admin/custom-partitions/#partition-keys).
Partition keys uniquely identify each partition.
When a partition template is applied to a database, it becomes the default template
for all tables in that database, but can be overridden when creating a
table.

- [Create a database with a custom partition template](#create-a-database-with-a-custom-partition-template)
- [Create a table with a custom partition template](#create-a-table-with-a-custom-partition-template)
- [Example partition templates](#example-partition-templates)

{{% note %}}

#### Partition templates can only be applied on create

You can only apply a partition template when creating a database or table.
There is no way to update a partition template on an existing resource.
{{% /note %}}

Use the following command flags to identify
[partition template parts](/influxdb/clustered/admin/custom-partitions/partition-templates/#tag-part-templates):

- `--template-tag`: An [InfluxDB tag](/influxdb/clustered/reference/glossary/#tag)
  to use in the partition template.
- `--template-tag-bucket`: An [InfluxDB tag](/influxdb/clustered/reference/glossary/#tag)
  and number of "buckets" to group tag values into.
  Provide the tag key and the number of buckets to bucket tag values into
  separated by a comma: `tagKey,N`.
- `--template-timeformat`: A [Rust strftime date and time](/influxdb/clustered/admin/custom-partitions/partition-templates/#time-part-templates)
  string that specifies the time format in the partition template and determines
  the time interval to partition by.

{{% note %}}
A partition template can include up to 7 total tag and tag bucket parts
and only 1 time part.
{{% /note %}}

_View [partition template part restrictions](/influxdb/clustered/admin/custom-partitions/partition-templates/#restrictions)._

{{% note %}}
#### Always provide a time format when using custom partitioning

When defining a custom partition template for your database or table using any
of the `influxctl` `--template-*` flags, always include the `--template-timeformat`
flag with a time format to use in your partition template.
Otherwise, InfluxDB omits time from the partition template and won't compact partitions.
{{% /note %}}

## Create a database with a custom partition template

The following example creates a new `example-db` database and applies a partition
template that partitions by distinct values of two tags (`room` and `sensor-type`),
bucketed values of the `customerID` tag, and by week using the time format `%Y wk:%W`:

```sh
influxctl database create \
  --template-tag room \
  --template-tag sensor-type \
  --template-tag-bucket customerID,500 \
  --template-timeformat '%Y wk:%W' \
  example-db
```

## Create a table with a custom partition template

The following example creates a new `example-table` table in the `example-db`
database and applies a partition template that partitions by distinct values of
two tags (`room` and `sensor-type`), bucketed values of the `customerID` tag,
and by month using the time format `%Y-%m`:

```sh
influxctl table create \
  --template-tag room \
  --template-tag sensor-type \
  --template-tag-bucket customerID,500 \
  --template-timeformat '%Y-%m' \
  example-db \
  example-table
```

## Example partition templates

Given the following [line protocol](/influxdb/clustered/reference/syntax/line-protocol/)
with a `2024-01-01T00:00:00Z` timestamp:

```text
prod,line=A,station=weld1 temp=81.9,qty=36i 1704067200000000000
```

##### Partitioning by distinct tag values

| Description             | Tag part(s)       | Time part  | Resulting partition key  |
| :---------------------- | :---------------- | :--------- | :----------------------- |
| By day (default)        |                   | `%Y-%m-%d` | 2024-01-01               |
| By day (non-default)    |                   | `%d %b %Y` | 01 Jan 2024              |
| By week                 |                   | `%Y wk:%W` | 2024 wk:01               |
| By month                |                   | `%Y-%m`    | 2024-01                  |
| Single tag, by day      | `line`            | `%F`       | A \| 2024-01-01          |
| Single tag, by week     | `line`            | `%Y wk:%W` | A \| 2024 wk:01          |
| Single tag, by month    | `line`            | `%Y-%m`    | A \| 2024-01             |
| Multiple tags, by day   | `line`, `station` | `%F`       | A \| weld1 \| 2024-01-01 |
| Multiple tags, by week  | `line`, `station` | `%Y wk:%W` | A \| weld1 \| 2024 wk:01 |
| Multiple tags, by month | `line`, `station` | `%Y-%m`    | A \| weld1 \| 2024-01    |

##### Partition by tag buckets

| Description                        | Tag part | Tag bucket part | Time part  | Resulting partition key |
| :--------------------------------- | :------- | :-------------- | :--------- | :---------------------- |
| Distinct tag, tag buckets, by day  | `line`   | `station,100`   | `%F`       | A \| 3 \| 2024-01-01    |
| Distinct tag, tag buckets, by week | `line`   | `station,500`   | `%Y wk:%W` | A \| 303 \| 2024 wk:01  |
