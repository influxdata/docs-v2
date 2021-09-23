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
Make sure `fn` parameter names match each specified parameter.
To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

### fn {data-type="function"}
({{< req >}})
A single argument function that evaluates true or false to identify the state of the record.
Records are passed to the function.
Those that evaluate to `true` increment the state count.
Those that evaluate to `false` reset the state count.

### column {data-type="string"}
Name of the column added to each record that contains the incremented state count.
Default is `stateCount`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

```js
import "sampledata"

sampledata.int()
  |> stateCount(fn: (r) => r._value > 10)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                                             | tag | _value | stateCount |
| :------------------------------------------------ | :-- | -----: | ---------: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | t1  |     -2 |         -1 |
| {{% nowrap %}}2021-01-01T00:00:10Z{{% /nowrap %}} | t1  |     10 |         -1 |
| {{% nowrap %}}2021-01-01T00:00:20Z{{% /nowrap %}} | t1  |      7 |         -1 |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t1  |     17 |          1 |
| {{% nowrap %}}2021-01-01T00:00:40Z{{% /nowrap %}} | t1  |     15 |          2 |
| {{% nowrap %}}2021-01-01T00:00:50Z{{% /nowrap %}} | t1  |      4 |         -1 |

| _time                                             | tag | _value | stateCount |
| :------------------------------------------------ | :-- | -----: | ---------: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | t2  |     19 |          1 |
| {{% nowrap %}}2021-01-01T00:00:10Z{{% /nowrap %}} | t2  |      4 |         -1 |
| {{% nowrap %}}2021-01-01T00:00:20Z{{% /nowrap %}} | t2  |     -3 |         -1 |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t2  |     19 |          1 |
| {{% nowrap %}}2021-01-01T00:00:40Z{{% /nowrap %}} | t2  |     13 |          2 |
| {{% nowrap %}}2021-01-01T00:00:50Z{{% /nowrap %}} | t2  |      1 |         -1 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
