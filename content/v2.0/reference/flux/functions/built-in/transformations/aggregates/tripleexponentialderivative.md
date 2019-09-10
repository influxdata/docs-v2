---
title: tripleExponentialDerivative() function
description: >
  The `tripleExponentialDerivative()` function calculates a triple exponential
  derivative (TRIX) of input tables using `n` points.
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
derivative ([TRIX](https://en.wikipedia.org/wiki/Trix_(technical_analysis))) of
input tables using `n` points.

_**Function type:** Aggregate_  

```js
tripleExponentialDerivative(n: 5)
```

Triple exponential derivative, commonly referred to as “TRIX,” is a momentum indicator and oscillator.
A triple exponential derivative uses the natural logarithm (log) of input data to
calculate a triple exponential moving average over the period of time.
The calculation prevents cycles shorter than the defined period from being considered by the indicator.
`tripleExponentialDerivative()` uses the time between `n` points to define the period.

Triple exponential derivative oscillates around a zero line.
A positive momentum **oscillator** value indicates an overbought market;
a negative value indicates an oversold market.
A positive momentum **indicator** value indicates increasing momentum;
a negative value indicates decreasing momentum.

##### Triple exponential moving average rules
- A triple exponential derivative is defined as:
    - `TRIX[i] = ((EMA3[i] / EMA3[i - 1]) - 1) * 100`:
    - `EMA_3 = EMA(EMA(EMA(data)))`
- If there are not enough values to calculate a triple exponential derivative,
  the output `_value` is `NaN`; all other columns are the same as the _last_ record of the input table.
- The function behaves the same way as the [`exponentialMovingAverage()`](/v2.0/reference/flux/functions/built-in/transformations/aggregates/exponentialmovingaverage/) function:
    - The function does not include `null` values in the calculation.
    - The function acts only on the `_value` column.

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
