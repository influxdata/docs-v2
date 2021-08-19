---
title: holtWinters() function
description: >
  The `holtWinters()` function applies the Holt-Winters forecasting method to input tables.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/holtwinters
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/holtwinters/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/holtwinters/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/holtwinters/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/holtwinters/
menu:
  flux_0_x_ref:
    name: holtWinters
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#holt-winters, InfluxQL HOLT_WINTERS()
introduced: 0.38.0
---

The `holtWinters()` function applies the Holt-Winters forecasting method to input tables.

_**Output data type:** Float_

```js
holtWinters(
  n: 10,
  seasonality: 4,
  interval: 30d,
  withFit: false,
  timeColumn: "_time",
  column: "_value",
)
```

The Holt-Winters method predicts [`n`](#n) seasonally-adjusted values for the
specified [`column`](#column) at the specified [`interval`](#interval).
For example, if `interval` is six minutes (`6m`) and `n` is `3`, results include three predicted
values six minutes apart.

#### Seasonality
[`seasonality`](#seasonality) delimits the length of a seasonal pattern according to `interval`.
If your `interval` is two minutes (`2m`) and `seasonality` is `4`, then the seasonal pattern occurs every eight minutes or every four data points. Likewise, if your `interval` is two months (`2mo`) and `seasonality` is `4`, then the seasonal pattern occurs every eight months or every four data points.
If data doesn't have a seasonal pattern, set `seasonality` to `0`.

#### Space values evenly in time
`holtWinters()` expects values evenly spaced in time.
To ensure `holtWinters()` values are spaced evenly in time, the following rules apply:

- Data is grouped into time-based "buckets" determined by the `interval`.
- If a bucket includes many values, the first value is used.
- If a bucket includes no values, a missing value (`null`) is added for that bucket.

By default, `holtWinters()` uses the first value in each time bucket to run the Holt-Winters calculation.
To specify other values to use in the calculation, use:

- [`window()`](/flux/v0.x/stdlib/universe/window/)
  with [selectors](/flux/v0.x/function-types#selectors/)
  or [aggregates](/flux/v0.x/function-types#aggregates)
- [`aggregateWindow()`](/flux/v0.x/stdlib/universe/aggregatewindow)

#### Fitted model
The `holtWinters()` function applies the [Nelder-Mead optimization](https://en.wikipedia.org/wiki/Nelder%E2%80%93Mead_method)
to include "fitted" data points in results when [`withFit`](#withfit) is set to `true`.

#### Null timestamps
`holtWinters()` discards rows with `null` timestamps before running the Holt-Winters calculation.

#### Null values
`holtWinters()` treats `null` values as missing data points and includes them in the Holt-Winters calculation.

## Parameters

### n {data-type="int"}
({{< req >}})
The number of values to predict.

### seasonality {data-type="int"}
The number of points in a season.
Default is `0`.

### interval {data-type="duration"}
({{< req >}})
The interval between two data points.

### withFit {data-type="bool"}
Return [fitted data](#fitted-model) in results.
Default is `false`.

### timeColumn {data-type="string"}
The time column to use.
Default is `"_time"`.

### column {data-type="string"}
The column to operate on.
Default is `"_value"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

##### Use aggregateWindow to prepare data for holtWinters
```js
from(bucket: "example-bucket")
    |> range(start: -7y)
    |> filter(fn: (r) => r._field == "water_level")
    |> aggregateWindow(every: 379m, fn: first).
    |> holtWinters(n: 10, seasonality: 4, interval: 379m)
```
