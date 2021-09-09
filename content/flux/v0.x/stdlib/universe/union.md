---
title: union() function
description: The `union()` function concatenates two or more input streams into a single output stream.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/union
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/union/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/union/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/union/
menu:
  flux_0_x_ref:
    name: union
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /flux/v0.x/stdlib/universe/join/
introduced: 0.7.0
---

The `union()` function concatenates two or more input streams into a single output stream.
In tables that have identical schemas and group keys, contents of the tables will be concatenated in the output stream.
The output schemas of the `union()` function is the union of all input schemas.

`union()` does not preserve the sort order of the rows within tables.
A sort operation may be added if a specific sort order is needed.

```js
union(tables: [table1, table2])
```

## Parameters

### tables {data-type="array of streams"}
Specifies the streams to union together.
There must be at least two streams.

## Examples
The following examples use [`generate.from()`](/flux/v0.x/stdlib/generate/from/)
to illustrate how `union()` transforms data.

- [Union two streams of tables with unique group keys](#union-two-streams-of-tables-with-unique-group-keys)
- [Union two streams of tables with empty group keys](#union-two-streams-of-tables-with-empty-group-keys)

### Union two streams of tables with unique group keys
```js
import "generate"

t1 = generate.from(count: 4, fn: (n) => n + 1, start: 2021-01-01T00:00:00Z, stop: 2021-01-05T00:00:00Z)
  |> set(key: "tag", value: "foo")
  |> group(columns: ["tag"])

t2 = generate.from(count: 4, fn: (n) => n * -1, start: 2021-01-01T00:00:00Z, stop: 2021-01-05T00:00:00Z)
  |> set(key: "tag", value: "bar")
  |> group(columns: ["tag"])

union(tables: [t1, t2])
```

{{< expand-wrapper >}}
{{% expand "View input and output streams" %}}
#### Input data streams

{{< flex >}}
{{% flex-content %}}

##### t1

{{< flux/group-key "[tag: \"foo\"]">}}

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | foo |      1 |
| 2021-01-02T00:00:00Z | foo |      2 |
| 2021-01-03T00:00:00Z | foo |      3 |
| 2021-01-04T00:00:00Z | foo |      4 |

{{% /flex-content %}}
{{% flex-content %}}

##### t2

{{< flux/group-key "[tag: \"bar\"]">}}

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | bar |      0 |
| 2021-01-02T00:00:00Z | bar |     -1 |
| 2021-01-03T00:00:00Z | bar |     -2 |
| 2021-01-04T00:00:00Z | bar |     -3 |

{{% /flex-content %}}
{{< /flex >}}

#### Output data stream
{{% caption %}}
A single stream of tables
{{% /caption %}}

{{< flex >}}
{{% flex-content %}}

{{< flux/group-key "[tag: \"foo\"]">}}

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | foo |      1 |
| 2021-01-02T00:00:00Z | foo |      2 |
| 2021-01-03T00:00:00Z | foo |      3 |
| 2021-01-04T00:00:00Z | foo |      4 |

{{% /flex-content %}}
{{% flex-content %}}

{{< flux/group-key "[tag: \"bar\"]">}}

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | bar |      0 |
| 2021-01-02T00:00:00Z | bar |     -1 |
| 2021-01-03T00:00:00Z | bar |     -2 |
| 2021-01-04T00:00:00Z | bar |     -3 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

### Union two streams of tables with empty group keys
```js
import "generate"

t1 = generate.from(count: 4, fn: (n) => n + 1, start: 2021-01-01T00:00:00Z, stop: 2021-01-05T00:00:00Z)
  |> set(key: "tag", value: "foo")
  |> group()

t2 = generate.from(count: 4, fn: (n) => n * -1, start: 2021-01-01T00:00:00Z, stop: 2021-01-05T00:00:00Z)
  |> set(key: "tag", value: "bar")
  |> group()

union(tables: [t1, t2])
```

{{< expand-wrapper >}}
{{% expand "View input and output streams" %}}
#### Input data streams

{{< flex >}}
{{% flex-content %}}

##### t1

{{< flux/group-key "[]">}}

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | foo |      1 |
| 2021-01-02T00:00:00Z | foo |      2 |
| 2021-01-03T00:00:00Z | foo |      3 |
| 2021-01-04T00:00:00Z | foo |      4 |

{{% /flex-content %}}
{{% flex-content %}}

##### t2

{{< flux/group-key "[]">}}

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | bar |      0 |
| 2021-01-02T00:00:00Z | bar |     -1 |
| 2021-01-03T00:00:00Z | bar |     -2 |
| 2021-01-04T00:00:00Z | bar |     -3 |

{{% /flex-content %}}
{{< /flex >}}

#### Output data stream

{{< flux/group-key "[]">}}

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | foo |      1 |
| 2021-01-02T00:00:00Z | foo |      2 |
| 2021-01-03T00:00:00Z | foo |      3 |
| 2021-01-04T00:00:00Z | foo |      4 |
| 2021-01-01T00:00:00Z | bar |      0 |
| 2021-01-02T00:00:00Z | bar |     -1 |
| 2021-01-03T00:00:00Z | bar |     -2 |
| 2021-01-04T00:00:00Z | bar |     -3 |
{{% /expand %}}
{{< /expand-wrapper >}}

## union() versus join()
`union()` merges separate streams of tables into a single stream of tables and
groups rows of data based on existing [group keys](/flux/v0.x/get-started/data-model/#group-key).
`union()` does not modify individual rows of data.
`join()` creates new rows based on common values in one or more specified columns.
Output rows also contain the differing values from each of the joined streams.

{{% expand "View union() vs join() example" %}}
Given two streams of tables, `t1` and `t2`, the results of `union()` and `join()`
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
{{% /expand %}}
