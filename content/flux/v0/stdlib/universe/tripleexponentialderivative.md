---
title: tripleExponentialDerivative() function
description: >
  `tripleExponentialDerivative()` returns the triple exponential derivative (TRIX)
  values using `n` points.
menu:
  flux_v0_ref:
    name: tripleExponentialDerivative
    parent: universe
    identifier: universe/tripleExponentialDerivative
weight: 101
flux/v0/tags: [transformations]
introduced: 0.40.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2684-L2690

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`tripleExponentialDerivative()` returns the triple exponential derivative (TRIX)
values using `n` points.

Triple exponential derivative, commonly referred to as “[TRIX](https://en.wikipedia.org/wiki/Trix_(technical_analysis)),”
is a momentum indicator and oscillator. A triple exponential derivative uses
the natural logarithm (log) of input data to calculate a triple exponential
moving average over the period of time. The calculation prevents cycles
shorter than the defined period from being considered by the indicator.
`tripleExponentialDerivative()` uses the time between `n` points to define
the period.

Triple exponential derivative oscillates around a zero line.
A positive momentum **oscillator** value indicates an overbought market;
a negative value indicates an oversold market.
A positive momentum **indicator** value indicates increasing momentum;
a negative value indicates decreasing momentum.

#### Triple exponential moving average rules
- A triple exponential derivative is defined as:
    - `TRIX[i] = ((EMA3[i] / EMA3[i - 1]) - 1) * 100`
    - `EMA3 = EMA(EMA(EMA(data)))`
- If there are not enough values to calculate a triple exponential derivative,
  the output `_value` is `NaN`; all other columns are the same as the last
  record of the input table.
- The function behaves the same way as the `exponentialMovingAverage()` function:
    - The function ignores `null` values.
    - The function operates only on the `_value` column.

##### Function type signature

```js
(<-tables: stream[{A with _value: B}], n: int) => stream[{A with _value: float}] where A: Record, B: Numeric
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### n
({{< req >}})
Number of points to use in the calculation.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Calculate a two-point triple exponential derivative

```js
import "sampledata"

sampledata.float()
    |> tripleExponentialDerivative(n: 2)

```

