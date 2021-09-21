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

`aggregateWindow()` requires that input data have `_start` and `_stop` columns to
calculate windows of time to operate on. Use [`range()`](/flux/v0.x/stdlib/universe/range/)
to assign `_start` and `_stop` values.

As data is windowed into separate tables and processed, the `_time` column is dropped from each group key.
This function copies the timestamp from a remaining column into the `_time` column.

`aggregateWindow()` restores the original `_start` and `_stop` values of input data
and, by default, uses `_stop` to set the `_time` value for each aggregated window.
Each row in the output of `aggregateWindow` represents an aggregated window ending at `_time`.

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter.
To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

### every {data-type="duration"}

Duration of windows.

{{% note %}}
#### Calendar months and years
`every` supports all [valid duration units](/flux/v0.x/spec/types/#duration-types),
including **calendar months (`1mo`)** and **years (`1y`)**.

#### Aggregate by week
When aggregating by week (`1w`), weeks are determined using the 
**Unix epoch (1970-01-01T00:00:00Z UTC)**. The Unix epoch was on a Thursday, so
all calculated weeks begin on Thursday.
{{% /note %}}

### fn {data-type="function"}

[Aggregate](/flux/v0.x/function-types/#aggregates)
or [selector function](/flux/v0.x/function-types/#selectors)
used to operate on each window of time.

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

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Use an aggregate function with default parameters](#use-an-aggregate-function-with-default-parameters)
- [Specify parameters of the aggregate function](#specify-parameters-of-the-aggregate-function)
- [Window and aggregate by calendar month](#window-and-aggregate-by-calendar-month)

#### Use an aggregate function with default parameters
The following example uses the default parameters of the
[`mean()` function](/flux/v0.x/stdlib/universe/mean/)
to aggregate time-based windows:

```js
import "sampledata"

data = sampledata.float()
  |> range(start: sampledata.start, stop: sampledata.stop)

data
  |> aggregateWindow(
    every: 20s,
    fn: mean
  )
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
##### Input data
{{% flux/sample set="float" includeRange=true %}}

##### Output data
| _start               | _stop                | _time                | tag |             _value |
| :------------------- | :------------------- | :------------------- | :-- | -----------------: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | t1  |               4.37 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t1  | 12.440000000000001 |        
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:01:00Z | t1  |               9.83 |        

| _start               | _stop                | _time                | tag |            _value |
| :------------------- | :------------------- | :------------------- | :-- | ----------------: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | t2  |             12.41 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t2  |              8.01 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:01:00Z | t2  | 7.859999999999999 |
{{% /expand %}}
{{< /expand-wrapper >}}


#### Specify parameters of the aggregate function
To use functions that don't provide defaults for required parameters with `aggregateWindow()`,
define an anonymous function with `column` and `tables` parameters that pipes-forward
tables into the aggregate or selector function with all required parameters defined:

```js
import "sampledata"

data = sampledata.float()
  |> range(start: sampledata.start, stop: sampledata.stop)

data
  |> aggregateWindow(
    column: "_value",
    every: 20s,
    fn: (column, tables=<-) => tables |> quantile(q: 0.99, column:column)
  )
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
##### Input data
{{% flux/sample set="float" includeRange=true %}}

##### Output data
| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | t1  |  10.92 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t1  |  17.53 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:01:00Z | t1  |  15.23 |

| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | t2  |  19.85 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t2  |  19.77 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:01:00Z | t2  |  13.86 |
{{% /expand %}}
{{< /expand-wrapper >}}

#### Window and aggregate by calendar month
```js
import "sampledata"

data = sampledata.float()
  |> range(start: sampledata.start, stop: sampledata.stop)

data
  |> aggregateWindow(every: 1mo, fn: mean)
```

{{% expand "View input and output" %}}
##### Input data
{{% flux/sample set="float" includeRange=true %}}

##### Output data
| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:01:00Z | t1  |   8.88 |

| _start               | _stop                | _time                | tag |            _value |
| :------------------- | :------------------- | :------------------- | :-- | ----------------: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:01:00Z | t2  | 9.426666666666668 |
{{% /expand %}}
