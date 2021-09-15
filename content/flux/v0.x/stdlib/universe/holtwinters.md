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
  with [selectors](/flux/v0.x/function-types/#selectors)
  or [aggregates](/flux/v0.x/function-types/#aggregates)
- [`aggregateWindow()`](/flux/v0.x/stdlib/universe/aggregatewindow)

###### Use aggregateWindow to normalize irregular times
```js
data
  |> aggregateWindow(every: 1d, fn: first)
  |> holtWinters(n: 10, seasonality: 4, interval: 1d)
```

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
{{% flux/sample-example-intro plural=true %}}

- [Use holtWinters to predict future values](#use-holtwinters-to-predict-future-values)
- [Use holtWinters with seasonality to predict future values](#use-holtwinters-with-seasonality-to-predict-future-values)
- [Use the holtWinters fitted model to predict future values](#use-the-holtwinters-fitted-model-to-predict-future-values)

#### Use holtWinters to predict future values
```js
import "sampledata"

sampledata.int()
  |> holtWinters(n: 6, interval: 10s)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag |             _value |
| :------------------- | :-- | -----------------: |
| 2021-01-01T00:01:00Z | t1  | 10.955834804389518 |
| 2021-01-01T00:01:10Z | t1  | 10.930165921204969 |
| 2021-01-01T00:01:20Z | t1  | 10.914688653595203 |
| 2021-01-01T00:01:30Z | t1  | 10.905759343909201 |
| 2021-01-01T00:01:40Z | t1  | 10.900719277060372 |
| 2021-01-01T00:01:50Z | t1  | 10.897906726242955 |

| _time                | tag |             _value |
| :------------------- | :-- | -----------------: |
| 2021-01-01T00:01:00Z | t2  |  6.781008791726221 |
| 2021-01-01T00:01:10Z | t2  |  6.781069271640753 |
| 2021-01-01T00:01:20Z | t2  |  6.781073869897851 |
| 2021-01-01T00:01:30Z | t2  | 6.7810742195001135 |
| 2021-01-01T00:01:40Z | t2  |  6.781074246080124 |
| 2021-01-01T00:01:50Z | t2  |  6.781074248100982 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Use holtWinters with seasonality to predict future values
```js
import "sampledata"

sampledata.int()
  |> holtWinters(
    n: 4,
    interval: 10s,
    seasonality: 4
  )
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag |             _value |
| :------------------- | :-- | -----------------: |
| 2021-01-01T00:01:00Z | t1  |  7.179098046049717 |
| 2021-01-01T00:01:10Z | t1  |  17.01106624302682 |
| 2021-01-01T00:01:20Z | t1  | 14.576432091790977 |
| 2021-01-01T00:01:30Z | t1  |  6.968535480723005 |

| _time                | tag |               _value |
| :------------------- | :-- | -------------------: |
| 2021-01-01T00:01:00Z | t2  | 0.008498516062705495 |
| 2021-01-01T00:01:10Z | t2  |    4.311588701815885 |
| 2021-01-01T00:01:20Z | t2  |    4.306517319025279 |
| 2021-01-01T00:01:30Z | t2  |    2.473640466434541 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Use the holtWinters fitted model to predict future values
```js
import "sampledata"

sampledata.int()
  |> holtWinters(
    n: 3,
    interval: 10s,
    withFit: true
  )
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag |             _value |
| :------------------- | :-- | -----------------: |
| 2021-01-01T00:00:00Z | t1  |               -2.0 |
| 2021-01-01T00:00:10Z | t1  |  9.218975712746163 |
| 2021-01-01T00:00:20Z | t1  | 10.724838162080957 |
| 2021-01-01T00:00:30Z | t1  |  11.02931521239947 |
| 2021-01-01T00:00:40Z | t1  |   11.0379002238265 |
| 2021-01-01T00:00:50Z | t1  | 10.994404043609528 |
| 2021-01-01T00:01:00Z | t1  | 10.955834804389518 |
| 2021-01-01T00:01:10Z | t1  | 10.930165921204969 |
| 2021-01-01T00:01:20Z | t1  | 10.914688653595203 |

| _time                | tag |            _value |
| :------------------- | :-- | ----------------: |
| 2021-01-01T00:00:00Z | t2  |              19.0 |
| 2021-01-01T00:00:10Z | t2  | 8.907308429189435 |
| 2021-01-01T00:00:20Z | t2  | 4.983321898435179 |
| 2021-01-01T00:00:30Z | t2  | 6.633066160485693 |
| 2021-01-01T00:00:40Z | t2  | 6.769755828568384 |
| 2021-01-01T00:00:50Z | t2  | 6.780213338483446 |
| 2021-01-01T00:01:00Z | t2  | 6.781008791726221 |
| 2021-01-01T00:01:10Z | t2  | 6.781069271640753 |
| 2021-01-01T00:01:20Z | t2  | 6.781073869897851 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
