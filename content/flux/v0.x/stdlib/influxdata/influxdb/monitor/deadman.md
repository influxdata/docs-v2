---
title: monitor.deadman() function
description: >
  The `monitor.deadman()` function detects when a group stops reporting data.
aliases:
  - /influxdb/v2.0/reference/flux/functions/monitor/deadman/
  - /influxdb/v2.0/reference/flux/stdlib/monitor/deadman/
  - /influxdb/cloud/reference/flux/stdlib/monitor/deadman/
menu:
  flux_0_x_ref:
    name: monitor.deadman
    parent: monitor
weight: 202
flux/v0.x/tags: [transformations]
introduced: 0.39.0
---

The `monitor.deadman()` function detects when a group stops reporting data.
It takes a stream of tables and reports if groups have been observed since time `t`.

```js
import "influxdata/influxdb/monitor"

monitor.deadman(t: 2019-08-30T12:30:00Z)
```

`monitor.deadman()` retains the most recent row from each input table and adds a `dead` column.
If a record appears **after** time `t`, `monitor.deadman()` sets `dead` to `false`.
Otherwise, `dead` is set to `true`.

## Parameters

### t {data-type="time"}
The time threshold for the deadman check.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

### Detect if a host hasn't reported in the last five minutes
```js
import "influxdata/influxdb/monitor"
import "experimental"

from(bucket: "example-bucket")
  |> range(start: -10m)
  |> group(columns: ["host"])
  |> monitor.deadman(t: experimental.subDuration(d: 30s, from: now() ))
```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}
##### Example input data
| _start               | _stop                | _time                | _measurement | _host | _field | _value |
| :------------------- | :------------------- | :------------------- | :----------- | :---- | :----- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:03:00Z | 2021-01-01T00:00:00Z | example      | h1    | resp   |    200 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:03:00Z | 2021-01-01T00:00:30Z | example      | h1    | resp   |    200 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:03:00Z | 2021-01-01T00:01:00Z | example      | h1    | resp   |    500 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:03:00Z | 2021-01-01T00:01:30Z | example      | h1    | resp   |    500 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:03:00Z | 2021-01-01T00:02:00Z | example      | h1    | resp   |    200 |

##### Example output data
| _start               | _stop                | _time                | _measurement | _host | _field | _value | dead |
| :------------------- | :------------------- | :------------------- | :----------- | :---- | :----- | -----: | ---: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:03:00Z | 2021-01-01T00:02:00Z | example      | h1    | resp   |    200 | true |
{{% /expand %}}
{{< /expand-wrapper >}}
