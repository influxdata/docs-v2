---
title: join() function
description: >
  The `join()` function merges two input streams into a single output stream
  based on columns with equal values.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/join
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/join/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/join/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/join/
menu:
  flux_0_x_ref:
    name: join
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/join/
  - /flux/v0.x/stdlib/universe/union/
introduced: 0.7.0
---

The `join()` function merges two input streams into a single output stream
based on columns with equal values.
Null values are not considered equal when comparing column values.
The resulting schema is the union of the input schemas.
The resulting group key is the union of the input group keys.

```js
join(
  tables: {key1: table1, key2: table2},
  on: ["_time", "_field"],
  method: "inner"
)
```

#### Output schema
The column schema of the output stream is the union of the input schemas.
It is also the same for the output group key.
Columns are renamed using the pattern `<column>_<table>` to prevent ambiguity in joined tables.

##### Example:
If you have two streams of data, **data_1** and **data_2**, with the following group keys:

**data_1**: `[_time, _field]`  
**data_2**: `[_time, _field]`

And join them with:

```js
join(tables: {d1: data_1, d2: data_2}, on: ["_time"])
```

The resulting group keys for all tables will be: `[_time, _field_d1, _field_d2]`


## Parameters

### tables {data-type="record"}
({{< req >}})
Map of two streams to join.

{{% note %}}
`join()` currently only supports two input streams.
{{% /note %}}

### on {data-type="array of strings"}
({{< req >}})
List of columns to join on.

### method {data-type="string"}
Join method to use to join. Default is `"inner"`.

###### Possible Values:
- `inner`

<!--
- `cross`
- `left`
- `right`
- `full`

{{% note %}}
The `on` parameter and the `cross` method are mutually exclusive.
{{% /note %}}
-->

## Examples
The following example uses [`generate.from()`](/flux/v0.x/stdlib/generate/from/)
to illustrate how `join()` transforms data.

```js
import "generate"

t1 = generate.from(count: 4, fn: (n) => n + 1, start: 2021-01-01T00:00:00Z, stop: 2021-01-05T00:00:00Z)
  |> set(key: "tag", value: "foo")

t2 = generate.from(count: 4, fn: (n) => n * -1, start: 2021-01-01T00:00:00Z, stop: 2021-01-05T00:00:00Z)
  |> set(key: "tag", value: "foo")

join(
  tables: {t1: t1, t2: t2},
  on: ["_time", "tag"]
)
```

#### Input data streams

{{< flex >}}
{{% flex-content %}}

##### t1 

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | foo |      1 |
| 2021-01-02T00:00:00Z | foo |      2 |
| 2021-01-03T00:00:00Z | foo |      3 |
| 2021-01-04T00:00:00Z | foo |      4 |
{{% /flex-content %}}
{{% flex-content %}}
##### t2

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | foo |      0 |
| 2021-01-02T00:00:00Z | foo |     -1 |
| 2021-01-03T00:00:00Z | foo |     -2 |
| 2021-01-04T00:00:00Z | foo |     -3 |
{{% /flex-content %}}
{{< /flex >}}

#### Output data stream

| _time                | tag | _value_t1 | _value_t2 |
| :------------------- | :-- | --------: | --------: |
| 2021-01-01T00:00:00Z | foo |         1 |         0 |
| 2021-01-02T00:00:00Z | foo |         2 |        -1 |
| 2021-01-03T00:00:00Z | foo |         3 |        -2 |
| 2021-01-04T00:00:00Z | foo |         4 |        -3 |


### InfluxDB cross-measurement join
The following example shows how data in different InfluxDB measurements can be
joined with Flux.

```js
data_1 = from(bucket:"example-bucket")
  |> range(start:-15m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )

data_2 = from(bucket:"example-bucket")
  |> range(start:-15m)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )

join(
  tables: {d1: data_1, d2: data_2},
  on: ["_time", "host"]
)
```

## join() versus union()
`join()` creates new rows based on common values in one or more specified columns.
Output rows also contain the differing values from each of the joined streams.
`union()` does not modify data in rows, but unifies separate streams of tables
into a single stream of tables and groups rows of data based on existing
[group keys](/flux/v0.x/get-started/data-model/#group-key).

{{% expand "View join() vs union() example" %}}
Given two streams of tables, `t1` and `t2`, the results of `join()` and `union()`
are illustrated below:

#### Input streams

{{< flex >}}
{{% flex-content %}}

##### t1 

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | foo |      1 |
| 2021-01-02T00:00:00Z | foo |      2 |
| 2021-01-03T00:00:00Z | foo |      3 |
| 2021-01-04T00:00:00Z | foo |      4 |
{{% /flex-content %}}
{{% flex-content %}}
##### t2

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | foo |      0 |
| 2021-01-02T00:00:00Z | foo |     -1 |
| 2021-01-03T00:00:00Z | foo |     -2 |
| 2021-01-04T00:00:00Z | foo |     -3 |
{{% /flex-content %}}
{{< /flex >}}

#### join() output
```js
join(
  tables: {t1: t1, t2: t2}
  on: ["_time", "tag"]
)
```

| _time                | tag | _value_t1 | _value_t2 |
| :------------------- | :-- | --------: | --------: |
| 2021-01-01T00:00:00Z | foo |         1 |         0 |
| 2021-01-02T00:00:00Z | foo |         2 |        -1 |
| 2021-01-03T00:00:00Z | foo |         3 |        -2 |
| 2021-01-04T00:00:00Z | foo |         4 |        -3 |

#### union() output
```js
union(tables: [t1, t2])
```

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | foo |      0 |
| 2021-01-02T00:00:00Z | foo |     -1 |
| 2021-01-03T00:00:00Z | foo |     -2 |
| 2021-01-04T00:00:00Z | foo |     -3 |
| 2021-01-01T00:00:00Z | foo |      1 |
| 2021-01-02T00:00:00Z | foo |      2 |
| 2021-01-03T00:00:00Z | foo |      3 |
| 2021-01-04T00:00:00Z | foo |      4 |
{{% /expand %}}
