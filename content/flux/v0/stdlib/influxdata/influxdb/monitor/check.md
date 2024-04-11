---
title: monitor.check() function
description: >
  `monitor.check()` checks input data and assigns a level (`ok`, `info`, `warn`, or `crit`)
  to each row based on predicate functions.
menu:
  flux_v0_ref:
    name: monitor.check
    parent: influxdata/influxdb/monitor
    identifier: influxdata/influxdb/monitor/check
weight: 301
flux/v0/tags: [transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/monitor/monitor.flux#L460-L506

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`monitor.check()` checks input data and assigns a level (`ok`, `info`, `warn`, or `crit`)
to each row based on predicate functions.

`monitor.check()` stores statuses in the `_level` column and writes results
to the `statuses` measurement in the `_monitoring` bucket.

##### Function type signature

```js
(
    <-tables: stream[J],
    data: {A with tags: E, _type: D, _check_name: C, _check_id: B},
    messageFn: (
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
    ) => I,
    ?crit: (r: {F with _time: H, _measurement: G}) => bool,
    ?info: (r: {F with _time: H, _measurement: G}) => bool,
    ?ok: (r: {F with _time: H, _measurement: G}) => bool,
    ?warn: (r: {F with _time: H, _measurement: G}) => bool,
) => stream[{
    F with
    _type: D,
    _time: H,
    _time: time,
    _source_timestamp: int,
    _source_measurement: G,
    _message: I,
    _measurement: G,
    _measurement: string,
    _level: string,
    _check_name: C,
    _check_id: B,
}] where E: Record, J: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### crit

Predicate function that determines `crit` status. Default is `(r) => false`.



### warn

Predicate function that determines `warn` status. Default is `(r) => false`.



### info

Predicate function that determines `info` status. Default is `(r) => false`.



### ok

Predicate function that determines `ok` status. `Default is (r) => true`.



### messageFn
({{< req >}})
Predicate function that constructs a message to append to each row.

The message is stored in the `_message` column.

### data
({{< req >}})
Check data to append to output used to identify this check.

This data specifies which notification rule and notification endpoint to
associate with the sent notification.
The data record must contain the following properties:
- **\_check\_id**: check ID _(string)_
- **\_check\_name**: check name _(string)_
- **\_type**: check type (threshold, deadman, or custom) _(string)_
- **tags**: Custom tags to append to output rows _(record)_
The InfluxDB monitoring and alerting system uses `monitor.check()` to
check statuses and automatically assigns these values.
If writing a custom check task, we recommend using **unique arbitrary**
values for data record properties.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Monitor InfluxDB disk usage collected by Telegraf

```js
import "influxdata/influxdb/monitor"

from(bucket: "telegraf")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "disk" and r._field == "used_percent")
    |> monitor.check(
        crit: (r) => r._value > 90.0,
        warn: (r) => r._value > 80.0,
        info: (r) => r._value > 70.0,
        ok: (r) => r._value <= 60.0,
        messageFn: (r) =>
            if r._level == "crit" then
                "Critical alert!! Disk usage is at ${r._value}%!"
            else if r._level == "warn" then
                "Warning! Disk usage is at ${r._value}%."
            else if r._level == "info" then
                "Disk usage is at ${r._value}%."
            else
                "Things are looking good.",
        data: {
            _check_name: "Disk Utilization (Used Percentage)",
            _check_id: "disk_used_percent",
            _type: "threshold",
            tags: {},
        },
    )

```

