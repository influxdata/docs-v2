---
title: monitor.from() function
description: >
  The `monitor.from()` function retrieves check statuses stored in the `statuses`
  measurement in the `_monitoring` bucket.
aliases:
  - /influxdb/v2.0/reference/flux/functions/monitor/from/
  - /influxdb/v2.0/reference/flux/stdlib/monitor/from/
  - /influxdb/cloud/reference/flux/stdlib/monitor/from/
menu:
  flux_0_x_ref:
    name: monitor.from
    parent: monitor
weight: 202
flux/v0.x/tags: [inputs]
introduced: 0.39.0
---

The `monitor.from()` function retrieves check statuses stored in the `statuses`
measurement in the `_monitoring` bucket.

```js
import "influxdata/influxdb/monitor"

monitor.from(
  start: -1h,
  stop: now(),
  fn: (r) => true
)
```


## Parameters

### start {data-type="duration, time, int"}
The earliest time to include in results.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

### stop {data-type="duration, time, int"}
The latest time to include in results.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.
Defaults to `now()`.

{{% note %}}
Time values in Flux must be in [RFC3339 format](/flux/v0.x/spec/types#timestamp-format).
{{% /note %}}

### fn {data-type="function"}
A single argument predicate function that evaluates `true` or `false`.
Records or rows (`r`) that evaluate to `true` are included in output tables.
Records that evaluate to _null_ or `false` are not included in output tables.

## Examples

### View critical check statuses from the last hour
```js
import "influxdata/influxdb/monitor"

monitor.from(
  start: -1h,
  fn: (r) => r._level == "crit"
)
```
