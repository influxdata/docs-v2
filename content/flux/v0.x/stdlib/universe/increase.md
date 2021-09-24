---
title: increase() function
description: >
  The `increase()` function calculates the cumulative sum of **non-negative** differences
  between subsequent values.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/increase
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/increase/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/increase/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/increase/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/increase/
menu:
  flux_0_x_ref:
    name: increase
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/increase/
introduced: 0.71.0
---

The `increase()` function calculates the cumulative sum of **non-negative** differences
between subsequent values.
A main use case is tracking changes in counter values which may wrap over time
when they hit a threshold or are reset.
In the case of a wrap/reset, we can assume that the absolute delta between two
points will be at least their non-negative difference.

_**Output data type:** Float_

```js
increase(columns: ["_value"])
```

## Parameters

### columns {data-type="array of strings"}
Columns to use in the operation.
Default is `["_value"]`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Output tables
For each input table with `n` rows, `derivative()` outputs a table with `n - 1` rows.

## Examples

{{% flux/sample-example-intro %}}

```js
import "sampledata"

sampledata.int()
  |> increase()
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
| 2021-01-01T00:00:10Z | t1  |     12 |
| 2021-01-01T00:00:20Z | t1  |     12 |
| 2021-01-01T00:00:30Z | t1  |     22 |
| 2021-01-01T00:00:40Z | t1  |     22 |
| 2021-01-01T00:00:50Z | t1  |     22 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:10Z | t2  |      0 |
| 2021-01-01T00:00:20Z | t2  |      0 |
| 2021-01-01T00:00:30Z | t2  |     22 |
| 2021-01-01T00:00:40Z | t2  |     22 |
| 2021-01-01T00:00:50Z | t2  |     22 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

## Function definition
```js
increase = (tables=<-, column="_value") =>
  tables
    |> difference(nonNegative: true, column:column)
    |> cumulativeSum()
```
