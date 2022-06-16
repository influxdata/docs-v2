---
title: promql.changes() function
description: >
  `promql.changes()` implements functionality equivalent to
  [PromQL's `changes()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#changes).
menu:
  flux_0_x_ref:
    name: promql.changes
    parent: internal/promql
    identifier: internal/promql/changes
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L16-L16

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.changes()` implements functionality equivalent to
[PromQL's `changes()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#changes).



##### Function type signature

```js
promql.changes = (<-tables: stream[{A with _value: float}]) => stream[{B with _value: float}]
```

## Parameters

### tables


Input data. Default is piped-forward data (`<-`).

