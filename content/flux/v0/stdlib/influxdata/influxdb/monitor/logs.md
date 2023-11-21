---
title: monitor.logs() function
description: >
  `monitor.logs()` retrieves notification events stored in the `notifications` measurement
  in the `_monitoring` bucket.
menu:
  flux_v0_ref:
    name: monitor.logs
    parent: influxdata/influxdb/monitor
    identifier: influxdata/influxdb/monitor/logs
weight: 301
flux/v0/tags: [inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/monitor/monitor.flux#L67-L72

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`monitor.logs()` retrieves notification events stored in the `notifications` measurement
in the `_monitoring` bucket.



##### Function type signature

```js
(
    fn: (
        r: {
            A with
            _value: B,
            _time: time,
            _stop: time,
            _start: time,
            _measurement: string,
            _field: string,
        },
    ) => bool,
    start: C,
    ?stop: D,
) => stream[E] where E: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### start
({{< req >}})
Earliest time to include in results.

Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

### stop

Latest time to include in results. Default is `now()`.

Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

### fn
({{< req >}})
Predicate function that evaluates true or false.

Records or rows (`r`) that evaluate to `true` are included in output tables.
Records that evaluate to _null_ or `false` are not included in output tables.


## Examples

### Query notification events from the last hour

```js
import "influxdata/influxdb/monitor"

monitor.logs(start: -2h, fn: (r) => true)

```

