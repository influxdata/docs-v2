---
title: tripleExponentialDerivative() function
description: >
  The `tripleExponentialDerivative()` function calculates a triple exponential
  derivative of input tables using `n` points.
menu:
  v2_0_ref:
    name: tripleExponentialDerivative
    parent: built-in-aggregates
weight: 501
v2.0/tags: [technical analysis]
related:
  - /v2.0/reference/flux/functions/built-in/transformations/aggregates/movingaverage/
  - /v2.0/reference/flux/functions/built-in/transformations/aggregates/doubleema/
  - /v2.0/reference/flux/functions/built-in/transformations/aggregates/tripleema/
  - /v2.0/reference/flux/functions/built-in/transformations/aggregates/timedmovingaverage/
  - /v2.0/reference/flux/functions/built-in/transformations/aggregates/exponentialmovingaverage/
  - https://docs.influxdata.com/influxdb/v1.7/query_language/functions/#triple-exponential-derivative, InfluxQL TRIPLE_EXPONENTIAL_DERIVATIVE()
---

The `tripleExponentialDerivative()` function calculates a triple exponential
derivative of input tables using `n` points.

_**Function type:** Aggregate_  

```js
tripleExponentialDerivative(n: 5)
```

Triple exponential derivative, commonly referred to as “TRIX,” is a momentum indicator and oscillator.
A triple exponential derivative is a triple exponential moving average of the log of data input over the period of time.
It prevents cycles shorter than the defined period from being considered by the indicator.
With `tripleExponentialDerivative()`, the period of time is determined by the time `n` points span.

Triple exponential derivative oscillates around a zero line.
When used as a momentum **oscillator**, a positive value indicates an overbought market
and a negative value indicates an oversold market.
When used as a momentum **indicator**, a positive value suggests momentum is
increasing and a negative value suggests momentum is decreasing.

##### Triple exponential moving average rules
- A triple exponential derivative is defined as:
    - `TRIX[i] = ((EMA3[i] / EMA3[i - 1]) - 1) * 100`:
    - `EMA_3 = EMA(EMA(EMA(data)))`
- If there are not enough values to calculate a triple exponential derivative,
  the output `_value` is `NaN`; all other columns are the same as the _last_ record of the input table.
- The behavior of the exponential moving averages used for calculating the triple
  exponential derivative is the same as [`exponentialMovingAverage`](/v2.0/reference/flux/functions/built-in/transformations/aggregates/exponentialmovingaverage/):
    - `tripleExponentialDerivative` ignores `null` values and does not inlcude them in the calculation.
    - It acts only on the `_value` column.

## Parameters

### n
The number of points to use in the calculation.

_**Data type:** Integer_

## Examples

#### Calculate a five point triple exponential derivative
```js
from(bucket: "example-bucket"):
  |> range(start: -12h)
  |> tripleExponentialDerivative(n: 5)
```
