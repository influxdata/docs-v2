---
title: promql.promHistogramQuantile() function
description: >
  `promql.promHistogramQuantile()` implements functionality equivalent to
  [PromQL's `histogram_quantile()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#histogram_quantile).
menu:
  flux_v0_ref:
    name: promql.promHistogramQuantile
    parent: internal/promql
    identifier: internal/promql/promHistogramQuantile
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L191-L200

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.promHistogramQuantile()` implements functionality equivalent to
[PromQL's `histogram_quantile()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#histogram_quantile).

**Important**: The `internal/promql` package is not meant for external use.

##### Function type signature

```js
(
    <-tables: stream[A],
    ?countColumn: string,
    ?quantile: float,
    ?upperBoundColumn: string,
    ?valueColumn: string,
) => stream[B] where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).



### quantile

Quantile to compute (`[0.0 - 1.0]`).



### countColumn

Count column name.



### upperBoundColumn

Upper bound column name.



### valueColumn

Output value column name.



