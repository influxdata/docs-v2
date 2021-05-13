---
title: tickscript.join() function
description: >
  The `tickscript.join()` function merges two input streams into a single output
  stream based on specified columns with equal values and appends a new measurement name.
menu:
  flux_0_x_ref:
    name: tickscript.join
    parent: tickscript
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/join/
  - /influxdb/cloud/reference/flux/stdlib/contrib/tickscript/join/
related:
  - /{{< latest "kapacitor" >}}/nodes/join_node/, Kapacitor JoinNode
  - /flux/v0.x/stdlib/universe/join/
flux/v0.x/tags: [transformations]
---

The `tickscript.join()` function merges two input streams into a single output
stream based on specified columns with equal values and appends a new measurement name.

_This function is comparable to the [Kapacitor JoinNode](/{{< latest "kapacitor" >}}/nodes/join_node/)._

```js
import "contrib/bonitoo-io/tickscript"

tickscript.join(
  tables: {t1: example1, t2: example2}
  on: ["_time"],
  measurement: "example-measurement"
)
```

## Parameters

### tables {data-type="record"}
({{< req >}})
Map of two streams to join.

### on {data-type="array of strings"}
List of columns to join on.
Default is `["_time"]`.

### measurement {data-type="string"}
({{< req >}})
Measurement name to use in results.

## Examples

### Join two streams of data

#### Input data

{{< flex >}}
{{% flex-content %}}
##### metrics
| _time                | host  | _value |
|:-----                |:----  | ------:|
| 2021-01-01T00:00:00Z | host1 | 1.2    |
| 2021-01-01T01:00:00Z | host1 | 0.8    |
| 2021-01-01T02:00:00Z | host1 | 3.2    |

| _time                | host  | _value |
|:-----                |:----  | ------:|
| 2021-01-01T00:00:00Z | host2 | 8.4    |
| 2021-01-01T01:00:00Z | host2 | 7.3    |
| 2021-01-01T02:00:00Z | host2 | 7.9    |
{{% /flex-content %}}
{{% flex-content %}}
##### states
| _time                | host  | _value |
|:-----                |:----  | ------:|
| 2021-01-01T00:00:00Z | host1 | dead   |
| 2021-01-01T01:00:00Z | host1 | dead   |
| 2021-01-01T02:00:00Z | host1 | alive  |

| _time                | host  | _value |
|:-----                |:----  | ------:|
| 2021-01-01T00:00:00Z | host2 | alive  |
| 2021-01-01T01:00:00Z | host2 | alive  |
| 2021-01-01T02:00:00Z | host2 | alive  |
{{% /flex-content %}}
{{< /flex >}}

#### Query
```js
import "contrib/bonitoo-io/tickscript"

metrics = //...
states = //...

tickscript.join(
  tables: {metric: metrics, state: states},
  on: ["_time", "host"],
  measurement: "example-m"
)
```

#### Output data

| _measurement | host  | _time                | _value_metric | _value_state |
|:------------ |:----  |:-----                | -------------:| ------------:|
| example-m    | host1 | 2021-01-01T00:00:00Z | 1.2           | dead         |
| example-m    | host1 | 2021-01-01T01:00:00Z | 0.8           | dead         |
| example-m    | host1 | 2021-01-01T02:00:00Z | 3.2           | alive        |

| _measurement | host  | _time                | _value_metric | _value_state |
|:------------ |:----  |:-----                | -------------:| ------------:|
| example-m    | host2 | 2021-01-01T00:00:00Z | 8.4           | alive        |
| example-m    | host2 | 2021-01-01T01:00:00Z | 7.3           | alive        |
| example-m    | host2 | 2021-01-01T02:00:00Z | 7.9           | alive        |
