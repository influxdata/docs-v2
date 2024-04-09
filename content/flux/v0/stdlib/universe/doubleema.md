---
title: doubleEMA() function
description: >
  `doubleEMA()` returns the double exponential moving average (DEMA) of values in
  the `_value` column grouped into `n` number of points, giving more weight to
  recent data.
menu:
  flux_v0_ref:
    name: doubleEMA
    parent: universe
    identifier: universe/doubleEMA
weight: 101
flux/v0/tags: [transformations]
introduced: 0.38.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L4468-L4474

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`doubleEMA()` returns the double exponential moving average (DEMA) of values in
the `_value` column grouped into `n` number of points, giving more weight to
recent data.

#### Double exponential moving average rules
- A double exponential moving average is defined as `doubleEMA = 2 * EMA_N - EMA of EMA_N`.
    - `EMA` is an exponential moving average.
    - `N = n` is the period used to calculate the `EMA`.
- A true double exponential moving average requires at least `2 * n - 1` values.
  If not enough values exist to calculate the double `EMA`, it returns a `NaN` value.
- `doubleEMA()` inherits all `exponentialMovingAverage()` rules.

##### Function type signature

```js
(<-tables: stream[{A with _value: B}], n: int) => stream[C] where B: Numeric, C: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### n
({{< req >}})
Number of points to average.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Calculate a three point double exponential moving average

```js
import "sampledata"

sampledata.int()
    |> doubleEMA(n: 3)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time                | _value             | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:40Z | 16.333333333333336 | t1   |
| 2021-01-01T00:00:50Z | 7.916666666666668  | t1   |

| _time                | _value             | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:40Z | 15.027777777777779 | t2   |
| 2021-01-01T00:00:50Z | 5.034722222222221  | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
