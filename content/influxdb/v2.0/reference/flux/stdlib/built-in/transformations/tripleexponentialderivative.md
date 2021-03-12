---
title: tripleExponentialDerivative() function
description: >
  The `tripleExponentialDerivative()` function calculates a triple exponential
  derivative (TRIX) of input tables using `n` points.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/tripleexponentialderivative/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/tripleexponentialderivative/
menu:
  influxdb_2_0_ref:
    name: tripleExponentialDerivative
    parent: built-in-transformations
weight: 402
influxdb/v2.0/tags: [technical analysis]
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/movingaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/doubleema/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/tripleema/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/timedmovingaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/exponentialmovingaverage/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#triple-exponential-derivative, InfluxQL TRIPLE_EXPONENTIAL_DERIVATIVE()
---

The `tripleExponentialDerivative()` function calculates a triple exponential
derivative ([TRIX](https://en.wikipedia.org/wiki/Trix_(technical_analysis))) of
input tables using `n` points.

_**Function type:** Transformation_  

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
- The function behaves the same way as the [`exponentialMovingAverage()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/exponentialmovingaverage/) function:
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
