---
title: monitor.stateChangesOnly() function
description: >
  The `monitor.stateChangesOnly()` function  takes a stream of tables that contains a` _level`
  column and returns a stream of tables where each record represents a state change.
menu:
  v2_0_ref:
    name: monitor.stateChangesOnly
    parent: InfluxDB Monitor
weight: 202
---

The `monitor.stateChangesOnly()` function takes a stream of tables that contains a` _level`
column and returns a stream of tables where each record represents a state change.

_**Function type:** Transformation_

```js
import "influxdata/influxdb/monitor"

monitor.stateChangesOnly()
```

## Examples

##### Return records representing state changes
```js
import "influxdata/influxdb/monitor"


monitor.from(start: -1h)
  |> monitor.stateChangesOnly()
```
