---
title: promql.promqlDayOfWeek() function
description: >
  `promql.promqlDayOfWeek()` implements functionality equivalent to
  [PromQL's `day_of_week()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#day_of_week).
menu:
  flux_0_x_ref:
    name: promql.promqlDayOfWeek
    parent: internal/promql
    identifier: internal/promql/promqlDayOfWeek
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L30-L30

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.promqlDayOfWeek()` implements functionality equivalent to
[PromQL's `day_of_week()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#day_of_week).



##### Function type signature

```js
promql.promqlDayOfWeek = (timestamp: float) => float
```

## Parameters

### timestamp
({{< req >}})
Time as a floating point value.



