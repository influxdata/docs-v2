---
title: sort() function
description: The `sort()` function orders the records within each table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/sort
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/sort/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/sort/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/sort/
menu:
  flux_0_x_ref:
    name: sort
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/sort-limit/
introduced: 0.7.0
---

The `sort()` function orders the records within each table.
One output table is produced for each input table.
The output tables will have the same schema as their corresponding input tables.

#### Sorting with null values
When sorting, `null` values will always be first.
When `desc: false`, nulls are less than every other value.
When `desc: true`, nulls are greater than every value.

```js
sort(columns: ["_value"], desc: false)
```

## Parameters

### columns {data-type="array of strings"}
List of columns by which to sort.
Sort precedence is determined by list order (left to right).
Default is `["_value"]`.

### desc {data-type="bool"}
Sort results in descending order.
Default is `false`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

- [Sort values in ascending order](#sort-values-in-ascending-order)
- [Sort values in descending order](#sort-values-in-descending-order)
- [Sort by multiple columns](#sort-by-multiple-columns)

#### Sort values in ascending order
```js
import "sampledata"

sampledata.int()
  |> sort()
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
| 2021-01-01T00:00:50Z | t1  |      4 |
| 2021-01-01T00:00:20Z | t1  |      7 |
| 2021-01-01T00:00:10Z | t1  |     10 |
| 2021-01-01T00:00:40Z | t1  |     15 |
| 2021-01-01T00:00:30Z | t1  |     17 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:20Z | t2  |     -3 |
| 2021-01-01T00:00:50Z | t2  |      1 |
| 2021-01-01T00:00:10Z | t2  |      4 |
| 2021-01-01T00:00:40Z | t2  |     13 |
| 2021-01-01T00:00:00Z | t2  |     19 |
| 2021-01-01T00:00:30Z | t2  |     19 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Sort values in descending order
```js
import "sampledata"

sampledata.int()
  |> sort(desc: true)
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
| 2021-01-01T00:00:10Z | t1  |     10 |
| 2021-01-01T00:00:20Z | t1  |      7 |
| 2021-01-01T00:00:50Z | t1  |      4 |
| 2021-01-01T00:00:00Z | t1  |     -2 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |     19 |
| 2021-01-01T00:00:30Z | t2  |     19 |
| 2021-01-01T00:00:40Z | t2  |     13 |
| 2021-01-01T00:00:10Z | t2  |      4 |
| 2021-01-01T00:00:50Z | t2  |      1 |
| 2021-01-01T00:00:20Z | t2  |     -3 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Sort by multiple columns
```js
import "sampledata"

sampledata.int()
  |> sort(columns: ["tag", "_value"])
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
| 2021-01-01T00:00:50Z | t1  |      4 |
| 2021-01-01T00:00:20Z | t1  |      7 |
| 2021-01-01T00:00:10Z | t1  |     10 |
| 2021-01-01T00:00:40Z | t1  |     15 |
| 2021-01-01T00:00:30Z | t1  |     17 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:20Z | t2  |     -3 |
| 2021-01-01T00:00:50Z | t2  |      1 |
| 2021-01-01T00:00:10Z | t2  |      4 |
| 2021-01-01T00:00:40Z | t2  |     13 |
| 2021-01-01T00:00:00Z | t2  |     19 |
| 2021-01-01T00:00:30Z | t2  |     19 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
