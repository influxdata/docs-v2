---
title: promql.promqlMinute() function
description: >
  `promql.promqlMinute()` implements functionality equivalent to
  [PromQL's `minute()` function]( https://prometheus.io/docs/prometheus/latest/querying/functions/#minute).
menu:
  flux_0_x_ref:
    name: promql.promqlMinute
    parent: internal/promql
    identifier: internal/promql/promqlMinute
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L133-L133

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.promqlMinute()` implements functionality equivalent to
[PromQL's `minute()` function]( https://prometheus.io/docs/prometheus/latest/querying/functions/#minute).



##### Function type signature

```js
promql.promqlMinute = (timestamp: float) => float
```

## Parameters

### timestamp
({{< req >}})
Time as a floating point value.



