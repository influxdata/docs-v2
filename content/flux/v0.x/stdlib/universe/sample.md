---
title: sample() function
description: The `sample()` function selects a subset of the records from the input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/sample
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/sample/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/sample/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/sample/
menu:
  flux_0_x_ref:
    name: sample
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#sample, InfluxQL – SAMPLE()
introduced: 0.7.0
---

The `sample()` function selects a subset of the records from the input table.

```js
sample(n:5, pos: -1)
```

{{% warn %}}
#### Empty tables
`sample()` drops empty tables.
{{% /warn %}}

## Parameters

### n {data-type="int"}
({{< req >}})
Sample every Nth element.

### pos {data-type="int"}
Position offset from the start of results where sampling begins.
`pos` must be less than `n`.
If `pos` is less than 0, a random offset is used.
Default is `-1` (random offset).

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

```js
import "sampledata"

sampledata.int()
  |> sample(n: 2, pos: 1)
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
| 2021-01-01T00:00:10Z | t1  |     10 |
| 2021-01-01T00:00:30Z | t1  |     17 |
| 2021-01-01T00:00:50Z | t1  |      4 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:10Z | t2  |      4 |
| 2021-01-01T00:00:30Z | t2  |     19 |
| 2021-01-01T00:00:50Z | t2  |      1 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
