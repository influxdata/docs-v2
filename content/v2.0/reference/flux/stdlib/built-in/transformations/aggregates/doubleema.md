---
title: doubleEMA() function
description: >
  The `doubleEMA()` function calculates the exponential moving average of values
  grouped into `n` number of points, giving more weight to recent data at double
  the rate of `exponentialMovingAverage()`.
aliases:
  - /v2.0/reference/flux/functions/built-in/transformations/aggregates/doubleema/
menu:
  v2_0_ref:
    name: doubleEMA
    parent: built-in-aggregates
weight: 501
related:
  - /v2.0/reference/flux/stdlib/built-in/transformations/aggregates/movingaverage/
  - /v2.0/reference/flux/stdlib/built-in/transformations/aggregates/tripleema/
  - /v2.0/reference/flux/stdlib/built-in/transformations/aggregates/timedmovingaverage/
  - /v2.0/reference/flux/stdlib/built-in/transformations/aggregates/exponentialmovingaverage/
  - https://docs.influxdata.com/influxdb/latest/query_language/functions/#double-exponential-moving-average, InfluxQL DOUBLE_EXPONENTIAL_MOVING_AVERAGE()
---

The `doubleEMA()` function calculates the exponential moving average of values in
the `_value` column grouped into `n` number of points, giving more weight to recent
data at double the rate of [`exponentialMovingAverage()`](/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/exponentialmovingaverage/).

_**Function type:** Aggregate_  

```js
doubleEMA(n: 5)
```

##### Double exponential moving average rules
- A double exponential moving average is defined as `doubleEMA = 2 * EMA_N - EMA of EMA_N`.
    - `EMA` is an exponential moving average.
    - `N = n` is the period used to calculate the EMA.
- A true double exponential moving average requires at least `2 * n - 1` values.
  If not enough values exist to calculate the double EMA, it returns a `NaN` value.
- `doubleEMA()` inherits all [exponential moving average rules](/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/exponentialmovingaverage/#exponential-moving-average-rules).

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
