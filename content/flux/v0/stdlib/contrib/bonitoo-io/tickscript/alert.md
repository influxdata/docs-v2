---
title: tickscript.alert() function
description: >
  `tickscript.alert()` identifies events of varying severity levels
  and writes them to the `statuses` measurement in the InfluxDB `_monitoring`
  system bucket.
menu:
  flux_v0_ref:
    name: tickscript.alert
    parent: contrib/bonitoo-io/tickscript
    identifier: contrib/bonitoo-io/tickscript/alert
weight: 301
flux/v0.x/tags: [transformations, outputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/tickscript/tickscript.flux#L105-L145

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`tickscript.alert()` identifies events of varying severity levels
and writes them to the `statuses` measurement in the InfluxDB `_monitoring`
system bucket.

This function is comparable to
TICKscript [`alert()`](/kapacitor/v1/reference/nodes/alert_node/).

##### Function type signature

```js
(
    <-tables: stream[M],
    check: {A with tags: E, _type: D, _check_name: C, _check_id: B},
    ?crit: (r: {F with _time: H, _measurement: G}) => bool,
    ?details: (r: {I with id: J, _check_name: C, _check_id: B}) => K,
    ?id: (r: {I with _check_name: C, _check_id: B}) => J,
    ?info: (r: {F with _time: H, _measurement: G}) => bool,
    ?message: (
        r: {
            F with
            _type: D,
            _time: H,
            _time: time,
            _source_timestamp: int,
            _source_measurement: G,
            _measurement: G,
            _measurement: string,
            _level: string,
            _check_name: C,
            _check_id: B,
        },
    ) => L,
    ?ok: (r: {F with _time: H, _measurement: G}) => bool,
    ?topic: string,
    ?warn: (r: {F with _time: H, _measurement: G}) => bool,
) => stream[{
    F with
    _type: D,
    _time: H,
    _time: time,
    _source_timestamp: int,
    _source_measurement: G,
    _message: L,
    _measurement: G,
    _measurement: string,
    _level: string,
    _check_name: C,
    _check_id: B,
}] where E: Record, I: Record, M: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### check
({{< req >}})
InfluxDB check data.
See `tickscript.defineCheck()`.



### id

Function that returns the InfluxDB check ID provided by the check record.
Default is `(r) => "${r._check_id}"`.



### details

Function to return the InfluxDB check details using data from input rows.
Default is `(r) => ""`.



### message

Function to return the InfluxDB check message using data from input rows.
Default is `(r) => "Threshold Check: ${r._check_name} is: ${r._level}"`.



### crit

Predicate function to determine `crit` status. Default is `(r) => false`.



### warn

Predicate function to determine `warn` status. Default is `(r) => false`.



### info

Predicate function to determine `info` status. Default is `(r) => false`.



### ok

Predicate function to determine `ok` status. Default is `(r) => true`.



### topic

Check topic. Default is `""`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Store alert statuses for error counts

```js
import "contrib/bonitoo-io/tickscript"

option task = {name: "Example task", every: 1m}

check = tickscript.defineCheck(id: "000000000000", name: "Errors", type: "threshold")

from(bucket: "example-bucket")
    |> range(start: -task.every)
    |> filter(fn: (r) => r._measurement == "errors" and r._field == "value")
    |> count()
    |> tickscript.alert(
        check: {check with _check_id: "task/${r.service}"},
        message: "task/${r.service} is ${r._level} value: ${r._value}",
        crit: (r) => r._value > 30,
        warn: (r) => r._value > 20,
        info: (r) => r._value > 10,
    )

```

