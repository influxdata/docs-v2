---
title: lowestAverage() function
description: The `lowestAverage()` function calculates the average of each table in the input stream returns the lowest `n` records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/lowestaverage
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/lowestaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/lowestaverage/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/lowestaverage/
menu:
  flux_0_x_ref:
    name: lowestAverage
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
introduced: 0.7.0
---

The `lowestAverage()` function calculates the average of each table in the input stream returns the lowest `n` records.
The function outputs a single aggregated table containing `n` records.
_`lowestAverage()` is a [selector function](/flux/v0.x/function-types/#selectors)._

```js
lowestAverage(
  n:10,
  column: "_value",
  groupColumns: []
)
```

{{% warn %}}
#### Empty tables
`lowestAverage()` drops empty tables.
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
  |> lowestAverage(n: 2, groupColumns: ["tag"])
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
| tag |            _value |
| :-- | ----------------: |
| t1  |               8.5 |
| t2  | 8.833333333333334 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
