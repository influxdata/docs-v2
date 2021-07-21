---
title: aggregateWindow() function
description: The `aggregateWindow()` function applies an aggregate function to fixed windows of time.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/aggregatewindow
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/aggregatewindow/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/
menu:
  flux_0_x_ref:
    name: aggregateWindow
    parent: universe
weight: 102
related:
  - /{{< latest "influxdb" >}}/query-data/flux/window-aggregate/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#aggregations, InfluxQL – Aggregate functions
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-group-by-clause, InfluxQL – GROUP BY time()
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

The `aggregateWindow()` function applies an aggregate or selector function
(any function with a `column` parameter) to fixed windows of time.

```js
aggregateWindow(
  every: 1m,
  fn: mean,
  column: "_value",
  timeSrc: "_stop",
  timeDst: "_time",
  createEmpty: true
)
```

As data is windowed into separate tables and processed, the `_time` column is dropped from each group key.
This function copies the timestamp from a remaining column into the `_time` column.

`aggregateWindow()` restores the original `_start` and `_stop` values of input data
and, by default, uses `_stop` to set the `_time` value for each aggregated window.
Each row in the output of `aggregateWindow` represents an aggregated window ending at `_time`.

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

### every {data-type="duration"}

The duration of windows.

{{% note %}}
#### Calendar months and years
`every` supports all [valid duration units](/flux/v0.x/spec/types/#duration-types),
including **calendar months (`1mo`)** and **years (`1y`)**.
{{% /note %}}

### fn {data-type="function"}

[Aggregate](/flux/v0.x/function-types/#aggregates)
or [selector function](/flux/v0.x/function-types/#selectors)
used in the operation.

{{% note %}}
Only aggregate and selector functions with a `column` parameter (singular) work with `aggregateWindow()`.
{{% /note %}}

### column {data-type="string"}

The column on which to operate.
Defaults to `"_value"`.

### timeSrc {data-type="string"}

The time column from which time is copied for the aggregate record.
Defaults to `"_stop"`.

### timeDst {data-type="string"}

The "time destination" column to which time is copied for the aggregate record.
Defaults to `"_time"`.

### createEmpty {data-type="bool"}

For windows without data, create a single-row table for each empty window (using
[`table.fill()`](/flux/v0.x/stdlib/experimental/table/fill/)).
Defaults to `true`.

{{% note %}}
When using `createEmpty: true`, [aggregate functions](/flux/v0.x/function-types/#aggregates)
return empty tables, but [selector functions](/flux/v0.x/function-types/#selectors) do not.
By design, selectors drop empty tables.
{{% /note %}}

## Examples
The examples below use a `data` variable to represent a filtered data set.

```js
data = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent")
```

##### Use an aggregate function with default parameters
The following example uses the default parameters of the
[`mean()` function](/flux/v0.x/stdlib/universe/mean/)
to aggregate time-based windows:

```js
data
  |> aggregateWindow(
    every: 5m,
    fn: mean
  )
```
##### Specify parameters of the aggregate function
To use functions that don't provide defaults for required parameters with `aggregateWindow()`,
define an anonymous function with `column` and `tables` parameters that pipes-forward
tables into the aggregate or selector function with all required parameters defined:

```js
data
  |> aggregateWindow(
    column: "_value",
    every: 5m,
    fn: (column, tables=<-) => tables |> quantile(q: 0.99, column:column)
  )
```

##### Window and aggregate by calendar month
```js
data
  |> aggregateWindow(every: 1mo, fn: mean)
```
