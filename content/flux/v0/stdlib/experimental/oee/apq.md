---
title: oee.APQ() function
description: >
  `oee.APQ()` computes availability, performance, quality (APQ) and overall equipment
  effectiveness (OEE) in producing parts.
menu:
  flux_v0_ref:
    name: oee.APQ
    parent: experimental/oee
    identifier: experimental/oee/APQ
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/oee/oee.flux#L210-L217

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`oee.APQ()` computes availability, performance, quality (APQ) and overall equipment
effectiveness (OEE) in producing parts.

Provide the required input schema to ensure this function successfully calculates APQ and OEE.

### Required input schema
Input tables must include the following columns:

- **_stop**: Right time boundary timestamp (typically assigned by `range()` or `window()`).
- **_time**: Timestamp of the production event.
- **state**: String that represents start or stop events or the production state.
- **partCount**: Cumulative total of parts produced.
- **badCount**: Cumulative total of parts that do not meet quality standards.

### Output schema
For each input table, `oee.APQ` outputs a table with a single row that includes the following columns:

- **_time**: Timestamp associated with the APQ calculation.
- **availability**: Ratio of time production was in a running state.
- **oee**: Overall equipment effectiveness.
- **performance**: Ratio of production efficiency.
- **quality**: Ratio of production quality.
- **runTime**: Total nanoseconds spent in the running state.

##### Function type signature

```js
(
    <-tables: stream[D],
    idealCycleTime: A,
    plannedTime: B,
    runningState: C,
) => stream[{
    E with
    runTime: G,
    quality: float,
    performance: float,
    oee: float,
    availability: float,
    _time: F,
    _stop: F,
}] where C: Equatable, D: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### runningState
({{< req >}})
State value that represents a running state.



### plannedTime
({{< req >}})
Total time that equipment is expected to produce parts.



### idealCycleTime
({{< req >}})
Ideal minimum time to produce one part.



### tables

Input data. Default is piped-forward data (`<-`).



