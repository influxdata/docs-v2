---
title: Define custom partitions
description: >
  Use the [`influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/)
  to define custom partition strategies when creating a database or measurement.
menu:
  influxdb_cloud_dedicated:
    parent: Manage data partitioning
weight: 202
related:
  - /influxdb/cloud-dedicated/reference/cli/influxctl/database/create/
---

Use the [`influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/)
to define custom partition strategies when creating a database or measurement.
By default, {{< product-name >}} partitions data by day.

The partitioning strategy of a database or measurement is determined by a
[partition template](/influxdb/cloud-dedicated/admin/custom-partitions/#partition-templates) which defines the naming pattern for [partition keys](/influxdb/cloud-dedicated/admin/custom-partitions/#partition-keys).
Partition keys uniquely identify each partition.
When a partition template is applied to a database, it becomes the default template
for all measurements in that database, but can be overridden when creating a
measurement.

- [Create a database with a custom partition template](#create-a-database-with-a-custom-partition-template)
- [Create a measurement with a custom partition template](#create-a-measurement-with-a-custom-partition-template)
- [Example partition templates](#example-partition-templates)

{{% note %}}
#### Partition templates can only be applied on create

You can only apply a partition template when creating a database or measurement.
There is no way to update a partition template on an existing resource.
{{% /note %}}

Use the following command flags to identify
[partition template parts](/influxdb/cloud-dedicated/admin/custom-partitions/partition-templates/#tag-part-templates):

- `--template-tag`: An [InfluxDB tag](/influxdb/cloud-dedicated/reference/glossary/#tag)
  to use in the partition template.
  _Supports up to 7 of these flags._
- `--template-time`: A [Rust strftime date and time](/influxdb/cloud-dedicated/admin/custom-partitions/partition-templates/#time-part-templates)
  string that specifies the time format in the partition template and determines
  the time interval to partition by.

_View [partition template part restrictions](/influxdb/cloud-dedicated/admin/custom-partitions/partition-templates/#restrictions)._
  
## Create a database with a custom partition template

The following example creates a new `example-db` database and applies a partition
template that partitions by two tags (`room` and `sensor-type`) and by hour using
the time format `%Y-%m-%d %H:00`:

```sh
influxctl database create \
  --template-tag room \
  --template-tag sensor-type \
  --template-time '%Y-%m-%d %H:00' \
  example-db
```

## Create a measurement with a custom partition template

The following example creates a new `example-meas` measurement and applies a
partition template that partitions by two tags (`room` and `sensor-type`) and by
week using the time format `%Y-%m-%d %H:00`:

```sh
influxctl measurement create \
  --template-tag room \
  --template-tag sensor-type \
  --template-time '%Y-%m-%d %H:00' \
  example-meas
```

## Example partition templates

Given the following [line protocol](/influxdb/cloud-dedicated/reference/syntax/line-protocol/)
with a `2024-01-01T00:00:00Z` timestamp:

```text
prod,line=A,station=weld1 temp=81.9,qty=36i 1704067200000000000
```

| Description             | Tag part(s)       | Time part  | Resulting partition key  |
| :---------------------- | :---------------- | :--------- | :----------------------- |
| By day (default)        |                   | `%Y-%m-%d` | 2024-01-01               |
| By day (non-default)    |                   | `%d %b %Y` | 01 Jan 2024              |
| By week                 |                   | `%Y wk:%W` | 2024 wk:01               |
| By month                |                   | `%Y-%m`    | 2024-01                  |
| By hour                 |                   | `%F %H:00` | 2024-01-01 00:00         |
| Single tag, by day      | `line`            | `%F`       | A \| 2024-01-01          |
| Single tag, by week     | `line`            | `%Y wk:%W` | A \| 2024 wk:01          |
| Single tag, by month    | `line`            | `%Y-%m`    | A \| 2024-01             |
| Multiple tags, by day   | `line`, `station` | `%F`       | A \| weld1 \| 2024-01-01 |
| Multiple tags, by week  | `line`, `station` | `%Y wk:%W` | A \| weld1 \| 2024 wk:01 |
| Multiple tags, by month | `line`, `station` | `%Y-%m`    | A \| weld1 \| 2024-01    |
