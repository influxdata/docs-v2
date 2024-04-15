---
title: promql.quantile() function
description: >
  `promql.quantile()` accounts checks for quantile values that are out of range, above 1.0 or
  below 0.0, by either returning positive infinity or negative infinity in the `_value`
  column respectively. `q` must be a float.
menu:
  flux_v0_ref:
    name: promql.quantile
    parent: internal/promql
    identifier: internal/promql/quantile
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L251-L261

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.quantile()` accounts checks for quantile values that are out of range, above 1.0 or
below 0.0, by either returning positive infinity or negative infinity in the `_value`
column respectively. `q` must be a float.

**Important**: The `internal/promql` package is not meant for external use.

##### Function type signature

```js
(<-tables: stream[A], q: float, ?method: string) => stream[A] where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).



### q
({{< req >}})
Quantile to compute (`[0.0 - 1.0]`).



### method

Quantile method to use.



