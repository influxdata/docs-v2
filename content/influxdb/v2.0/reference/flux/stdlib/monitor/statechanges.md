---
title: monitor.stateChanges() function
description: >
  The `monitor.stateChanges()` function detects state changes in a stream of tables and
  outputs records that change from `fromLevel` to `toLevel`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/monitor/statechanges/
menu:
  influxdb_2_0_ref:
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

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time | _level |
|:----- |:------:|
| 0001  | ok     |
| 0002  | ok     |
| 0003  | warn   |
| 0004  | crit   |
{{% /flex-content %}}
{{% flex-content %}}
**The following function outputs:**

```js
monitor.stateChanges(
  toLevel: "crit"
)
```

| _time | _level |
|:----- |:------:|
| 0004  | crit   |
{{% /flex-content %}}
{{< /flex >}}

## Function definition
```js
stateChanges = (fromLevel="any", toLevel="any", tables=<-) => {
  return
    if fromLevel == "any" and toLevel == "any" then tables |> stateChangesOnly()
    else tables |> _stateChanges(fromLevel: fromLevel, toLevel: toLevel)
}
```
