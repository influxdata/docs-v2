---
title: experimental.kaufmansAMA() function
description: >
  `experimental.kaufmansAMA()` calculates the Kaufman's Adaptive Moving Average (KAMA) of input
  tables using the `_value` column in each table.
menu:
  flux_v0_ref:
    name: experimental.kaufmansAMA
    parent: experimental
    identifier: experimental/kaufmansAMA
weight: 101
flux/v0.x/tags: [transformations]
introduced: 0.107.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L1025-L1030

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.kaufmansAMA()` calculates the Kaufman's Adaptive Moving Average (KAMA) of input
tables using the `_value` column in each table.

Kaufman's Adaptive Moving Average is a trend-following indicator designed to
account for market noise or volatility.

##### Function type signature

```js
(<-tables: stream[{A with _value: B}], n: int) => stream[{A with _value: float}] where B: Numeric
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### n
({{< req >}})
Period or number of points to use in the calculation.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Calculate the KAMA of input tables

```js
import "experimental"
import "sampledata"

sampledata.int()
    |> experimental.kaufmansAMA(n: 3)

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
| 2021-01-01T00:00:30Z | 9.72641183951902   | t1   |
| 2021-01-01T00:00:40Z | 10.097401019601417 | t1   |
| 2021-01-01T00:00:50Z | 9.972614968115325  | t1   |

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:30Z | -2.9084287200832466 | t2   |
| 2021-01-01T00:00:40Z | -2.142970089472789  | t2   |
| 2021-01-01T00:00:50Z | -2.0940721758134693 | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
