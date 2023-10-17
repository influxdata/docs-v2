---
title: join.tables() function
description: >
  `join.tables()` joins two input streams together using a specified method, predicate, and a function to join two corresponding records, one from each input stream.
menu:
  flux_v0_ref:
    name: join.tables
    parent: join
    identifier: join/tables
weight: 101
flux/v0.x/tags: [transformations]
introduced: 0.172.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/join/join.flux#L216-L226

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`join.tables()` joins two input streams together using a specified method, predicate, and a function to join two corresponding records, one from each input stream.

`join.tables()` only compares records with the same group key. Output tables have the same grouping as the input tables.

##### Function type signature

```js
(
    <-left: stream[A],
    as: (l: A, r: B) => C,
    method: string,
    on: (l: A, r: B) => bool,
    right: stream[B],
) => stream[C] where A: Record, B: Record, C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### left

Left input stream. Default is piped-forward data (`<-`).



### right
({{< req >}})
Right input stream.



### on
({{< req >}})
Function that takes a left and right record (`l`, and `r` respectively), and returns a boolean.

The body of the function must be a single boolean expression, consisting of one
or more equality comparisons between a property of `l` and a property of `r`,
each chained together by the `and` operator.

### as
({{< req >}})
Function that takes a left and a right record (`l` and `r` respectively), and returns a record.
The returned record is included in the final output.



### method
({{< req >}})
String that specifies the join method.

**Supported methods:**
- inner
- left
- right
- full


## Examples

- [Perform an inner join](#perform-an-inner-join)
- [Perform a left outer join](#perform-a-left-outer-join)
- [Perform a right outer join](#perform-a-right-outer-join)
- [Perform a full outer join](#perform-a-full-outer-join)

### Perform an inner join

```js
import "sampledata"
import "join"

ints = sampledata.int()
strings = sampledata.string()

join.tables(
    method: "inner",
    left: ints,
    right: strings,
    on: (l, r) => l._time == r._time,
    as: (l, r) => ({l with label: r._value}),
)

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _time                | _value  | label       | *tag |
| -------------------- | ------- | ----------- | ---- |
| 2021-01-01T00:00:00Z | -2      | smpl_g9qczs | t1   |
| 2021-01-01T00:00:10Z | 10      | smpl_0mgv9n | t1   |
| 2021-01-01T00:00:20Z | 7       | smpl_phw664 | t1   |
| 2021-01-01T00:00:30Z | 17      | smpl_guvzy4 | t1   |
| 2021-01-01T00:00:40Z | 15      | smpl_5v3cce | t1   |
| 2021-01-01T00:00:50Z | 4       | smpl_s9fmgy | t1   |

| _time                | _value  | label       | *tag |
| -------------------- | ------- | ----------- | ---- |
| 2021-01-01T00:00:00Z | 19      | smpl_b5eida | t2   |
| 2021-01-01T00:00:10Z | 4       | smpl_eu4oxp | t2   |
| 2021-01-01T00:00:20Z | -3      | smpl_5g7tz4 | t2   |
| 2021-01-01T00:00:30Z | 19      | smpl_sox1ut | t2   |
| 2021-01-01T00:00:40Z | 13      | smpl_wfm757 | t2   |
| 2021-01-01T00:00:50Z | 1       | smpl_dtn2bv | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Perform a left outer join

If the join method is anything other than `inner`, pay special attention to how
the output record is constructed in the `as` function.

Because of how flux handles outer joins, it's possible for either `l` or `r` to be a
default record. This means any value in a non-group-key column could be null.

