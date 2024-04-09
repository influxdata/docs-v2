---
title: promql.holtWinters() function
description: >
  `promql.holtWinters()` implements functionality equivalent to
  [PromQL's `holt_winters()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#holt_winters).
menu:
  flux_v0_ref:
    name: promql.holtWinters
    parent: internal/promql
    identifier: internal/promql/holtWinters
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L97-L101

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.holtWinters()` implements functionality equivalent to
[PromQL's `holt_winters()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#holt_winters).

**Important**: The `internal/promql` package is not meant for external use.

##### Function type signature

```js
(
    <-tables: stream[{A with _value: float, _time: time}],
    ?smoothingFactor: float,
    ?trendFactor: float,
) => stream[{B with _value: float}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).



### smoothingFactor

Exponential smoothing factor.



### trendFactor

Trend factor.



