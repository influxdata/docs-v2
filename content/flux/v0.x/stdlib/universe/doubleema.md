---
title: doubleEMA() function
description: >
  The `doubleEMA()` function calculates the exponential moving average of values
  grouped into `n` number of points, giving more weight to recent data at double
  the rate of `exponentialMovingAverage()`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/doubleema/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/doubleema/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/doubleema/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/doubleema/
menu:
  flux_0_x_ref:
    name: doubleEMA
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /flux/v0.x/stdlib/universe/movingaverage/
  - /flux/v0.x/stdlib/universe/tripleema/
  - /flux/v0.x/stdlib/universe/timedmovingaverage/
  - /flux/v0.x/stdlib/universe/exponentialmovingaverage/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#double-exponential-moving-average, InfluxQL DOUBLE_EXPONENTIAL_MOVING_AVERAGE()
introduced: 0.38.0
---

The `doubleEMA()` function calculates the exponential moving average of values in
the `_value` column grouped into `n` number of points, giving more weight to recent
data at double the rate of [`exponentialMovingAverage()`](/flux/v0.x/stdlib/universe/exponentialmovingaverage/).

```js
doubleEMA(n: 5)
```

##### Double exponential moving average rules
- A double exponential moving average is defined as `doubleEMA = 2 * EMA_N - EMA of EMA_N`.
    - `EMA` is an exponential moving average.
    - `N = n` is the period used to calculate the EMA.
- A true double exponential moving average requires at least `2 * n - 1` values.
  If not enough values exist to calculate the double EMA, it returns a `NaN` value.
- `doubleEMA()` inherits all [exponential moving average rules](/flux/v0.x/stdlib/universe/exponentialmovingaverage/#exponential-moving-average-rules).

## Parameters

### n {data-type="int"}
Number of points to average.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

#### Calculate a three point double exponential moving average
```js
import "sampledata"

sampledata.int()
  |> doubleEMA(n: 3)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample set="int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag |             _value |
| :------------------- | :-- | -----------------: |
| 2021-01-01T00:00:40Z | t1  | 16.627222222222223 |
| 2021-01-01T00:00:50Z | t1  |  8.301527777777778 |

| _time                | tag |             _value |
| :------------------- | :-- | -----------------: |
| 2021-01-01T00:00:40Z | t2  | 15.907222222222224 |
| 2021-01-01T00:00:50Z | t2  |  5.941527777777779 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

## Function definition
```js
doubleEMA = (n, tables=<-) =>
  tables
    |> exponentialMovingAverage(n:n)
    |> duplicate(column:"_value", as:"ema")
    |> exponentialMovingAverage(n:n)
    |> map(fn: (r) => ({r with _value: 2.0 * r.ema - r._value}))
    |> drop(columns: ["ema"])
```
