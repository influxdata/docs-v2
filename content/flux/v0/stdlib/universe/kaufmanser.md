---
title: kaufmansER() function
description: >
  `kaufmansER()` computes the Kaufman's Efficiency Ratio (KER) of values in the
  `_value` column for each input table.
menu:
  flux_v0_ref:
    name: kaufmansER
    parent: universe
    identifier: universe/kaufmansER
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L4501-L4504

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`kaufmansER()` computes the Kaufman's Efficiency Ratio (KER) of values in the
`_value` column for each input table.

Kaufman’s Efficiency Ratio indicator divides the absolute value of the Chande
Momentum Oscillator by 100 to return a value between 0 and 1.
Higher values represent a more efficient or trending market.

##### Function type signature

```js
(<-tables: stream[A], n: int) => stream[{B with _value: float, _value: float}] where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### n
({{< req >}})
Period or number of points to use in the calculation.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Compute the Kaufman's Efficiency Ratio

```js
import "sampledata"

sampledata.int()
    |> kaufmansER(n: 3)

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

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:30Z | 0.76                | t1   |
| 2021-01-01T00:00:40Z | 0.33333333333333337 | t1   |
| 2021-01-01T00:00:50Z | 0.13043478260869565 | t1   |

| _time                | _value             | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:30Z | 0                  | t2   |
| 2021-01-01T00:00:40Z | 0.2571428571428572 | t2   |
| 2021-01-01T00:00:50Z | 0.1                | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
