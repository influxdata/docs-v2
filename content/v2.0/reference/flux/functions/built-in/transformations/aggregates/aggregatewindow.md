---
title: aggregateWindow() function
description: The `aggregateWindow()` function applies an aggregate function to fixed windows of time.
aliases:
  - /v2.0/reference/flux/functions/transformations/aggregates/aggregatewindow
menu:
  v2_0_ref:
    name: aggregateWindow
    parent: built-in-aggregates
weight: 501
---

The `aggregateWindow()` function applies an aggregate function to fixed windows of time.

_**Function type:** Aggregate_  

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

As data is windowed into separate tables and aggregated, the `_time` column is dropped from each group key.
This function copies the timestamp from a remaining column into the `_time` column.
View the [function definition](#function-definition).

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/v2.0/reference/flux/language/data-model/#match-parameter-names).
{{% /note %}}

### every

The duration of windows.

_**Data type:** Duration_

### fn

The [aggregate function](/v2.0/reference/flux/functions/built-in/transformations/aggregates) used in the operation.

_**Data type:** Function_

{{% note %}}
Only aggregate functions with a `column` parameter (singular) work with `aggregateWindow()`.
{{% /note %}}

### column

The column on which to operate.
Defaults to `"_value"`.

_**Data type:** String_

### timeSrc

The time column from which time is copied for the aggregate record.
Defaults to `"_stop"`.

_**Data type:** String_

### timeDst

The "time destination" column to which time is copied for the aggregate record.
Defaults to `"_time"`.

_**Data type:** String_

### createEmpty

For windows without data, this will create an empty window and fill
it with a `null` aggregate value.
Defaults to `true`.

_**Data type:** Boolean_

## Examples

###### Using an aggregate function with default parameters

```js
from(bucket: "example-bucket")
  |> range(start: 1h)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent")
  |> aggregateWindow(
    every: 5m,
    fn: mean
  )
```
###### Specifying parameters of the aggregate function

To use `aggregateWindow()` aggregate functions that don't provide defaults for required parameters,
for the `fn` parameter, define an anonymous function with `columns` and `tables` parameters
that pipe-forwards tables into the aggregate function with all required parameters defined:

```js
from(bucket: "example-bucket")
  |> range(start: 1h)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent")
  |> aggregateWindow(
    column: "_value",
    every: 5m,
    fn: (column, tables=<-) => tables |> quantile(q: 0.99, column:column)
  )
```

## Function definition

```js
aggregateWindow = (every, fn, column="_value", timeSrc="_stop", timeDst="_time", tables=<-) =>
	tables
		|> window(every:every)
		|> fn(column:column)
		|> duplicate(column:timeSrc, as:timeDst)
		|> window(every:inf, timeColumn:timeDst)
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:

[InfluxQL aggregate functions](https://docs.influxdata.com/influxdb/latest/query_language/functions/#aggregations)  
[GROUP BY time()](https://docs.influxdata.com/influxdb/latest/query_language/data_exploration/#the-group-by-clause)  
