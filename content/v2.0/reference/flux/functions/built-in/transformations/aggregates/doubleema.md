---
title: doubleEMA() function
description: >
  The `doubleEMA()` or `doubleExponentialMovingAverage()` function calculates the
  exponential moving average of values grouped into `n` number of points,
  giving more weight to recent data at double the rate of `exponentialMovingAverage()`.
menu:
  v2_0_ref:
    name: doubleEMA
    parent: built-in-aggregates
weight: 501
related:
  - /v2.0/reference/flux/functions/built-in/transformations/aggregates/movingaverage/
  - /v2.0/reference/flux/functions/built-in/transformations/aggregates/timedmovingaverage/
  - /v2.0/reference/flux/functions/built-in/transformations/aggregates/exponentialmovingaverage/
  - https://docs.influxdata.com/influxdb/v1.7/query_language/functions/#exponential-moving-average, InfluxQL EXPONENTIAL_MOVING_AVERAGE()
---

The `doubleEMA()` or `doubleExponentialMovingAverage()` function calculates the
exponential moving average (EMA) of values grouped into `n` number of points,
giving more weight to recent data at double the rate of
[`exponentialMovingAverage()`](/v2.0/reference/flux/functions/built-in/transformations/aggregates/exponentialmovingaverage/).

_**Function type:** Aggregate_  

```js
doubleExponentialMovingAverage(
  n: 5,
  columns: ["_value"]
)

// OR

doubleEMA(
  n: 5,
  columns: ["_value"]
)
```

##### Double exponential moving average rules:
- A double exponential moving average is defined as `doubleEMA = 2 * EMA_N - EMA of EMA_N`.
    - `EMA` is an exponential moving average.
    - `N = n` is the period used to calculate the EMA.
- A true double exponential moving average requires at least `2 * n - 1` values.
  If not enough values exist to calculate the double EMA, it returns a `NaN` value.
- `doubleEMA()` inherits all [exponential moving average rules](/v2.0/reference/flux/functions/built-in/transformations/aggregates/exponentialmovingaverage/#exponential-moving-average-rules).

## Parameters

### n
The number of points to average.

_**Data type:** Integer_

### columns
Columns to operate on. _Defaults to `["_value"]`_.

_**Data type:** Array of Strings_

## Examples

#### Calculate a five point double exponential moving average
```js
from(bucket: "example-bucket"):
  |> range(start: -12h)
  |> doubleExponentialMovingAverage(n: 5)
```
