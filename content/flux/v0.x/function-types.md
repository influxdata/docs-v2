---
title: Flux function types and behaviors
description: >
  placeholder
menu:
  flux_0_x_ref:
    name: Function types
weight: 10
related:
  - /flux/v0.x/stdlib/
aliases:
  - /influxdb/v2.0/reference/flux/functions/inputs
  - /influxdb/v2.0/reference/flux/functions/built-in/inputs/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/inputs/
  - /influxdb/cloud/reference/flux/stdlib/built-in/inputs/
  - /influxdb/v2.0/reference/flux/functions/outputs
  - /influxdb/v2.0/reference/flux/functions/built-in/outputs/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/outputs/
  - /influxdb/cloud/reference/flux/stdlib/built-in/outputs/  
  - /influxdb/v2.0/reference/flux/functions/misc
  - /influxdb/v2.0/reference/flux/functions/built-in/misc/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/misc/
  - /influxdb/cloud/reference/flux/stdlib/built-in/misc/
  - /influxdb/v2.0/reference/flux/functions/built-in/tests/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/tests/
  - /influxdb/cloud/reference/flux/stdlib/built-in/tests/
  - /influxdb/v2.0/reference/flux/functions/transformations
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/  
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/  
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/stream-table/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stream-table/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/stream-table/
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/
---

- [Inputs](#inputs)
- [Outputs](#outputs)
- [Transformations](#transformations)
- [Dynamic queries](#dynamic-queries)
- [Type conversions](#type-conversions)
- [Tests](#tests)

---

## Inputs
Flux input functions return data from data sources.
The following input functions are available:

{{< list-all-functions filters="inputs" >}}

---

## Outputs
Flux output functions yield results or send data to a specified output destination.
The following output functions are are available:

{{< list-all-functions filters="outputs" >}}

---

## Transformations
Flux transformation take a stream of tables as input, transform the data in some way,
and output a stream of tables.
Transformations cover a broad range of functions, but the following categorizations
highlight important behaviors associated with specific transformation functions.

- [Aggregates](#aggregates)
- [Selectors](#selectors)

{{% note %}}
#### aggregateWindow helper function
The [`aggregateWindow()` function](/flux/v0.x/stdlib/universe/aggregatewindow)
windows or groups data by time and applies an aggregate or selector function
to input tables.
**All aggregate and selector functions** work with `aggregateWindow()`.
{{% /note %}}

### Aggregates
Flux's aggregate transformations take values from an input table and aggregate them in some way.
Output tables contain a single row with the aggregated value.

Aggregate operations output a table for every input table they receive.
You must provide a column to aggregate.
Any output table will have the following properties:

- It always contains a single record.
- It will have the same group key as the input table.
- It will contain a column for the provided aggregate column.
  The column label will be the same as the input table.
  The type of the column depends on the specific aggregate operation.
  The value of the column will be `null` if the input table is empty or the input column has only `null` values.
- It will not have a `_time` column.

{{< list-all-functions filters="aggregates" >}}

#### Aggregate selectors
The following functions are both aggregates and selectors.
Each returns `n` values after performing an aggregate operation.
They are categorized as [selector functions](#selectors) in this documentation:

- [highestAverage()](/flux/v0.x/stdlib/universe/highestaverage)
- [highestCurrent()](/flux/v0.x/stdlib/universe/highestcurrent)
- [highestMax()](/flux/v0.x/stdlib/universe/highestmax)
- [lowestAverage()](/flux/v0.x/stdlib/universe/lowestaverage)
- [lowestCurrent()](/flux/v0.x/stdlib/universe/lowestcurrent)
- [lowestMin()](/flux/v0.x/stdlib/universe/lowestmin)

### Selectors
Flux selector functions return one or more records based on function logic.
The output table is different than the input table, but individual row values are not.

The following selector functions are available:

{{< list-all-functions filters="selectors" >}}

#### Selectors and aggregates
The following functions can be used as both selectors or aggregates, but they are
categorized as [aggregate functions](#aggregates) in this documentation:

- [median()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/median)
- [quantile()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/quantile)

---

## Dynamic queries
Flux dynamic query functions extract a table from a stream of tables and access its
columns and records.
For recommended usage, see [Extract scalar values](/influxdb/v2.0/query-data/flux/scalar-values/).

{{< list-all-functions filters="dynamic queries" >}}

---

## Type conversions
Flux type conversion functions convert scalar values or columns to a specific data type.
The following type conversion functions are available:

{{< list-all-functions filters="type-conversions" >}}

---

## Tests
Flux testing functions test various aspects of data.
Tests return either `true` or `false`, a transformed stream of tables, or, upon failure, an error.
The following testing functions are available:

{{< list-all-functions filters="tests" >}}
