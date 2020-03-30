---
title: monitor.stateChanges() function
description: >
  The `monitor.stateChanges()` function  detects state changes in a stream of data and
  outputs records that change from `fromLevel` to `toLevel`.
aliases:
  - /v2.0/reference/flux/functions/monitor/statechanges/
menu:
  v2_0_ref:
    name: monitor.stateChanges
    parent: InfluxDB Monitor
weight: 202
---

The `monitor.stateChanges()` function detects state changes in a stream of data with
a `_level` column and outputs records that change from `fromLevel` to `toLevel`.

_**Function type:** Transformation_

```js
import "influxdata/influxdb/monitor"

monitor.stateChanges(
  fromLevel: "any",
  toLevel: "any"
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
Defaults to `"any"`.

_**Data type:** String_

## Examples

##### Detect when the state changes to critical
```js
import "influxdata/influxdb/monitor"

monitor.from(start: -1h)
  |> monitor.stateChanges(toLevel: "crit")
```

## Function definition
```js
stateChanges = (fromLevel="any", toLevel="any", tables=<-) => {
  return
    if fromLevel == "any" and toLevel == "any" then tables |> stateChangesOnly()
    else tables |> _stateChanges(fromLevel: fromLevel, toLevel: toLevel)
}
```
