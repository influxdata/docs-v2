---
title: lowestMin() function
description: The `lowestMin()` function selects the minimum record from each table in the input stream and returns the lowest `n` records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/lowestmin
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/lowestmin/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/lowestmin/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/lowestmin/
menu:
  flux_0_x_ref:
    name: lowestMin
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
introduced: 0.7.0
---

The `lowestMin()` function selects the minimum record from each table in the input stream and returns the lowest `n` records.
It outputs a single aggregated table containing `n` records.

```js
lowestMin(
  n:10,
  column: "_value",
  groupColumns: []
)
```

{{% warn %}}
#### Empty tables
`lowestMin()` drops empty tables.
{{% /warn %}}

## Parameters

### n {data-type="int"}
Number of records to return.

### column {data-type="string"}
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
  |> lowestMin(n: 2, groupColumns: ["tag"])
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
| 2021-01-01T00:00:20Z | t2  |     -3 |
| 2021-01-01T00:00:00Z | t1  |     -2 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
