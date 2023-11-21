---
title: monitor.stateChanges() function
description: >
  `monitor.stateChanges()` detects state changes in a stream of data with a `_level` column
  and outputs records that change from `fromLevel` to `toLevel`.
menu:
  flux_v0_ref:
    name: monitor.stateChanges
    parent: influxdata/influxdb/monitor
    identifier: influxdata/influxdb/monitor/stateChanges
weight: 301
flux/v0/tags: [transformations]
introduced: 0.42.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/monitor/monitor.flux#L329-L335

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`monitor.stateChanges()` detects state changes in a stream of data with a `_level` column
and outputs records that change from `fromLevel` to `toLevel`.



##### Function type signature

```js
(<-tables: stream[{C with _level: D}], ?fromLevel: A, ?toLevel: B) => stream[E] where A: Equatable, B: Equatable, D: Equatable, E: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### fromLevel

Level to detect a change from. Default is `"any"`.



### toLevel

Level to detect a change to. Default is `"any"`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Detect when the state changes to critical

```js
import "array"
import "influxdata/influxdb/monitor"

data =
    array.from(
        rows: [
            {_time: 2021-01-01T00:00:00Z, _level: "ok"},
            {_time: 2021-01-01T00:01:00Z, _level: "ok"},
            {_time: 2021-01-01T00:02:00Z, _level: "warn"},
            {_time: 2021-01-01T00:03:00Z, _level: "crit"},
        ],
    )

data
    |> monitor.stateChanges(toLevel: "crit")

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _level  |
| -------------------- | ------- |
| 2021-01-01T00:00:00Z | ok      |
| 2021-01-01T00:01:00Z | ok      |
| 2021-01-01T00:02:00Z | warn    |
| 2021-01-01T00:03:00Z | crit    |


#### Output data

| _time                | *_level |
| -------------------- | ------- |
| 2021-01-01T00:03:00Z | crit    |

{{% /expand %}}
{{< /expand-wrapper >}}
