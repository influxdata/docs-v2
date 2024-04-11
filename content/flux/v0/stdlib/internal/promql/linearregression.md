---
title: promql.linearRegression() function
description: >
  `promql.linearRegression()` implements linear regression functionality required to implement
  PromQL's [`deriv()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#deriv)
  and [`predict_linear()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#predict_linear) functions.
menu:
  flux_v0_ref:
    name: promql.linearRegression
    parent: internal/promql
    identifier: internal/promql/linearRegression
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L156-L160

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.linearRegression()` implements linear regression functionality required to implement
PromQL's [`deriv()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#deriv)
and [`predict_linear()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#predict_linear) functions.

**Important**: The `internal/promql` package is not meant for external use.

##### Function type signature

```js
(
    <-tables: stream[{A with _value: float, _time: time, _stop: time}],
    ?fromNow: float,
    ?predict: bool,
) => stream[{B with _value: float}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).



### predict

Output should contain a prediction.



### fromNow

Time as a floating point value.



