---
title: top() function
description: The `top()` function sorts a table by columns and keeps only the top n records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/top
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/top/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/top/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/top/
menu:
  flux_0_x_ref:
    name: top
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
introduced: 0.7.0
---

The `top()` function sorts each input table by columns and keeps only the top `n` records.

```js
top(n:10, columns: ["_value"])
```

{{% warn %}}
#### Empty tables
`top()` drops empty tables.
{{% /warn %}}

## Parameters

### n {data-type="int"}
({{< req >}})
Number of records to return.

### columns {data-type="array of strings"}
List of columns to sort by.
Sort precedence is determined by list order (left to right).
Default is `["_value"]`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

##### Return rows with the top three values in each input table
```js
import "sampledata"

sampledata.int()
  |> top(n: 3)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "float" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:30Z | t1  |     17 |
| 2021-01-01T00:00:40Z | t1  |     15 |
| 2021-01-01T00:00:10Z | t1  |     10 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |     19 |
| 2021-01-01T00:00:30Z | t2  |     19 |
| 2021-01-01T00:00:40Z | t2  |     13 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
