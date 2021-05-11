---
title: stateCount() function
description: The `stateCount()` function computes the number of consecutive records in a given state.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/statecount
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/statecount/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/statecount/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/statecount/
menu:
  flux_0_x_ref:
    name: stateCount
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/monitor-states/
introduced: 0.7.0
---

The `stateCount()` function computes the number of consecutive records in a given state.
The state is defined via the function `fn`.
For each consecutive point that evaluates as `true`, the state count is incremented.
When a point evaluates as `false`, the state count is reset.
The state count is added as an additional column to each record.

```js
stateCount(fn: (r) => r._field == "state", column: "stateCount")
```

_If the expression generates an error during evaluation, the point is discarded
and does not affect the state count._

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

### fn {data-type="function"}

A single argument function that evaluates true or false to identify the state of the record.
Records are passed to the function.
Those that evaluate to `true` increment the state count.
Those that evaluate to `false` reset the state count.

### column {data-type="string"}

The name of the column added to each record that contains the incremented state count.

## Examples

```js
from("monitor/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "http")
  |> stateCount(
    fn: (r) => r.http_response_code == "500",
    column: "server_error_count"
  )
```
