---
title: monitor.deadman() function
description: >
  The `monitor.deadman()` function detects when a group stops reporting data.
menu:
  v2_0_ref:
    name: monitor.deadman
    parent: InfluxDB Monitor
weight: 202
cloud_all: true
---

The `monitor.deadman()` function detects when a group stops reporting data.
It takes a stream of tables and reports which groups or series are
observed before time `t`, but not after.

_**Function type:** Transformation_

```js
import "influxdata/influxdb/monitor"

monitor.deadman(t: -3m)
```

`monitor.deadman()` retains the most recent row from each input table and adds a `dead` column.
It sets `dead` to `true` if the record appears before time `t`.
It sets `dead` to `false` if the group appears after time `t`.

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
