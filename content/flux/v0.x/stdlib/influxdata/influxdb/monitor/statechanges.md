---
title: monitor.stateChanges() function
description: >
  The `monitor.stateChanges()` function detects state changes in a stream of tables and
  outputs records that change from `fromLevel` to `toLevel`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/monitor/statechanges/
  - /influxdb/v2.0/reference/flux/stdlib/monitor/statechanges/
  - /influxdb/cloud/reference/flux/stdlib/monitor/statechanges/
menu:
  flux_0_x_ref:
    name: monitor.stateChanges
    parent: monitor
weight: 202
flux/v0.x/tags: [transformations]
introduced: 0.42.0
---

The `monitor.stateChanges()` function detects state changes in a stream of data with
a `_level` column and outputs records that change from `fromLevel` to `toLevel`.

```js
import "influxdata/influxdb/monitor"

monitor.stateChanges(
  fromLevel: "any",
  toLevel: "any"
)
```

## Parameters

### fromLevel {data-type="string"}
The level to detect a change from.
Defaults to `"any"`.

### toLevel {data-type="string"}
The level to detect a change to.
The function output records that change to this level.
Defaults to `"any"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

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
