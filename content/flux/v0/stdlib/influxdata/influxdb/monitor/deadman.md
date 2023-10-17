---
title: monitor.deadman() function
description: >
  `monitor.deadman()` detects when a group stops reporting data.
  It takes a stream of tables and reports if groups have been observed since time `t`.
menu:
  flux_v0_ref:
    name: monitor.deadman
    parent: influxdata/influxdb/monitor
    identifier: influxdata/influxdb/monitor/deadman
weight: 301
flux/v0.x/tags: [transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/monitor/monitor.flux#L386-L389

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`monitor.deadman()` detects when a group stops reporting data.
It takes a stream of tables and reports if groups have been observed since time `t`.

`monitor.deadman()` retains the most recent row from each input table and adds a `dead` column.
If a record appears after time `t`, `monitor.deadman()` sets `dead` to `false`.
Otherwise, `dead` is set to `true`.

##### Function type signature

```js
(<-tables: stream[{B with _time: C}], t: A) => stream[{B with dead: bool, _time: C}] where A: Comparable, C: Comparable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### t
({{< req >}})
Time threshold for the deadman check.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Detect if a host hasn’t reported since a specific time](#detect-if-a-host-hasnt-reported-since-a-specific-time)
- [Detect if a host hasn't reported since a relative time](#detect-if-a-host-hasnt-reported-since-a-relative-time)

### Detect if a host hasn’t reported since a specific time

```js
import "array"
import "influxdata/influxdb/monitor"

data =
    array.from(
        rows: [
            {_time: 2021-01-01T00:00:00Z, host: "a", _value: 1.2},
            {_time: 2021-01-01T00:01:00Z, host: "a", _value: 1.3},
            {_time: 2021-01-01T00:02:00Z, host: "a", _value: 1.4},
            {_time: 2021-01-01T00:03:00Z, host: "a", _value: 1.3},
        ],
    )
        |> group(columns: ["host"])

data
    |> monitor.deadman(t: 2021-01-01T00:05:00Z)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *host | _value  |
| -------------------- | ----- | ------- |
| 2021-01-01T00:00:00Z | a     | 1.2     |
| 2021-01-01T00:01:00Z | a     | 1.3     |
| 2021-01-01T00:02:00Z | a     | 1.4     |
| 2021-01-01T00:03:00Z | a     | 1.3     |


#### Output data

| _time                | _value  | dead  | *host |
| -------------------- | ------- | ----- | ----- |
| 2021-01-01T00:03:00Z | 1.3     | true  | a     |

{{% /expand %}}
{{< /expand-wrapper >}}

### Detect if a host hasn't reported since a relative time

Use `date.add()` to return a time value relative to a specified time.

```js
import "influxdata/influxdb/monitor"
import "date"

from(bucket: "example-bucket")
    |> range(start: -10m)
    |> filter(fn: (r) => r._measurement == "example-measurement")
    |> monitor.deadman(t: date.add(d: -5m, to: now()))

```

