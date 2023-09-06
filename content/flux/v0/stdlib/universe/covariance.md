---
title: covariance() function
description: >
  `covariance()` computes the covariance between two columns.
menu:
  flux_v0_ref:
    name: covariance
    parent: universe
    identifier: universe/covariance
weight: 101
flux/v0.x/tags: [transformations, aggregates]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L192-L200

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`covariance()` computes the covariance between two columns.



##### Function type signature

```js
(<-tables: stream[A], columns: [string], ?pearsonr: bool, ?valueDst: string) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### columns
({{< req >}})
List of two columns to operate on.



### pearsonr

Normalize results to the Pearson R coefficient. Default is `false`.



### valueDst

Column to store the result in. Default is `_value`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Calculate the covariance between two columns

```js
data
    |> covariance(columns: ["x", "y"])

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | x  | y    |
| -------------------- | -- | ---- |
| 2021-01-01T00:00:00Z | 0  | 0    |
| 2021-01-01T00:00:12Z | 1  | 0.5  |
| 2021-01-01T00:00:24Z | 4  | 8    |
| 2021-01-01T00:00:36Z | 9  | 40.5 |
| 2021-01-01T00:00:48Z | 16 | 128  |


#### Output data

| _value  |
| ------- |
| 345.75  |

{{% /expand %}}
{{< /expand-wrapper >}}
