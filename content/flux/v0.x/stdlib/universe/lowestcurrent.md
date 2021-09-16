---
title: lowestCurrent() function
description: The `lowestCurrent()` function selects the last record of each table in the input stream and returns the lowest `n` records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/lowestcurrent
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/lowestcurrent/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/lowestcurrent/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/lowestcurrent/
menu:
  flux_0_x_ref:
    name: lowestCurrent
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
introduced: 0.7.0
---

The `lowestCurrent()` function selects the last record of each table in the input stream and returns the lowest `n` records.
The function outputs a single aggregated table containing `n` records.
_`lowestCurrent()` is a [selector function](/flux/v0.x/function-types/#selectors)._

```js
lowestCurrent(
  n:10,
  column: "_value",
  groupColumns: []
)
```

{{% warn %}}
#### Empty tables
`lowestCurrent()` drops empty tables.
{{% /warn %}}

## Parameters

### n {data-type="int"}
Number of records to return.

### column {data-type="column"}
Column by which to sort.
Default is `"_value"`.

### groupColumns {data-type="array of strings"}
The columns on which to group before performing the aggregation.
Default is `[]`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

```js
import "sampledata"

sampledata.int()
  |> lowestCurrent(n: 2, groupColumns: ["tag"])
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
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:50Z | t2  |      1 |
| 2021-01-01T00:00:50Z | t1  |      4 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
