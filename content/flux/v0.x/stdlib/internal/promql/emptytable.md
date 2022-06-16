---
title: promql.emptyTable() function
description: >
  `promql.emptyTable()` returns an empty table, which is used as a helper function to implement
  PromQL's [`time()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#time) and
  [`vector()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#vector) functions.
menu:
  flux_0_x_ref:
    name: promql.emptyTable
    parent: internal/promql
    identifier: internal/promql/emptyTable
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L42-L42

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.emptyTable()` returns an empty table, which is used as a helper function to implement
PromQL's [`time()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#time) and
[`vector()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#vector) functions.



##### Function type signature

```js
promql.emptyTable = () => stream[{_value: float, _time: time, _stop: time, _start: time}]
```

