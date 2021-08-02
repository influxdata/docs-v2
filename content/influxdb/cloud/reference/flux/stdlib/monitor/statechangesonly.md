---
title: monitor.stateChangesOnly() function
description: >
  The `monitor.stateChangesOnly()` function takes a stream of tables that contains a `_level`
  column and returns a stream of tables where each record represents a state change.
menu:
  influxdb_cloud_ref:
    name: monitor.stateChangesOnly
    parent: InfluxDB monitor
weight: 202
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
|:----- |:------:|
| 0002  | ok     |
| 0003  | warn   |
| 0004  | crit   |
{{% /flex-content %}}
{{< /flex >}}
