---
title: highestMax() function
description: The `highestMax()` function selects the maximum record from each table in the input stream and returns the top `n` records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/highestmax
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/highestmax/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/highestmax/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/highestmax/
menu:
  flux_0_x_ref:
    name: highestMax
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
introduced: 0.7.0
---

The `highestMax()` function selects the maximum record from each table in the input stream and returns the top `n` records.
The function outputs a single aggregated table containing `n` records.
_`highestMax()` is a [selector function](/flux/v0.x/function-types/#selectors)._

```js
highestMax(
  n:10,
  column: "_value",
  groupColumns: []
)
```

{{% warn %}}
#### Empty tables
`highestMax()` drops empty tables.
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
  |> highestMax(n: 2, groupColumns: ["tag"])
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
| 2021-01-01T00:00:00Z | t2  |     19 |
| 2021-01-01T00:00:30Z | t1  |     17 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
