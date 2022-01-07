---
title: limit() function
description: The `limit()` function limits each output table to the first `n` records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/limit
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/limit/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/limit/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/limit/
menu:
  flux_0_x_ref:
    name: limit
    parent: universe
weight: 102
flux/v0.x/tags: [transformations, selectors]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/sort-limit/
  - /flux/v0.x/stdlib/universe/tail/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-limit-and-slimit-clauses, InfluxQL LIMIT
introduced: 0.7.0
---

The `limit()` function limits each output table to the first [`n`](#n) records.
The function produces one output table for each input table.
Each output table contains the first `n` records after the [`offset`](#offset).
If the input table has less than `offset + n` records, `limit()` outputs all records after the `offset`.
_`limit()` is a [selector function](/flux/v0.x/function-types/#selectors)._

```js
limit(
  n:10,
  offset: 0
)
```

## Parameters

### n {data-type="int"}
({{< req >}})
Maximum number of records to output.

### offset {data-type="int"}
Number of records to skip per table before limiting to `n`.
Default is `0`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Limit results to the first three rows in each table](#limit-results-to-the-first-three-rows-in-each-table)
- [Limit results to the first three rows in each input table after the first two](#limit-results-to-the-first-three-rows-in-each-input-table-after-the-first-two)

#### Limit results to the first three rows in each table
```js
import "sampledata"

sampledata.int()
  |> limit(n: 3)
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
| 2021-01-01T00:00:00Z | t1  |     -2 |
| 2021-01-01T00:00:10Z | t1  |     10 |
| 2021-01-01T00:00:20Z | t1  |      7 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |     19 |
| 2021-01-01T00:00:10Z | t2  |      4 |
| 2021-01-01T00:00:20Z | t2  |     -3 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Limit results to the first three rows in each input table after the first two
```js
import "sampledata"

sampledata.int()
  |> limit(n: 3, offset: 2)
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
