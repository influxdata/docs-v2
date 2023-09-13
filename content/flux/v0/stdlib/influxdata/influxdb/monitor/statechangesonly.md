---
title: monitor.stateChangesOnly() function
description: >
  `monitor.stateChangesOnly()` takes a stream of tables that contains a _level column
  and returns a stream of tables grouped by `_level` where each record
  represents a state change.
menu:
  flux_v0_ref:
    name: monitor.stateChangesOnly
    parent: influxdata/influxdb/monitor
    identifier: influxdata/influxdb/monitor/stateChangesOnly
weight: 301
flux/v0.x/tags: [transformations]
introduced: 0.65.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/monitor/monitor.flux#L269-L295

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`monitor.stateChangesOnly()` takes a stream of tables that contains a _level column
and returns a stream of tables grouped by `_level` where each record
represents a state change.



##### Function type signature

```js
(<-tables: stream[{A with _level: B}]) => stream[C] where B: Equatable, C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Return records representing state changes

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
    |> monitor.stateChangesOnly()

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

| _time                | *_level |
| -------------------- | ------- |
| 2021-01-01T00:02:00Z | warn    |

{{% /expand %}}
{{< /expand-wrapper >}}
