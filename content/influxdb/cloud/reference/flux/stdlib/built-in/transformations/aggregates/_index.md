---
title: Flux built-in aggregate transformations
list_title: Built-in aggregate transformations
description: >
  Flux's aggregate transformations take values from an input table and aggregate them in some way.
  Output tables contain a single row with the aggregated value.
aliases:
  - /influxdb/cloud/reference/flux/functions/transformations/aggregates
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/aggregates/
menu:
  influxdb_cloud_ref:
    parent: built-in-transformations
    name: Aggregates
    identifier: built-in-aggregates
weight: 401
influxdb/v2.0/tags: [aggregates, built-in, functions]
related:
  - /influxdb/cloud/query-data/flux/window-aggregate/
---

Flux's built-in aggregate transformations take values from an input table and aggregate them in some way.
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

### aggregateWindow helper function
The [`aggregateWindow()` function](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow)
does most of the work needed when aggregating data.
It windows and aggregates the data, then combines windowed tables into a single output table.

### Aggregate functions
The following aggregate functions are available:

{{< children type="functions" >}}

### Aggregate selectors
The following functions are both aggregates and selectors.
Each returns `n` values after performing an aggregate operation.
They are categorized as selector functions in this documentation:

- [highestAverage](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/highestaverage)
- [highestCurrent](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/highestcurrent)
- [highestMax](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/highestmax)
- [lowestAverage](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/lowestaverage)
- [lowestCurrent](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/lowestcurrent)
- [lowestMin](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/lowestmin)
