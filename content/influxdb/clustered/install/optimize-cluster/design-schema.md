---
title: Design your schema
description: >
  Use schema design guidelines to improve write and query performance in your
  InfluxDB cluster.
menu:
  influxdb_clustered:
    name: Design your schema
    parent: Optimize your cluster
weight: 201
related:
  - /influxdb/clustered/write-data/best-practices/schema-design/
---

Schema design can have a significant impact on both write and query performance
in your InfluxDB cluster. The items below cover high-level considerations and
recommendation. For detailed recommendations, see
[Schema design recommendations](/influxdb/clustered/write-data/best-practices/schema-design/).

## Understand the difference between tags and fields

In the [InfluxDB data structure](/influxdb/clustered/write-data/best-practices/schema-design/#influxdb-data-structure),
there are three main "categories" of information--timestamps, tags, and fields.
Understanding the difference between what should be a tag and what should be a
field is important when designing your schema.

Use the following guidelines to determine what should be tags versus fields:

- Use tags to store metadata that provides information about the source or
  context of the data.
- Use fields to store measured values.
- Field values typically change over time. Tag values do not.
- Tag values can only be strings.
- Field values can be any of the following data types:
  - Integer
  - Unsigned integer
  - Float
  - String
  - Boolean

For more information, see [Tags versus fields](/influxdb/clustered/write-data/best-practices/schema-design/#tags-versus-fields).

## Schema restrictions

InfluxDB enforces the following schema restrictions:

- You cannot use the same name for a tag and a field in the same table.
- By default, a table can have up to 250 columns.

For more information, see [InfluxDB schema restrictions](/influxdb/clustered/write-data/best-practices/schema-design/#schema-restrictions).

## Design for performance

The following guidelines help to ensure write and query performance:

{{% caption %}}
Follow the links below for more detailed information.
{{% /caption %}}

- [Avoid wide schemas](/influxdb/clustered/write-data/best-practices/schema-design/#avoid-wide-schemas):
  A wide schema is one with a large number of columns (tags and fields).
- [Avoid sparse schemas](/influxdb/clustered/write-data/best-practices/schema-design/#avoid-sparse-schemas):
  A sparse schema is one where, for many rows, columns contain null values.
- [Keep table schemas homogenous](/influxdb/clustered/write-data/best-practices/schema-design/#table-schemas-should-be-homogenous):
  A homogenous table schema is one where every row has values for all tags and fields.
- [Use the best data type for your data](/influxdb/clustered/write-data/best-practices/schema-design/#use-the-best-data-type-for-your-data):
  Write integers as integers, decimals as floats, and booleans as booleans.
  Queries against a field that stores integers outperforms a query against string data.

## Design for query simplicity

The following guidelines help to ensure that, when querying data, the schema
makes it easy to write queries:

{{% caption %}}
Follow the links below for more detailed information.
{{% /caption %}}

- [Keep table names, tags, and fields simple](/influxdb/clustered/write-data/best-practices/schema-design/#keep-table-names-tags-and-fields-simple):
  Use one tag or one field for each data attribute.
  If your source data contains multiple data attributes in a single parameter,
  split each attribute into its own tag or field.
- [Avoid keywords and special characters](/influxdb/clustered/write-data/best-practices/schema-design/#avoid-keywords-and-special-characters):
  Reserved keywords or special characters in table names, tag keys, and field
  keys makes writing queries more complex.

{{< page-nav prev="/influxdb/clustered/install/optimize-cluster/" prevText="Optimize your cluster" next="/influxdb/clustered/install/optimize-cluster/write-methods/" nextText="Identify write methods" >}}