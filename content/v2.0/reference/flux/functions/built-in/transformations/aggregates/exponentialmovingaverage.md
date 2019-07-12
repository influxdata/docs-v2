---
title: exponentialMovingAverage() function
description: >
  The `exponentialMovingAverage()` function calculates the exponential moving average
  of values grouped into `n` number of points giving more weight to recent data.
menu:
  v2_0_ref:
    name: exponentialMovingAverage
    parent: built-in-aggregates
weight: 501
related:
  - /v2.0/reference/flux/functions/built-in/transformations/aggregates/movingaverage/
  - /v2.0/reference/flux/functions/built-in/transformations/aggregates/timedmovingaverage/
  - https://docs.influxdata.com/influxdb/v1.7/query_language/functions/#exponential-moving-average, InfluxQL EXPONENTIAL_MOVING_AVERAGE()
---

The `exponentialMovingAverage()` function calculates the exponential moving average
of values grouped into `n` number of points giving more weight to recent data.

_**Function type:** Aggregate_  

```js
exponentialMovingAverage(
  n: 5,
  columns: ["_value"]
)
```

##### Exponential moving average rules:
- The first value of an exponential moving average over `n` values is the
  algebraic mean of the first `n` values.
- Subsequent values are calculated as `y(t) = x(t) * k + y(t-1) * (1 - k)`, where:
    - `k = 2 / (1 + n)`.
    - `y(t)` is the exponential moving average at time `t`.
    - `x(t)` is the value at time `t`.
- The average over a period populated by only `null` values is `null`.
- Exponential moving averages skip `null` values.

## Parameters

### n
The number of points to average.

_**Data type:** Integer_

### columns
Columns to operate on. _Defaults to `["_value"]`_.

_**Data type:** Array of Strings_

## Examples

#### Calculate a five point exponential moving average
```js
from(bucket: "example-bucket"):
  |> range(start: -12h)
  |> exponentialMovingAverage(n: 5)
```

#### Calculate a ten point exponential moving average
```js
from(bucket: "example-bucket"):
  |> range(start: -12h)
  |> exponentialMovingAverage(n: 10)
```

#### Table transformation with a two point exponential moving average

###### Input table:
| _time | A    | B    | C    | tag |
|:-----:|:----:|:----:|:----:|:---:|
| 0001  | 2    | null | 2    | tv  |
| 0002  | null | 10   | 4    | tv  |
| 0003  | 8    | 20   | 5    | tv  |

###### Query:
```js
// ...
  |> exponentialMovingAverage(
    n: 2,
    columns: ["A", "B", "C"]
  )
```

###### Output table:
| _time | A    | B    | C    | tag |
|:-----:|:----:|:----:|:----:|:---:|
| 0002  | 2    | 10   | 3    | tv  |
| 0003  | 6    | 16.67| 4.33 | tv  |
