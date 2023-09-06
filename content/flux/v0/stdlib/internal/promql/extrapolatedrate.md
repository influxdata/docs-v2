---
title: promql.extrapolatedRate() function
description: >
  `promql.extrapolatedRate()` is a helper function that calculates extrapolated rates over
  counters and is used to implement PromQL's
  [`rate()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#rate),
  [`delta()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#increase),
  and [`increase()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#delta) functions.
menu:
  flux_v0_ref:
    name: promql.extrapolatedRate
    parent: internal/promql
    identifier: internal/promql/extrapolatedRate
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L82-L86

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.extrapolatedRate()` is a helper function that calculates extrapolated rates over
counters and is used to implement PromQL's
[`rate()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#rate),
[`delta()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#increase),
and [`increase()`](https://prometheus.io/docs/prometheus/latest/querying/functions/#delta) functions.

**Important**: The `internal/promql` package is not meant for external use.

##### Function type signature

```js
(
    <-tables: stream[{A with _value: float, _time: time, _stop: time, _start: time}],
    ?isCounter: bool,
    ?isRate: bool,
) => stream[{B with _value: float}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).



### isCounter

Data represents a counter.



### isRate

Data represents a rate.



