---
title: relativeStrengthIndex() function
description: >
  `relativeStrengthIndex()` measures the relative speed and change of values in input tables.
menu:
  flux_v0_ref:
    name: relativeStrengthIndex
    parent: universe
    identifier: universe/relativeStrengthIndex
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2236-L2239

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`relativeStrengthIndex()` measures the relative speed and change of values in input tables.

### Relative strength index (RSI) rules
- The general equation for calculating a relative strength index (RSI) is
  `RSI = 100 - (100 / (1 + (AVG GAIN / AVG LOSS)))`.
- For the first value of the RSI, `AVG GAIN` and `AVG LOSS` are averages of the `n` period.
- For subsequent calculations:
  - `AVG GAIN` = `((PREVIOUS AVG GAIN) * (n - 1)) / n`
  - `AVG LOSS` = `((PREVIOUS AVG LOSS) * (n - 1)) / n`
- `relativeStrengthIndex()` ignores `null` values.

### Output tables
For each input table with `x` rows, `relativeStrengthIndex()` outputs a table
with `x - n` rows.

##### Function type signature

```js
(<-tables: stream[A], n: int, ?columns: [string]) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### n
({{< req >}})
Number of values to use to calculate the RSI.



### columns

Columns to operate on. Default is `["_value"]`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Calculate a three point relative strength index

```js
import "sampledata"

sampledata.int()
    |> relativeStrengthIndex(n: 3)

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
| 2021-01-01T00:00:30Z | 84.375             | t1   |
| 2021-01-01T00:00:40Z | 73.97260273972603  | t1   |
| 2021-01-01T00:00:50Z | 36.672325976230894 | t1   |

| _time                | _value            | *tag |
| -------------------- | ----------------- | ---- |
| 2021-01-01T00:00:30Z | 70.27027027027026 | t2   |
| 2021-01-01T00:00:40Z | 59.42857142857142 | t2   |
| 2021-01-01T00:00:50Z | 40.625            | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
