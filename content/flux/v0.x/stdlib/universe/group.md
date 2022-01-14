---
title: group() function
description: The `group()` function groups records based on their values for specific columns.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/group
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/group/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/group/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/group/
menu:
  flux_0_x_ref:
    name: group
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /flux/v0.x/get-started/data-model/#restructure-tables, Data model - Restructure tables
  - /{{< latest "influxdb" >}}/query-data/flux/group-data/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-group-by-clause, InfluxQL – GROUP BY
introduced: 0.7.0
---

The `group()` function groups records based on their values for specific columns.
It produces tables with new group keys based on provided properties.
Specify an empty array of columns to ungroup data or merge all input tables into a single output table.

```js
group(columns: ["host", "_measurement"], mode:"by")

// OR

group(columns: ["_time"], mode:"except")

// OR

group()
```

_For more information about Flux table grouping, see
[Data model - Restructure tables](/flux/v0.x/get-started/data-model/#restructure-tables)_.

{{% warn %}}
#### Group does not guarantee sort order
`group()` does not guarantee the sort order of output records.
To ensure data is sorted correctly, use [`sort()`](/flux/v0.x/stdlib/universe/sort/)
after `group()`.

```js
data
  |> group()
  |> sort(columns: ["_time"])
```
{{% /warn %}}

## Parameters

### columns {data-type="array of strings"}
List of columns to use in the grouping operation.
Defaults to `[]`.

### mode {data-type="string"}
The mode used to group columns. Default is `"by"`.
The following modes are available:

- `by`: Groups records by columns defined in the [`columns`](#columns) parameter.
- `except`: Groups records by all columns **except** those defined in the [`columns`](#columns) parameter.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Group by specific columns](#group-by-specific-columns)
- [Group by everything except time](#group-by-everything-except-time)
- [Ungroup data](#ungroup-data)

#### Group by specific columns
```js
import "sampledata"

sampledata.int()
  |> group(columns: ["_time", "tag"])
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{< flux/group-key "[tag]" >}}

{{% flux/sample "int" %}}
{{% /flex-content %}}
{{% flex-content %}}

##### Output data
{{< flux/group-key "[_time, tag]" >}}

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t1  |     -2 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |     19 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:10Z | t1  |     10 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:10Z | t2  |      4 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:20Z | t1  |      7 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:20Z | t2  |     -3 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:30Z | t1  |     17 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:30Z | t2  |     19 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:40Z | t1  |     15 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:40Z | t2  |     13 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:50Z | t1  |      4 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:50Z | t2  |      1 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Group by everything except time
```js
import "sampledata"

sampledata.int()
  |> group(columns: ["_time"], mode: "except")
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{< flux/group-key "[tag]" >}}

{{% flux/sample "int" %}}
{{% /flex-content %}}
{{% flex-content %}}

##### Output data
{{< flux/group-key "[_value, tag]" >}}

| _value | tag | _time                |
| -----: | :-- | :------------------- |
|     -3 | t2  | 2021-01-01T00:00:20Z |

| _value | tag | _time                |
| -----: | :-- | :------------------- |
|     -2 | t1  | 2021-01-01T00:00:00Z |

| _value | tag | _time                |
| -----: | :-- | :------------------- |
|      1 | t2  | 2021-01-01T00:00:50Z |

| _value | tag | _time                |
| -----: | :-- | :------------------- |
|      4 | t1  | 2021-01-01T00:00:50Z |

| _value | tag | _time                |
| -----: | :-- | :------------------- |
|      4 | t2  | 2021-01-01T00:00:10Z |

| _value | tag | _time                |
| -----: | :-- | :------------------- |
|      7 | t1  | 2021-01-01T00:00:20Z |

| _value | tag | _time                |
| -----: | :-- | :------------------- |
|     10 | t1  | 2021-01-01T00:00:10Z |

| _value | tag | _time                |
| -----: | :-- | :------------------- |
|     13 | t2  | 2021-01-01T00:00:40Z |

| _value | tag | _time                |
| -----: | :-- | :------------------- |
|     15 | t1  | 2021-01-01T00:00:40Z |

| _value | tag | _time                |
| -----: | :-- | :------------------- |
|     17 | t1  | 2021-01-01T00:00:30Z |

| _value | tag | _time                |
| -----: | :-- | :------------------- |
|     19 | t2  | 2021-01-01T00:00:00Z |
|     19 | t2  | 2021-01-01T00:00:30Z |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Ungroup data

```js
import "sampledata"

// Merge all tables into a single table
sampledata.int()
  |> group()
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{< flux/group-key "[tag]" >}}

{{% flux/sample "int" %}}
{{% /flex-content %}}
{{% flex-content %}}

##### Output data
{{< flux/group-key "[]" >}}

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t1  |     -2 |
| 2021-01-01T00:00:10Z | t1  |     10 |
| 2021-01-01T00:00:20Z | t1  |      7 |
| 2021-01-01T00:00:30Z | t1  |     17 |
| 2021-01-01T00:00:40Z | t1  |     15 |
| 2021-01-01T00:00:50Z | t1  |      4 |
| 2021-01-01T00:00:00Z | t2  |     19 |
| 2021-01-01T00:00:10Z | t2  |      4 |
| 2021-01-01T00:00:20Z | t2  |     -3 |
| 2021-01-01T00:00:30Z | t2  |     19 |
| 2021-01-01T00:00:40Z | t2  |     13 |
| 2021-01-01T00:00:50Z | t2  |      1 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
