---
title: Get started with {{< product-name >}}
description: >
  {{< product-name >}} is the fully managed, cloud-hosted version of InfluxDB 3
  Enterprise. Learn how to get started writing and querying time series data
  with {{< product-name >}}.
menu:
  influxdb3_cloud:
    name: Get started
weight: 3
related:
  - /influxdb3/cloud/admin/
  - /influxdb3/cloud/write-data/
  - /influxdb3/cloud/query-data/
---

{{% product-name %}} is the fully managed, cloud-hosted version of
[InfluxDB 3 Enterprise](/influxdb3/enterprise/).
InfluxData provisions and operates the underlying infrastructure, so you can
write and query time series data without running or scaling servers yourself.

This guide walks through the basic steps of getting started with
{{% product-name %}}, including the following:

{{< children type="ordered-list" >}}

> [!Important]
> #### InfluxDB 3 Cloud is in early access
>
> {{% product-name %}} is currently available to select customers through an
> early access program and isn't yet generally available.
> Early access provides a focused subset of InfluxDB 3 Enterprise
> capabilities as a managed service.
> Availability, features, and workflows may change before general availability.

## Data model

The {{% product-name %}} server contains logical databases; databases contain
tables; and tables are comprised of columns.

Compared to previous versions of InfluxDB, you can think of a database as an
InfluxDB v2 `bucket` or an InfluxDB v1 `db/retention_policy`.
A `table` is equivalent to an InfluxDB v1 and v2 `measurement`.

Columns in a table represent time, tags, and fields. Columns can be one of the
following types:

- String dictionary (tag)
- `int64` (field)
- `float64` (field)
- `uint64` (field)
- `bool` (field)
- `string` (field)
- `time` (time with nanosecond precision)

In {{% product-name %}}, every table has a primary key--the ordered set of tags
and the time--for its data.
The primary key uniquely identifies each series and determines the sort order
for all Parquet files related to the table. When you create a table, either
through an explicit call or by writing data into a table for the first time, it
sets the primary key to the tags in the order they arrived.
Although InfluxDB is still a _schema-on-write_ database, the tag column
definitions for a table are immutable.

Tags should hold unique identifying information like `sensor_id`, `building_id`,
or `trace_id`. All other data should be stored as fields.

{{< page-nav next="/influxdb3/cloud/get-started/setup/" nextText="Set up InfluxDB" >}}
