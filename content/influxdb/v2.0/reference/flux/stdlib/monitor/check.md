---
title: monitor.check() function
description: >
  The `monitor.check()` function checks input data and assigns a level
  (`ok`, `info`, `warn`, or `crit`) to each row based on predicate functions.
aliases:
  - /influxdb/v2.0/reference/flux/functions/monitor/check/
menu:
  influxdb_2_0_ref:
    name: monitor.check
    parent: InfluxDB Monitor
weight: 202
---

The `monitor.check()` function checks input data and assigns a level
(`ok`, `info`, `warn`, or `crit`) to each row based on predicate functions.

_**Function type:** Transformation_

```js
import "influxdata/influxdb/monitor"

monitor.check(
  crit: (r) => r._value > 90.0,
  warn: (r) => r._value > 80.0,
  info: (r) => r._value > 60.0,
  ok:   (r) => r._value <= 20.0,
  messageFn: (r) => "The current level is ${r._level}",
  data: {}
)
```

`monitor.check()` stores statuses in the `_level` column and writes results
to the `statuses` measurement in the `_monitoring` bucket.

## Parameters

### crit
Predicate function that determines `crit` status.
Default is `(r) => false`.

_**Data type:** Function_

### warn
Predicate function that determines `warn` status.
Default is `(r) => false`.

_**Data type:** Function_

### info
Predicate function that determines `info` status.
Default is `(r) => false`.

_**Data type:** Function_

### ok
Predicate function that determines `ok` status.
Default is `(r) => true`.

_**Data type:** Function_

### messageFn
A function that constructs a message to append to each row.
The message is stored in the `_message` column.

_**Data type:** Function_

### data
Meta data used to identify this check.

**InfluxDB populates check data.**

_**Data type:** Record_

## Examples

### Monitor disk usage
```js
import "influxdata/influxdb/monitor"

from(bucket: "telegraf")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      r._measurement == "disk" and
      r._field = "used_percent"
  )
  |> group(columns: ["_measurement"])
  |> monitor.check(
    crit: (r) => r._value > 90.0,
    warn: (r) => r._value > 80.0,
    info: (r) => r._value > 70.0,
    ok:   (r) => r._value <= 60.0,
    messageFn: (r) =>
      if r._level == "crit" then "Critical alert!! Disk usage is at ${r._value}%!"
      else if r._level == "warn" then "Warning! Disk usage is at ${r._value}%."
      else if r._level == "info" then "Disk usage is at ${r._value}%."
      else "Things are looking good.",
    data: {
      _check_name: "Disk Utilization (Used Percentage)",
      _check_id: "disk_used_percent",
      _type: "threshold",
      tags: {}
    }
  )
```
