---
title: Flux data model
description: >
  ...
menu:
  flux_0_x:
    name: Data model
    parent: Get started
weight: 101
---

To get the most out of using Flux to process your data, you must understand
how Flux structures and operates on data.
The **Flux data model** is comprised of the following:

- [Stream of tables](#stream-of-tables)
- [Table](#table)
- [Column](#column)
- [Row](#row)
- [Group key](#group-key) 

{{< flux/data-model >}}

#### Stream of tables
A **stream of tables** is a collection of zero or more [tables](#table).
Queried data sources return results as a stream of tables.

#### Table
A **table** is a collection of [columns](#column) partitioned by [group key](#group-key).

#### Column
A **column** is a collection of values of the same [basic type](#)
that contains one value for each [row](#row).

#### Row
A **row** is a collection of associated [column](#column) values.

#### Group key
A **group key** defines which column values to include in a table.
All rows in a table contain the same values in group key columns.
All tables in a stream of tables have a unique group key, but group key
modifications are applied to a stream of tables.

##### Example group keys
Group keys contain key-value pairs, where each key represents a column name and
each value represents the column value included in the table.
The following are examples of group keys in a stream of tables with three separate tables.
Each group key represents a table containing data for a unique location:

```
[_measurement: "production", facililty: "us-midwest", _field: "apq"]
[_measurement: "production", facililty: "eu-central", _field: "apq"]
[_measurement: "production", facililty: "ap-east", _field: "apq"]
```

An **empty group key** groups all data in a stream of tables into a single table.

_For an example of how group keys work, see the [Table grouping example](#table-grouping-example) below._

{{% note %}}
#### Data sources define the initial group key
How data is structured when returned from a data source is determined by the
data source.
InfluxDB returns data grouped by [series](/{{< latest "influxdb" >}}/reference/glossary/#series)
Tables are provided to Flux from an underlying data.
{{% /note %}}

{{% note %}}
The Flux data model is separate from the data model of the queried data source.
Queried sources return data structured into columnar tables that Flux understands.
What columns are returned and how tables are structured depends on the queried data source.
{{% /note %}}

## Operate on tables
At its core, Flux operates on tables.
Flux [transformations](/flux/v0.x/function-types/#transformations) take a stream
of tables as input, but operate on each table individually.
For example, aggregate transformations like [`sum()`](/flux/v0.x/stdlib/universe/sum/),
output a stream of tables containing one table for each corresponding input table:

{{< flux/table-ops >}}

## Restructure tables
All tables in a stream of tables are defined by their [group key](#group-key).
To change how data is partitioned or grouped into tables, use functions such as
[`group()`](/flux/v0.x/stdlib/universe/group/) or [`window()`](/flux/v0.x/stdlib/universe/window/)
to modify group keys in a stream of tables.

```js
data
  |> group(columns: ["foo", "bar"], mode: "by")
```

### Table grouping example
The tables below represent data returned from InfluxDB with the following schema:

- `example` measurement
- `loc` tag with two values
- `sensorID` tag with two values
- `temp` and `hum` fields

To modify the group key and see how the sample data is partitioned into new tables,
select columns to group by:

{{< flux/group-key-demo >}}

{{< page-nav prev="/flux/v0.x/get-started/" next="/flux/v0.x/get-started/query-basics/" >}}
