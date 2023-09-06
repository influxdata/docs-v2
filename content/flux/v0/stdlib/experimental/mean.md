---
title: experimental.mean() function
description: >
  `experimental.mean()` computes the mean or average of non-null values in the `_value` column
  of each input table.
menu:
  flux_v0_ref:
    name: experimental.mean
    parent: experimental
    identifier: experimental/mean
weight: 101
flux/v0.x/tags: [transformations, aggregates]
introduced: 0.107.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L778-L778

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.mean()` computes the mean or average of non-null values in the `_value` column
of each input table.

Output tables contain a single row the with the calculated mean in the `_value` column.

##### Function type signature

```js
(<-tables: stream[{A with _value: float}]) => stream[{A with _value: float}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Calculate the average value of input tables

```js
import "experimental"
import "sampledata"

sampledata.float()
    |> experimental.mean()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t1   | -2.18   |
| 2021-01-01T00:00:10Z | t1   | 10.92   |
| 2021-01-01T00:00:20Z | t1   | 7.35    |
| 2021-01-01T00:00:30Z | t1   | 17.53   |
| 2021-01-01T00:00:40Z | t1   | 15.23   |
| 2021-01-01T00:00:50Z | t1   | 4.43    |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t2   | 19.85   |
| 2021-01-01T00:00:10Z | t2   | 4.97    |
| 2021-01-01T00:00:20Z | t2   | -3.75   |
| 2021-01-01T00:00:30Z | t2   | 19.77   |
| 2021-01-01T00:00:40Z | t2   | 13.86   |
| 2021-01-01T00:00:50Z | t2   | 1.86    |


#### Output data

| *tag | _value  |
| ---- | ------- |
| t1   | 8.88    |

| *tag | _value            |
| ---- | ----------------- |
| t2   | 9.426666666666668 |

{{% /expand %}}
{{< /expand-wrapper >}}