For more information about the behavior of outer joins, see the [Outer joins](/flux/v0/stdlib/join/#outer-joins)
section in the `join` package documentation.

In the case of a left outer join, `l` is guaranteed to not be a default record. To
ensure that the output record has non-null values for any columns that aren't part
of the group key, use values from `l`. Using a non-group-key value from `r` risks
that value being null.

The example below constructs the output record almost entirely from properties of `l`.
The only exception is the `v_right` column which gets its value from `r._value`.
In this case, understand and expect that `v_right` will sometimes be null.

```js
import "array"
import "join"

left =
    array.from(
        rows: [
            {_time: 2022-01-01T00:00:00Z, _value: 1, label: "a"},
            {_time: 2022-01-01T00:00:00Z, _value: 2, label: "b"},
            {_time: 2022-01-01T00:00:00Z, _value: 3, label: "d"},
        ],
    )
right =
    array.from(
        rows: [
            {_time: 2022-01-01T00:00:00Z, _value: 0.4, id: "a"},
            {_time: 2022-01-01T00:00:00Z, _value: 0.5, id: "c"},
            {_time: 2022-01-01T00:00:00Z, _value: 0.6, id: "d"},
        ],
    )

join.tables(
    method: "left",
    left: left,
    right: right,
    on: (l, r) => l.label == r.id and l._time == r._time,
    as: (l, r) => ({_time: l._time, label: l.label, v_left: l._value, v_right: r._value}),
)

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _time                | label  | v_left  | v_right  |
| -------------------- | ------ | ------- | -------- |
| 2022-01-01T00:00:00Z | a      | 1       | 0.4      |
| 2022-01-01T00:00:00Z | b      | 2       |          |
| 2022-01-01T00:00:00Z | d      | 3       | 0.6      |

{{% /expand %}}
{{< /expand-wrapper >}}

### Perform a right outer join

The next example is nearly identical to the [previous example](#perform-a-left-outer-join),
but uses the `right` join method. With this method, `r` is guaranteed to not be a default
record, but `l` may be a default record. Because `l` is more likely to contain null values,
the output record is built almost entirely from proprties of `r`, with the exception of
`v_left`, which we expect to sometimes be null.

```js
import "array"
import "join"

left =
    array.from(
        rows: [
            {_time: 2022-01-01T00:00:00Z, _value: 1, label: "a"},
            {_time: 2022-01-01T00:00:00Z, _value: 2, label: "b"},
            {_time: 2022-01-01T00:00:00Z, _value: 3, label: "d"},
        ],
    )
right =
    array.from(
        rows: [
            {_time: 2022-01-01T00:00:00Z, _value: 0.4, id: "a"},
            {_time: 2022-01-01T00:00:00Z, _value: 0.5, id: "c"},
            {_time: 2022-01-01T00:00:00Z, _value: 0.6, id: "d"},
        ],
    )

join.tables(
    method: "right",
    left: left,
    right: right,
    on: (l, r) => l.label == r.id and l._time == r._time,
    as: (l, r) => ({_time: r._time, label: r.id, v_left: l._value, v_right: r._value}),
)

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _time                | label  | v_left  | v_right  |
| -------------------- | ------ | ------- | -------- |
| 2022-01-01T00:00:00Z | a      | 1       | 0.4      |
| 2022-01-01T00:00:00Z | c      |         | 0.5      |
| 2022-01-01T00:00:00Z | d      | 3       | 0.6      |

{{% /expand %}}
{{< /expand-wrapper >}}

### Perform a full outer join

In a full outer join, there are no guarantees about `l` or `r`. Either one of them could
be a default record, but they will never both be a default record at the same time.

To get non-null values for the output record, check both `l` and `r` to see which contains
the desired values.

The example below defines a function for the `as` parameter that appropriately handles
the uncertainty of a full outer join.

`v_left` and `v_right` still use values from `l` and `r` directly, because we expect
them to sometimes be null in the output table.

```js
import "array"
import "join"

left =
    array.from(
        rows: [
            {_time: 2022-01-01T00:00:00Z, _value: 1, label: "a"},
            {_time: 2022-01-01T00:00:00Z, _value: 2, label: "b"},
            {_time: 2022-01-01T00:00:00Z, _value: 3, label: "d"},
        ],
    )
right =
    array.from(
        rows: [
            {_time: 2022-01-01T00:00:00Z, _value: 0.4, id: "a"},
            {_time: 2022-01-01T00:00:00Z, _value: 0.5, id: "c"},
            {_time: 2022-01-01T00:00:00Z, _value: 0.6, id: "d"},
        ],
    )

join.tables(
    method: "full",
    left: left,
    right: right,
    on: (l, r) => l.label == r.id and l._time == r._time,
    as: (l, r) => {
        time = if exists l._time then l._time else r._time
        label = if exists l.label then l.label else r.id

        return {_time: time, label: label, v_left: l._value, v_right: r._value}
    },
)

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _time                | label  | v_left  | v_right  |
| -------------------- | ------ | ------- | -------- |
| 2022-01-01T00:00:00Z | a      | 1       | 0.4      |
| 2022-01-01T00:00:00Z | b      | 2       |          |
| 2022-01-01T00:00:00Z | c      |         | 0.5      |
| 2022-01-01T00:00:00Z | d      | 3       | 0.6      |

{{% /expand %}}
{{< /expand-wrapper >}}
