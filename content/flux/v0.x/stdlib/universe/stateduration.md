---
title: stateDuration() function
description: The `stateDuration()` function computes the duration of a given state.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/stateduration
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/stateduration/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stateduration/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/stateduration/
menu:
  flux_0_x_ref:
    name: stateDuration
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/monitor-states/
  - /flux/v0.x/stdlib/contrib/tomhollingworth/events/duration/
introduced: 0.7.0
---

The `stateDuration()` function computes the duration of a given state.
The state is defined via the function `fn`.
For each consecutive point for that evaluates as `true`, the state duration will be
incremented by the duration between points.
When a point evaluates as `false`, the state duration is reset.
The state duration is added as an additional column to each record.

{{% note %}}
As the first point in the given state has no previous point, its
state duration will be 0.
{{% /note %}}

```js
stateDuration(fn: (r) => r._measurement == "state", column: "stateDuration", unit: 1s)
```

_If the expression generates an error during evaluation, the point is discarded,
and does not affect the state duration._

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

### fn {data-type="function"}

A single argument function that evaluates true or false to identify the state of the record.
Records are passed to the function.
Those that evaluate to `true` increment the state duration.
Those that evaluate to `false` reset the state duration.

### column {data-type="string"}

The name of the column added to each record that contains the state duration.

### unit {data-type="duration"}

The unit of time in which the state duration is incremented.
For example: `1s`, `1m`, `1h`, etc.
The default unit is one second (`1s`).

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

```js
from("monitor/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "http")
  |> stateDuration(
    fn: (r) => r.http_response_code == "500",
    column: "server_error_duration"
  )
```
