---
title: monitor.logs() function
description: >
  The `monitor.logs()` function retrieves notification events stored in the `notifications`
  measurement in the `_monitoring` bucket.
aliases:
  - /v2.0/reference/flux/functions/monitor/logs/
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
Use a relative duration or absolute time.
For example, `-1h` or `2019-08-28T22:00:00Z`.
Durations are relative to `now()`.
Integers are nanosecond Unix timestamps.

_**Data type:** Duration | Time | Integer_

### stop
The latest time to include in results.
Use a relative duration or absolute time.
For example, `-1h` or `2019-08-28T22:00:00Z`.
Durations are relative to `now()`.
Integers are nanosecond Unix timestamps.
Defaults to `now()`.

_**Data type:** Duration | Time | Integer_

{{% note %}}
Time values in Flux must be in [RFC3339 format](/v2.0/reference/flux/language/types#timestamp-format).
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
