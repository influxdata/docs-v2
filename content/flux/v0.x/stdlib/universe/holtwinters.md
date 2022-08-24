---
title: holtWinters() function
description: >
  `holtWinters()` applies the Holt-Winters forecasting method to input tables.
menu:
  flux_0_x_ref:
    name: holtWinters
    parent: universe
    identifier: universe/holtWinters
weight: 101
flux/v0.x/tags: [transformations]
introduced: 0.38.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L975-L987

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`holtWinters()` applies the Holt-Winters forecasting method to input tables.

The Holt-Winters method predicts `n` seasonally-adjusted values for the
specified column at the specified interval. For example, if interval is six
minutes (`6m`) and `n` is `3`, results include three predicted values six
minutes apart.

#### Seasonality
`seasonality` delimits the length of a seasonal pattern according to interval.
If the interval is two minutes (`2m`) and `seasonality` is `4`, then the
seasonal pattern occurs every eight minutes or every four data points.
If your interval is two months (`2mo`) and `seasonality` is `4`, then the
seasonal pattern occurs every eight months or every four data points.
If data doesn’t have a seasonal pattern, set `seasonality` to `0`.

#### Space values at even time intervals
`holtWinters()` expects values to be spaced at even time intervales.
To ensure values are spaced evenly in time, `holtWinters()` applies the
following rules:

- Data is grouped into time-based "buckets" determined by the interval.
- If a bucket includes many values, the first value is used.
- If a bucket includes no values, a missing value (`null`) is added for that bucket.

By default, `holtWinters()` uses the first value in each time bucket to run
the Holt-Winters calculation. To specify other values to use in the
calculation, use `aggregateWindow` to normalize irregular times and apply
an aggregate or selector transformation.

#### Fitted model
`holtWinters()` applies the [Nelder-Mead optimization](https://en.wikipedia.org/wiki/Nelder%E2%80%93Mead_method)
to include "fitted" data points in results when `withFit` is set to `true`.

#### Null timestamps
`holtWinters()` discards rows with null timestamps before running the
Holt-Winters calculation.

#### Null values
`holtWinters()` treats `null` values as missing data points and includes them
in the Holt-Winters calculation.

##### Function type signature

```js
(
    <-tables: stream[A],
    interval: duration,
    n: int,
    ?column: string,
    ?seasonality: int,
    ?timeColumn: string,
    ?withFit: bool,
    ?withMinSSE: bool,
) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### n
({{< req >}})
Number of values to predict.



### interval
({{< req >}})
Interval between two data points.



### withFit

Return fitted data in results. Default is `false`.



### column

Column to operate on. Default is `_value`.



### timeColumn

Column containing time values to use in the calculating.
Default is `_time`.



### seasonality

Number of points in a season. Default is `0`.



### withMinSSE

Return minSSE data in results. Default is `false`.

minSSE is the minimum sum squared error found when optimizing the holt winters fit to the data.
A smaller minSSE means a better fit.
Examining the minSSE value can help understand when the algorithm is getting a good fit versus not.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Use holtWinters to predict future values](#use-holtwinters-to-predict-future-values)
- [Use holtWinters with seasonality to predict future values](#use-holtwinters-with-seasonality-to-predict-future-values)
- [Use the holtWinters fitted model to predict future values](#use-the-holtwinters-fitted-model-to-predict-future-values)

### Use holtWinters to predict future values

```js
import "sampledata"

sampledata.int()
    |> holtWinters(n: 6, interval: 10s)

```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| *tag | _time                | _value             |
| ---- | -------------------- | ------------------ |
| t1   | 2021-01-01T00:01:00Z | 10.955057903416249 |
| t1   | 2021-01-01T00:01:10Z | 10.929417869181442 |
| t1   | 2021-01-01T00:01:20Z | 10.913931836435774 |
| t1   | 2021-01-01T00:01:30Z | 10.9049848302089   |
| t1   | 2021-01-01T00:01:40Z | 10.899928358379444 |
| t1   | 2021-01-01T00:01:50Z | 10.89710330009353  |

| *tag | _time                | _value            |
| ---- | -------------------- | ----------------- |
| t2   | 2021-01-01T00:01:00Z | 6.798303631428536 |
| t2   | 2021-01-01T00:01:10Z | 6.798303631555017 |
| t2   | 2021-01-01T00:01:20Z | 6.798303631555328 |
| t2   | 2021-01-01T00:01:30Z | 6.798303631555329 |
| t2   | 2021-01-01T00:01:40Z | 6.798303631555329 |
| t2   | 2021-01-01T00:01:50Z | 6.798303631555329 |

{{% /expand %}}
{{< /expand-wrapper >}}

### Use holtWinters with seasonality to predict future values

```js
import "sampledata"

sampledata.int()
    |> holtWinters(n: 4, interval: 10s, seasonality: 4)

```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| *tag | _time                | _value            |
| ---- | -------------------- | ----------------- |
| t1   | 2021-01-01T00:01:00Z | 4.6673129595221   |
| t1   | 2021-01-01T00:01:10Z | 9.937498954744212 |
| t1   | 2021-01-01T00:01:20Z | 3.59073602964091  |
| t1   | 2021-01-01T00:01:30Z | 6.523905777397829 |

| *tag | _time                | _value                |
| ---- | -------------------- | --------------------- |
| t2   | 2021-01-01T00:01:00Z | -0.000320397929233291 |
| t2   | 2021-01-01T00:01:10Z | 4.986867840774593     |
| t2   | 2021-01-01T00:01:20Z | 3.4989671640270354    |
| t2   | 2021-01-01T00:01:30Z | -0.05530077960375555  |

{{% /expand %}}
{{< /expand-wrapper >}}

### Use the holtWinters fitted model to predict future values

```js
import "sampledata"

sampledata.int()
    |> holtWinters(n: 3, interval: 10s, withFit: true)

```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| *tag | _time                | _value             |
| ---- | -------------------- | ------------------ |
| t1   | 2021-01-01T00:00:00Z | -2                 |
| t1   | 2021-01-01T00:00:10Z | 9.22029510454727   |
| t1   | 2021-01-01T00:00:20Z | 10.72226534418895  |
| t1   | 2021-01-01T00:00:30Z | 11.027321424181121 |
| t1   | 2021-01-01T00:00:40Z | 11.036624575789808 |
| t1   | 2021-01-01T00:00:50Z | 10.993493462224441 |
| t1   | 2021-01-01T00:01:00Z | 10.955057903416249 |
| t1   | 2021-01-01T00:01:10Z | 10.929417869181442 |
| t1   | 2021-01-01T00:01:20Z | 10.913931836435774 |

| *tag | _time                | _value             |
| ---- | -------------------- | ------------------ |
| t2   | 2021-01-01T00:00:00Z | 19                 |
| t2   | 2021-01-01T00:00:10Z | 10.269974995821258 |
| t2   | 2021-01-01T00:00:20Z | 3.343711756293869  |
| t2   | 2021-01-01T00:00:30Z | 6.789784945101966  |
| t2   | 2021-01-01T00:00:40Z | 6.798282676851281  |
| t2   | 2021-01-01T00:00:50Z | 6.798303580010179  |
| t2   | 2021-01-01T00:01:00Z | 6.798303631428536  |
| t2   | 2021-01-01T00:01:10Z | 6.798303631555017  |
| t2   | 2021-01-01T00:01:20Z | 6.798303631555328  |

{{% /expand %}}
{{< /expand-wrapper >}}
