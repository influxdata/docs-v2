---
title: map() function
description: The `map()` function applies a function to each record in the input tables.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/map
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/map/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/map/
menu:
  flux_0_x_ref:
    name: map
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/conditional-logic/
  - /{{< latest "influxdb" >}}/query-data/flux/mathematic-operations/
  - /flux/v0.x/stdlib/contrib/jsternberg/rows/map/
introduced: 0.7.0
---

The `map()` function applies a function to each record in the input tables.
The modified records are assigned to new tables based on the group key of the input table.
The output tables are the result of applying the map function to each record of the input tables.

When the output record contains a different value for the group key, the record is regrouped into the appropriate table.
When the output record drops a column that was part of the group key, that column is removed from the group key.

```js
map(fn: (r) => ({ _value: r._value * r._value }))
```

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

### fn {data-type="function"}

A single argument function to apply to each record.
The return value must be a record.

{{% note %}}
Records evaluated in `fn` functions are represented by `r`, short for "record" or "row".
{{% /note %}}

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Important notes

#### Preserve columns

By default, `map()` drops any columns that:

1. Are not part of the input table's group key.
2. Are not explicitly mapped in the `map()` function.

This often results in the `_time` column being dropped.
To preserve the `_time` column and other columns that do not meet the criteria above,
use the `with` operator to map values in the `r` record.
The `with` operator updates a column if it already exists,
creates a new column if it doesn't exist, and includes all existing columns in
the output table.

```js
map(fn: (r) => ({ r with newColumn: r._value * 2 }))
```

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Square the value in each row](#square-the-value-in-each-row)
- [Create a new table with new columns](#create-a-new-table-with-new-columns)
- [Add new columns and preserve existing columns](#add-new-columns-and-preserve-existing-columns)

#### Square the value in each row

```js
import "sampledata"

sampledata.int()
  |> map(fn: (r) => ({ r with _value: r._value * r._value }))
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
| 2021-01-01T00:00:00Z | t1  |      4 |
| 2021-01-01T00:00:10Z | t1  |    100 |
| 2021-01-01T00:00:20Z | t1  |     49 |
| 2021-01-01T00:00:30Z | t1  |    289 |
| 2021-01-01T00:00:40Z | t1  |    225 |
| 2021-01-01T00:00:50Z | t1  |     16 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |    361 |
| 2021-01-01T00:00:10Z | t2  |     16 |
| 2021-01-01T00:00:20Z | t2  |      9 |
| 2021-01-01T00:00:30Z | t2  |    361 |
| 2021-01-01T00:00:40Z | t2  |    169 |
| 2021-01-01T00:00:50Z | t2  |      1 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Create a new table with new columns

```js
import "sampledata"

sampledata.int()
  |> map(fn: (r) => ({
    time: r._time,
    source: r.tag,
    alert: if r._value > 10 then true else false
  }))
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
| time                 | source | alert |
| :------------------- | :----- | ----: |
| 2021-01-01T00:00:00Z | t1     | false |
| 2021-01-01T00:00:10Z | t1     | false |
| 2021-01-01T00:00:20Z | t1     | false |
| 2021-01-01T00:00:30Z | t1     |  true |
| 2021-01-01T00:00:40Z | t1     |  true |
| 2021-01-01T00:00:50Z | t1     | false |
| 2021-01-01T00:00:00Z | t2     |  true |
| 2021-01-01T00:00:10Z | t2     | false |
| 2021-01-01T00:00:20Z | t2     | false |
| 2021-01-01T00:00:30Z | t2     |  true |
| 2021-01-01T00:00:40Z | t2     |  true |
| 2021-01-01T00:00:50Z | t2     | false |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Add new columns and preserve existing columns
Use the `with` operator on the `r` record to preserve columns not directly
operated on by the map operation.

```js
import "sampledata"

sampledata.int()
  |> map(fn: (r) => ({
    r with
    server: "server-${r.tag}",
    valueFloat: float(v: r._value)
  }))
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
| _time                | tag | _value | server    | valueFloat |
| :------------------- | :-- | -----: | :-------- | ---------: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | t1  |     -2 | {{% nowrap %}}server-t1{{% /nowrap %}} |       -2.0 |
| {{% nowrap %}}2021-01-01T00:00:10Z{{% /nowrap %}} | t1  |     10 | {{% nowrap %}}server-t1{{% /nowrap %}} |       10.0 |
| {{% nowrap %}}2021-01-01T00:00:20Z{{% /nowrap %}} | t1  |      7 | {{% nowrap %}}server-t1{{% /nowrap %}} |        7.0 |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t1  |     17 | {{% nowrap %}}server-t1{{% /nowrap %}} |       17.0 |
| {{% nowrap %}}2021-01-01T00:00:40Z{{% /nowrap %}} | t1  |     15 | {{% nowrap %}}server-t1{{% /nowrap %}} |       15.0 |
| {{% nowrap %}}2021-01-01T00:00:50Z{{% /nowrap %}} | t1  |      4 | {{% nowrap %}}server-t1{{% /nowrap %}} |        4.0 |

| _time                | tag | _value | server    | valueFloat |
| :------------------- | :-- | -----: | :-------- | ---------: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | t2  |     19 | {{% nowrap %}}server-t2{{% /nowrap %}} |       19.0 |
| {{% nowrap %}}2021-01-01T00:00:10Z{{% /nowrap %}} | t2  |      4 | {{% nowrap %}}server-t2{{% /nowrap %}} |        4.0 |
| {{% nowrap %}}2021-01-01T00:00:20Z{{% /nowrap %}} | t2  |     -3 | {{% nowrap %}}server-t2{{% /nowrap %}} |       -3.0 |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t2  |     19 | {{% nowrap %}}server-t2{{% /nowrap %}} |       19.0 |
| {{% nowrap %}}2021-01-01T00:00:40Z{{% /nowrap %}} | t2  |     13 | {{% nowrap %}}server-t2{{% /nowrap %}} |       13.0 |
| {{% nowrap %}}2021-01-01T00:00:50Z{{% /nowrap %}} | t2  |      1 | {{% nowrap %}}server-t2{{% /nowrap %}} |        1.0 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

## Troubleshooting

### Map object property is not supported in a Flux table

Flux tables only support the following value types:

- float
- integer
- unsigned integer
- string
- boolean
- time

If `map()` returns a record with an unsupported type, Flux returns an error with
the name of the column that attempted to use the unsupported type.

If mapping a **duration** value, use [`time()`](/flux/v0.x/stdlib/universe/time/)
to convert it to a time value or [`int()`](/flux/v0.x/stdlib/universe/int/)
to convert it to an integer.
For the **bytes** type, use [`string()`](/flux/v0.x/stdlib/universe/string/) to convert the value to a string.

{{% note %}}
For information about supporting other data types in Flux tables, see the
following Github issues:

- [Add support for duration column value](https://github.com/influxdata/flux/issues/1803)
- [Add support for bytes column value](https://github.com/influxdata/flux/issues/1804)
{{% /note %}}
