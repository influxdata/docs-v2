---
title: tickscript.deadman() function
description: >
  `tickscript.deadman()` detects low data throughput and writes a point with a critical status to
  the InfluxDB `_monitoring` system bucket.
menu:
  flux_0_x_ref:
    name: tickscript.deadman
    parent: contrib/bonitoo-io/tickscript
    identifier: contrib/bonitoo-io/tickscript/deadman
weight: 301
flux/v0.x/tags: [transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/tickscript/tickscript.flux#L186-L242

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`tickscript.deadman()` detects low data throughput and writes a point with a critical status to
the InfluxDB `_monitoring` system bucket.

For each input table containing a number of rows less than or equal to the specified threshold,
the function assigns a `crit` value to the` _level` column.

This function is comparable to [Kapacitor AlertNode deadman](https://docs.influxdata.com/kapacitor/latest/nodes/stream_node/#deadman).

##### Function type signature

```js
tickscript.deadman = (
    <-tables: stream[t12],
    check: {A with tags: E, _type: D, _check_name: C, _check_id: B},
    measurement: string,
    ?id: (r: {F with _check_name: C, _check_id: B}) => G,
    ?message: (
        r: {
            H with
            dead: bool,
            _type: D,
            _time: J,
            _time: time,
            _source_timestamp: int,
            _source_measurement: I,
            _measurement: I,
            _measurement: string,
            _level: string,
            _check_name: C,
            _check_id: B,
        },
    ) => t10,
    ?threshold: t11,
    ?topic: string,
) => stream[{
    H with
    dead: bool,
    _type: D,
    _time: J,
    _time: time,
    _source_timestamp: int,
    _source_measurement: I,
    _message: t10,
    _measurement: I,
    _measurement: string,
    _level: string,
    _check_name: C,
    _check_id: B,
}] where E: Record, F: Record, t11: Comparable + Equatable, t12: Record
```

## Parameters

### check

({{< req >}})
InfluxDB check data. See `tickscript.defineCheck()`.

### measurement

({{< req >}})
Measurement name. Should match the queried measurement.

### threshold


Count threshold. Default is `0`.The function assigns a `crit` status to input tables with a number of rows less than or equal to the threshold.

### id


Function that returns the InfluxDB check ID provided by the check record.
Default is `(r) => "${r._check_id}"`.

### message


Function that returns the InfluxDB check message using data from input rows.
Default is `(r) => "Deadman Check: ${r._check_name} is: " + (if r.dead then "dead" else "alive")`.

### topic


Check topic. Default is `""`.

### tables


Input data. Default is piped-forward data (`<-`).


## Examples


### Detect when a series stops reporting

```js
import "contrib/bonitoo-io/tickscript"

option task = {name: "Example task", every: 1m}

from(bucket: "example-bucket")
    |> range(start: -task.every)
    |> filter(fn: (r) => r._measurement == "pulse" and r._field == "value")
    |> tickscript.deadman(
        check: tickscript.defineCheck(id: "000000000000", name: "task/${r.service}"),
        measurement: "pulse",
        threshold: 2,
    )
```

