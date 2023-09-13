---
title: promql.emptyTable() function
description: >
  `promql.emptyTable()` returns an empty table, which is used as a helper function to implement
  PromQL's [`time()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#time) and
  [`vector()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#vector) functions.
menu:
  flux_v0_ref:
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

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L68-L68

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.emptyTable()` returns an empty table, which is used as a helper function to implement
PromQL's [`time()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#time) and
[`vector()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#vector) functions.

**Important**: The `internal/promql` package is not meant for external use.

##### Function type signature

```js
() => stream[{_value: float, _time: time, _stop: time, _start: time}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

