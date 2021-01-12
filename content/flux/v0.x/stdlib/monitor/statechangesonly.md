---
title: monitor.stateChangesOnly() function
description: >
  The `monitor.stateChangesOnly()` function takes a stream of tables that contains a `_level`
  column and returns a stream of tables where each record represents a state change.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/monitor/statechangesonly/
  - /influxdb/cloud/reference/flux/stdlib/monitor/statechangesonly/
menu:
  flux_0_x_ref:
    name: monitor.stateChangesOnly
    parent: InfluxDB Monitor
weight: 202
introduced: 0.65.0
---

The `monitor.stateChangesOnly()` function takes a stream of tables that contains a `_level`
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
**`monitor.stateChangesOnly()` outputs:**

| _time | _level |
|:introduced: 0.65.0
----- |:------:|
| 0002  | ok     |
| 0003  | warn   |
| 0004  | crit   |
{{% /flex-content %}}
{{< /flex >}}
