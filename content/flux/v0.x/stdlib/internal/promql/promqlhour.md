---
title: promql.promqlHour() function
description: >
  `promql.promqlHour()` implements functionality equivalent to
  [PromQL's `hour()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#hour).
menu:
  flux_0_x_ref:
    name: promql.promqlHour
    parent: internal/promql
    identifier: internal/promql/promqlHour
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L80-L80

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.promqlHour()` implements functionality equivalent to
[PromQL's `hour()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#hour).



##### Function type signature

```js
promql.promqlHour = (timestamp: float) => float
```

## Parameters

### timestamp

({{< req >}})
Time as a floating point value.

