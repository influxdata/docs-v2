---
title: Flux built-in aggregate functions
list_title: Built-in aggregate functions
description: Flux's built-in aggregate functions take values from an input table and aggregate them in some way.
aliases:
  - /v2.0/reference/flux/functions/transformations/aggregates
  - /v2.0/reference/flux/functions/built-in/transformations/aggregates/
menu:
  v2_0_ref:
    parent: built-in-transformations
    name: Aggregates
    identifier: built-in-aggregates
weight: 401
v2.0/tags: [aggregates, built-in, functions]
---

Flux's built-in aggregate functions take values from an input table and aggregate them in some way.
The output table contains a single row with the aggregated value.

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
The [`aggregateWindow()` function](/v2.0/reference/flux/functions/built-in/transformations/aggregates/aggregatewindow)
does most of the work needed when aggregating data.
It windows and aggregates the data, then combines windowed tables into a single output table.

### Aggregate functions
The following aggregate functions are available:

{{< children type="functions" >}}

### Aggregate selectors
The following functions are both aggregates and selectors.
Each returns `n` values after performing an aggregate operation.
They are categorized as selector functions in this documentation:

- [highestAverage](/v2.0/reference/flux/functions/transformations/selectors/highestaverage)
- [highestCurrent](/v2.0/reference/flux/functions/transformations/selectors/highestcurrent)
- [highestMax](/v2.0/reference/flux/functions/transformations/selectors/highestmax)
- [lowestAverage](/v2.0/reference/flux/functions/transformations/selectors/lowestaverage)
- [lowestCurrent](/v2.0/reference/flux/functions/transformations/selectors/lowestcurrent)
- [lowestMin](/v2.0/reference/flux/functions/transformations/selectors/lowestmin)
