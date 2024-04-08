---
title: oee.computeAPQ() function
description: >
  `oee.computeAPQ()` computes availability, performance, and quality (APQ)
  and overall equipment effectiveness (OEE) using two separate input streams:
  **production events** and **part events**.
menu:
  flux_v0_ref:
    name: oee.computeAPQ
    parent: experimental/oee
    identifier: experimental/oee/computeAPQ
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/oee/oee.flux#L94-L155

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`oee.computeAPQ()` computes availability, performance, and quality (APQ)
and overall equipment effectiveness (OEE) using two separate input streams:
**production events** and **part events**.

## Output schema
For each input table, `oee.computeAPQ` outputs a table with a single row and
the following columns:

- **_time**: Timestamp associated with the APQ calculation.
- **availability**: Ratio of time production was in a running state.
- **oee**: Overall equipment effectiveness.
- **performance**: Ratio of production efficiency.
- **quality**: Ratio of production quality.
- **runTime**: Total nanoseconds spent in the running state.

##### Function type signature

```js
(
    idealCycleTime: A,
    partEvents: stream[B],
    plannedTime: C,
    productionEvents: stream[D],
    runningState: E,
) => stream[{
    F with
    runTime: H,
    quality: float,
    performance: float,
    oee: float,
    availability: float,
    _time: G,
    _stop: G,
}] where B: Record, D: Record, E: Equatable
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### productionEvents
({{< req >}})
Production events stream that contains the production
state or start and stop events.

Each row must contain the following columns:
- **_stop**: Right time boundary timestamp (typically assigned by `range()` or `window()`).
- **_time**: Timestamp of the production event.
- **state**: String that represents start or stop events or the production state.
Use [`runningState`](#runningstate) to specify which value in the `state`
column represents a running state.

### partEvents
({{< req >}})
Part events that contains the running totals of parts produced and
parts that do not meet quality standards.

Each row must contain the following columns:
- **_stop**: Right time boundary timestamp (typically assigned by
`range()` or `window()`).
- **_time**: Timestamp of the parts event.
- **partCount:** Cumulative total of parts produced.
- **badCount** Cumulative total of parts that do not meet quality standards.

### runningState
({{< req >}})
State value that represents a running state.



### plannedTime
({{< req >}})
Total time that equipment is expected to produce parts.



### idealCycleTime
({{< req >}})
Ideal minimum time to produce one part.



