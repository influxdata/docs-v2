---
title: promql.promqlYear() function
description: >
  `promql.promqlYear()` implements functionality equivalent to
  [PromQL's `year()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#year).
menu:
  flux_0_x_ref:
    name: promql.promqlYear
    parent: internal/promql
    identifier: internal/promql/promqlYear
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L181-L181

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.promqlYear()` implements functionality equivalent to
[PromQL's `year()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#year).



##### Function type signature

```js
promql.promqlYear = (timestamp: float) => float
```

## Parameters

### timestamp
({{< req >}})
Time as a floating point value.



