---
title: monitor.logs() function
description: >
  The `monitor.logs()` function retrieves notification events stored in the `_monitoring` bucket.
menu:
  v2_0_ref:
    name: monitor.logs
    parent: Monitor
weight: 202
---

The `monitor.logs()` function retrieves notification events stored in the `_monitoring` bucket.

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
The oldest time to include in results.

Relative start times are defined using negative durations.
Negative durations are relative to now.
Absolute start times are defined using timestamps.

_**Data type:** Duration | Time_

### stop
The newest time to include in the results.
Defaults to `now()`.

Relative stop times are defined using negative durations.
Negative durations are relative to now.
Absolute stop times are defined using timestamps.

_**Data type:** Duration | Time_

{{% note %}}
Flux only honors [RFC3339 timestamps](/v2.0/reference/flux/language/types#timestamp-format)
and ignores dates and times provided in other formats.
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
