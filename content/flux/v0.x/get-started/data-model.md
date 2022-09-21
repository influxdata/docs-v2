---
title: Flux data model
description: >
  Learn how Flux structures data and how you can modify that structure to shape
  data to your needs.
menu:
  flux_0_x:
    name: Data model
    parent: Get started
weight: 101
related:
  - /resources/videos/flux-basics/
---

To get the most out of using Flux to process your data, you must understand
how Flux structures and operates on data.
The **Flux data model** comprises the following:

- [Stream of tables](#stream-of-tables)
- [Table](#table)
- [Column](#column)
- [Row](#row)
- [Group key](#group-key) 

{{< flux/data-model >}}

#### Stream of tables
A **stream of tables** is a collection of zero or more [tables](#table).
Data sources return results as a stream of tables.

#### Table
A **table** is a collection of [columns](#column) partitioned by [group key](#group-key).

#### Column
A **column** is a collection of values of the same [basic type](#)
that contains one value for each [row](#row).

#### Row
A **row** is a collection of associated [column](#column) values.

#### Group key
A **group key** defines which columns to use to group tables in a stream of tables.
Each table in a stream of tables represents a unique **group key instance**.
All rows in a table contain the same values for each group key column.

##### Example group key
A group key can be represented by an array of column labels.

```
[_measurement, facility, _field]
```

##### Example group key instances
Group key instances (unique to each table) include key-value pairs that identify
each column name in the table that has the same value.
The following are examples of group key instances in a stream of tables with three separate tables.
Each represents a table containing data for a unique location:

```
[_measurement: "production", facility: "us-midwest", _field: "apq"]
[_measurement: "production", facility: "eu-central", _field: "apq"]
[_measurement: "production", facility: "ap-east", _field: "apq"]
```

An **empty group key** groups all data in a stream of tables into a single table.

_For an example of how group keys work, see the [Table grouping example](#table-grouping-example) below._

{{< youtube 5-AwY8ly6NA >}}

## Data sources determine data structure
The Flux data model is separate from the queried data source model.
Queried sources return data structured into columnar tables.
The table structure and columns included depends on the data source. 

For example, InfluxDB returns data grouped by [series](/{{< latest "influxdb" >}}/reference/glossary/#series),
so each table in the returned stream of tables represents a unique series.
However, [SQL data sources](/flux/v0.x/stdlib/sql/from/) return a stream of tables
with a single table and an empty group key.

### Column labels beginning with underscores
Some data sources return column labels prefixed with an underscore (`_`).
This is a Flux convention used to identify important or reserved column names.
While the underscore doesn't change the functionality of the column, many
functions in the [Flux standard library](/flux/v0.x/stdlib/) expect or require
these specific column names.

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

{{< page-nav prev="/flux/v0.x/get-started/" next="/flux/v0.x/get-started/syntax-basics/" >}}
