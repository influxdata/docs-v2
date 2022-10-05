---
title: union() function
description: >
  `union()` merges two or more input streams into a single output stream.
menu:
  flux_0_x_ref:
    name: union
    parent: universe
    identifier: universe/union
weight: 101
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2738-L2738

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`union()` merges two or more input streams into a single output stream.

The output schemas of `union()` is the union of all input schemas.
`union()` does not preserve the sort order of the rows within tables.
Use `sort()` if you need a specific sort order.

### Union vs join
`union()` does not modify data in rows, but unions separate streams of tables
into a single stream of tables and groups rows of data based on existing group keys.
`join()` creates new rows based on common values in one or more specified columns.
Output rows also contain the differing values from each of the joined streams.

##### Function type signature

```js
(tables: [stream[A]]) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### tables
({{< req >}})
List of two or more streams of tables to union together.




## Examples

- [Union two streams of tables with unique group keys](#union-two-streams-of-tables-with-unique-group-keys)
- [Union two streams of tables with empty group keys](#union-two-streams-of-tables-with-empty-group-keys)

### Union two streams of tables with unique group keys

```js
import "generate"

t1 =
    generate.from(
        count: 4,
        fn: (n) => n + 1,
        start: 2022-01-01T00:00:00Z,
        stop: 2022-01-05T00:00:00Z,
    )
        |> set(key: "tag", value: "foo")
        |> group(columns: ["tag"])

t2 =
    generate.from(
        count: 4,
        fn: (n) => n * (-1),
        start: 2022-01-01T00:00:00Z,
        stop: 2022-01-05T00:00:00Z,
    )
        |> set(key: "tag", value: "bar")
        |> group(columns: ["tag"])

union(tables: [t1, t2])

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2022-01-01T00:00:00Z | 0       | bar  |
| 2022-01-02T00:00:00Z | -1      | bar  |
| 2022-01-03T00:00:00Z | -2      | bar  |
| 2022-01-04T00:00:00Z | -3      | bar  |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2022-01-01T00:00:00Z | 1       | foo  |
| 2022-01-02T00:00:00Z | 2       | foo  |
| 2022-01-03T00:00:00Z | 3       | foo  |
| 2022-01-04T00:00:00Z | 4       | foo  |

{{% /expand %}}
{{< /expand-wrapper >}}

### Union two streams of tables with empty group keys

```js
import "generate"

t1 =
    generate.from(
        count: 4,
        fn: (n) => n + 1,
        start: 2021-01-01T00:00:00Z,
        stop: 2021-01-05T00:00:00Z,
    )
        |> set(key: "tag", value: "foo")
        |> group()

t2 =
    generate.from(
        count: 4,
        fn: (n) => n * (-1),
        start: 2021-01-01T00:00:00Z,
        stop: 2021-01-05T00:00:00Z,
    )
        |> set(key: "tag", value: "bar")
        |> group()

union(tables: [t1, t2])

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _time                | _value  | tag  |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 1       | foo  |
| 2021-01-02T00:00:00Z | 2       | foo  |
| 2021-01-03T00:00:00Z | 3       | foo  |
| 2021-01-04T00:00:00Z | 4       | foo  |
| 2021-01-01T00:00:00Z | 0       | bar  |
| 2021-01-02T00:00:00Z | -1      | bar  |
| 2021-01-03T00:00:00Z | -2      | bar  |
| 2021-01-04T00:00:00Z | -3      | bar  |

{{% /expand %}}
{{< /expand-wrapper >}}
