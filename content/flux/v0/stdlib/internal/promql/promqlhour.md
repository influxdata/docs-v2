---
title: promql.promqlHour() function
description: >
  `promql.promqlHour()` implements functionality equivalent to
  [PromQL's `hour()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#hour).
menu:
  flux_v0_ref:
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

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L110-L110

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.promqlHour()` implements functionality equivalent to
[PromQL's `hour()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#hour).

**Important**: The `internal/promql` package is not meant for external use.

##### Function type signature

```js
(timestamp: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### timestamp
({{< req >}})
Time as a floating point value.



