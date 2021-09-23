---
title: tail() function
description: The `tail()` function limits each output table to the last `n` records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/tail/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/tail/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/tail/
menu:
  flux_0_x_ref:
    name: tail
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /flux/v0.x/stdlib/universe/limit/
introduced: 0.39.0
---

The `tail()` function limits each output table to the last [`n`](#n) records.
The function produces one output table for each input table.
Each output table contains the last `n` records before the [`offset`](#offset).
If the input table has less than `offset + n` records, `tail()` outputs all records before the `offset`.

```js
tail(
  n:10,
  offset: 0
)
```

## Parameters

### n {data-type="int"}
({{< req >}})
The maximum number of records to output.

### offset {data-type="int"}
The number of records to skip at the end of a table table before limiting to `n`.
Default is `0`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

- [Output the last three rows in each input table](#output-the-last-three-rows-in-each-input-table)
- [Output the last three rows before the last row in each input table](#output-the-last-three-rows-before-the-last-row-in-each-input-table)

#### Output the last three rows in each input table
```js
import "sampledata"

sampledata.int()
  |> tail(n: 3)
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
| 2021-01-01T00:00:30Z | t1  |     17 |
| 2021-01-01T00:00:40Z | t1  |     15 |
| 2021-01-01T00:00:50Z | t1  |      4 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:30Z | t2  |     19 |
| 2021-01-01T00:00:40Z | t2  |     13 |
| 2021-01-01T00:00:50Z | t2  |      1 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Output the last three rows before the last row in each input table
```js
import "sampledata"

sampledata.int()
  |> tail(n: 3, offset: 1)
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
| 2021-01-01T00:00:20Z | t1  |      7 |
| 2021-01-01T00:00:30Z | t1  |     17 |
| 2021-01-01T00:00:40Z | t1  |     15 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:20Z | t2  |     -3 |
| 2021-01-01T00:00:30Z | t2  |     19 |
| 2021-01-01T00:00:40Z | t2  |     13 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
