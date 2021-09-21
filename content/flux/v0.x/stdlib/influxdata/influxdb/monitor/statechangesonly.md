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
    parent: monitor
weight: 202
flux/v0.x/tags: [transformations]
introduced: 0.65.0
---

The `monitor.stateChangesOnly()` function takes a stream of tables that contains a `_level`
column and returns a stream of tables where each record represents a state change.

```js
import "influxdata/influxdb/monitor"

monitor.stateChangesOnly()
```

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

##### Return records representing state changes
```js
import "influxdata/influxdb/monitor"

monitor.from(start: -1h)
  |> monitor.stateChangesOnly()
```

{{< flex >}}
{{% flex-content %}}
##### Example input data

| _time | _level |
|:----- |:------:|
| 0001  | ok     |
| 0002  | ok     |
| 0003  | warn   |
| 0004  | crit   |
{{% /flex-content %}}
{{% flex-content %}}
##### Example output data

| _time | _level |
|:----- |:------:|
| 0002  | ok     |
| 0003  | warn   |
| 0004  | crit   |
{{% /flex-content %}}
{{< /flex >}}
