---
title: monitor.deadman() function
description: >
  The `monitor.deadman()` function detects when a group stops reporting data.
menu:
  v2_0_ref:
    name: monitor.deadman
    parent: Monitor
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

`monitor.deadman()` retains the most recent row from each input table.
It adds a `dead` column to output tables.
If a group or series  and sets it to `true` if the row's gro

## Parameters

### v
The value to convert.

_**Data type:** Boolean | Duration | Float | Integer | String | Time | UInteger_

## Examples

### ...
```js
import "influxdata/influxdb/monitor"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> monitor.deadman(...)
```
