---
title: promql.labelReplace() function
description: >
  `promql.labelReplace()` implements functionality equivalent to
  [PromQL's `label_replace()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#label_replace).
menu:
  flux_v0_ref:
    name: promql.labelReplace
    parent: internal/promql
    identifier: internal/promql/labelReplace
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L138-L144

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.labelReplace()` implements functionality equivalent to
[PromQL's `label_replace()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#label_replace).

**Important**: The `internal/promql` package is not meant for external use.

##### Function type signature

```js
(
    <-tables: stream[{A with _value: float}],
    destination: string,
    regex: string,
    replacement: string,
    source: string,
) => stream[{B with _value: float}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).



### source
({{< req >}})
Input label.



### destination
({{< req >}})
Output label.



### regex
({{< req >}})
Pattern as a regex string.



### replacement
({{< req >}})
Replacement value.



