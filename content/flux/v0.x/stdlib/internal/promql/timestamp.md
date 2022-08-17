---
title: promql.timestamp() function
description: >
  `promql.timestamp()` implements functionality equivalent to
  [PromQL's `timestamp()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#timestamp).
menu:
  flux_0_x_ref:
    name: promql.timestamp
    parent: internal/promql
    identifier: internal/promql/timestamp
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L177-L177

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.timestamp()` implements functionality equivalent to
[PromQL's `timestamp()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#timestamp).



##### Function type signature

```js
(<-tables: stream[{A with _value: float}]) => stream[{A with _value: float}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Defaults is piped-forward data (`<-`).



