---
title: monitor.logs() function
description: >
  The `monitor.logs()` function retrieves notification events stored in the `notifications`
  measurement in the `_monitoring` bucket.
aliases:
  - /influxdb/v2.0/reference/flux/functions/monitor/logs/
menu:
  influxdb_2_0_ref:
    name: monitor.logs
    parent: InfluxDB Monitor
weight: 202
---

The `monitor.logs()` function retrieves notification events stored in the `notifications`
measurement in the `_monitoring` bucket.

_**Function type:** Input_

```js
import "influxdata/influxdb/monitor"

monitor.logs(
  start: -1h,
  stop: now(),
  fn: (r) => true
)
```

## Parameters

### start
The earliest time to include in results.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

_**Data type:** Duration | Time | Integer_

### stop
The latest time to include in results.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.
Defaults to `now()`.

_**Data type:** Duration | Time | Integer_

{{% note %}}
Time values in Flux must be in [RFC3339 format](/influxdb/v2.0/reference/flux/language/types#timestamp-format).
{{% /note %}}

### fn
A single argument predicate function that evaluates `true` or `false`.
Records or rows (`r`) that evaluate to `true` are included in output tables.
Records that evaluate to _null_ or `false` are not included in output tables.

_**Data type:** Function_

## Examples

### Query notification events from the last hour
```js
import "influxdata/influxdb/monitor"

monitor.logs(start: -1h)
```
