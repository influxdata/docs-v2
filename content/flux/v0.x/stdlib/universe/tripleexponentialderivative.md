---
title: tripleExponentialDerivative() function
description: >
  The `tripleExponentialDerivative()` function calculates a triple exponential
  derivative (TRIX) of input tables using `n` points.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/tripleexponentialderivative/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/tripleexponentialderivative/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/tripleexponentialderivative/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/tripleexponentialderivative/
menu:
  flux_0_x_ref:
    name: tripleExponentialDerivative
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /flux/v0.x/stdlib/universe/movingaverage/
  - /flux/v0.x/stdlib/universe/doubleema/
  - /flux/v0.x/stdlib/universe/tripleema/
  - /flux/v0.x/stdlib/universe/timedmovingaverage/
  - /flux/v0.x/stdlib/universe/exponentialmovingaverage/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#triple-exponential-derivative, InfluxQL TRIPLE_EXPONENTIAL_DERIVATIVE()
introduced: 0.40.0
---

The `tripleExponentialDerivative()` function calculates a triple exponential
derivative ([TRIX](https://en.wikipedia.org/wiki/Trix_(technical_analysis))) of
input tables using `n` points.

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
- The function behaves the same way as the [`exponentialMovingAverage()`](/flux/v0.x/stdlib/universe/exponentialmovingaverage/) function:
    - The function does not include `null` values in the calculation.
    - The function acts only on the `_value` column.

## Parameters

### n {data-type="int"}
({{< req >}})
Number of points to use in the calculation.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

#### Calculate a two point triple exponential derivative
```js
import "sampledata"

sampledata.float()
  |> tripleExponentialDerivative(n: 2)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag | _time                |              _value |
| :-- | :------------------- | ------------------: |
| t1  | 2021-01-01T00:00:40Z |   46.03174603174607 |
| t1  | 2021-01-01T00:00:50Z | -11.666666666666647 |

| tag | _time                |              _value |
| :-- | :------------------- | ------------------: |
| t2  | 2021-01-01T00:00:40Z |  26.675945256321064 |
| t2  | 2021-01-01T00:00:50Z | -22.205945187084176 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
