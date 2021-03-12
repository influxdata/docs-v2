---
title: exponentialMovingAverage() function
description: >
  The `exponentialMovingAverage()` function calculates the exponential moving average of values
  in the `_value` column grouped into `n` number of points, giving more weight to recent data.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/exponentialmovingaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/exponentialmovingaverage/
menu:
  influxdb_2_0_ref:
    name: exponentialMovingAverage
    parent: built-in-transformations
weight: 402
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/movingaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/timedmovingaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/doubleema/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/tripleema/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#exponential-moving-average, InfluxQL EXPONENTIAL_MOVING_AVERAGE()
---

The `exponentialMovingAverage()` function calculates the exponential moving average of values
in the `_value` column grouped into `n` number of points, giving more weight to recent data.

_**Function type:** Aggregate_  

```js
exponentialMovingAverage(n: 5)
```

##### Exponential moving average rules
- The first value of an exponential moving average over `n` values is the
  algebraic mean of `n` values.
- Subsequent values are calculated as `y(t) = x(t) * k + y(t-1) * (1 - k)`, where:
    - `y(t)` is the exponential moving average at time `t`.
    - `x(t)` is the value at time `t`.
    - `k = 2 / (1 + n)`.
- The average over a period populated by only `null` values is `null`.
- Exponential moving averages skip `null` values.

## Parameters

### n
The number of points to average.

_**Data type:** Integer_

## Examples

#### Calculate a five point exponential moving average
```js
from(bucket: "example-bucket"):
  |> range(start: -12h)
  |> exponentialMovingAverage(n: 5)
```

#### Table transformation with a two point exponential moving average

###### Input table:
| _time | tag | _value |
|:-----:|:---:|:------:|
| 0001  | tv  | null   |
| 0002  | tv  | 10     |
| 0003  | tv  | 20     |

###### Query:
```js
// ...
  |> exponentialMovingAverage(n: 2)
```

###### Output table:
| _time | tag | _value |
|:-----:|:---:|:------:|
| 0002  | tv  | 10     |
| 0003  | tv  | 16.67  |
