---
title: doubleEMA() function
description: >
  The `doubleEMA()` function calculates the exponential moving average of values
  grouped into `n` number of points, giving more weight to recent data at double
  the rate of `exponentialMovingAverage()`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/doubleema/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/doubleema/
menu:
  influxdb_2_0_ref:
    name: doubleEMA
    parent: built-in-transformations
weight: 402
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/movingaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/tripleema/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/timedmovingaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/exponentialmovingaverage/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#double-exponential-moving-average, InfluxQL DOUBLE_EXPONENTIAL_MOVING_AVERAGE()
---

The `doubleEMA()` function calculates the exponential moving average of values in
the `_value` column grouped into `n` number of points, giving more weight to recent
data at double the rate of [`exponentialMovingAverage()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/exponentialmovingaverage/).

_**Function type:** Transformation_  

```js
doubleEMA(n: 5)
```

##### Double exponential moving average rules
- A double exponential moving average is defined as `doubleEMA = 2 * EMA_N - EMA of EMA_N`.
    - `EMA` is an exponential moving average.
    - `N = n` is the period used to calculate the EMA.
- A true double exponential moving average requires at least `2 * n - 1` values.
  If not enough values exist to calculate the double EMA, it returns a `NaN` value.
- `doubleEMA()` inherits all [exponential moving average rules](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/exponentialmovingaverage/#exponential-moving-average-rules).

## Parameters

### n
The number of points to average.

_**Data type:** Integer_

## Examples

#### Calculate a five point double exponential moving average
```js
from(bucket: "example-bucket"):
  |> range(start: -12h)
  |> doubleEMA(n: 5)
```

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
