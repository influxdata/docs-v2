---
title: monitor.stateChanges() function
description: >
  The `monitor.stateChanges()` function  detects state changes in a stream of data and
  outputs records that change from `fromLevel` to `toLevel`.
menu:
  v2_0_ref:
    name: monitor.stateChanges
    parent: InfluxDB Monitor
weight: 202
cloud_all: true
---

The `monitor.stateChanges()` function detects state changes in a stream of data and
outputs records that change from `fromLevel` to `toLevel`.

{{% note %}}
`monitor.stateChanges` operates on data in the `statuses` measurement and requires a `_level` column .
{{% /note %}}

_**Function type:** Transformation_

```js
import "influxdata/influxdb/monitor"

monitor.stateChanges(
  fromLevel: "any",
  toLevel: "crit"
)
```

## Parameters

### fromLevel
The level to detect a change from.
Defaults to `"any"`.

_**Data type:** String_

### toLevel
The level to detect a change to.
The function output records that change to this level.

_**Data type:** String_

## Examples

### Detect when the state changes to critical
```js
import "influxdata/influxdb/monitor"

monitor.from(start: -1h)
  |> monitor.stateChanges(toLevel: "crit")
```
