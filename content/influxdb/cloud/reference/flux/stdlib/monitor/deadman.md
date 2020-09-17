---
title: monitor.deadman() function
description: >
  The `monitor.deadman()` function detects when a group stops reporting data.
aliases:
  - /influxdb/cloud/reference/flux/functions/monitor/deadman/
menu:
  influxdb_cloud_ref:
    name: monitor.deadman
    parent: InfluxDB Monitor
weight: 202
cloud_all: true
---

The `monitor.deadman()` function detects when a group stops reporting data.
It takes a stream of tables and reports if groups have been observed since time `t`.

_**Function type:** Transformation_

```js
import "influxdata/influxdb/monitor"

monitor.deadman(t: 2019-08-30T12:30:00Z)
```

`monitor.deadman()` retains the most recent row from each input table and adds a `dead` column.
If a record appears **after** time `t`, `monitor.deadman()` sets `dead` to `false`.
Otherwise, `dead` is set to `true`.

## Parameters

### t
The time threshold for the deadman check.

_**Data type:** Time_

## Examples

### Detect if a host hasn't reported in the last five minutes
```js
import "influxdata/influxdb/monitor"
import "experimental"

from(bucket: "example-bucket")
  |> range(start: -10m)
  |> group(columns: ["host"])
  |> monitor.deadman(t: experimental.subDuration(d: 5m, from: now() ))
```
