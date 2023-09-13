---
title: join.right() function
description: >
  `join.right()` performs a right outer join on two table streams.
menu:
  flux_v0_ref:
    name: join.right
    parent: join
    identifier: join/right
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

https://github.com/influxdata/flux/blob/master/stdlib/join/join.flux#L528-L535

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`join.right()` performs a right outer join on two table streams.

The function calls `join.tables()` with the `method` parameter set to `"right"`.

##### Function type signature

```js
(<-left: stream[A], as: (l: A, r: B) => C, on: (l: A, r: B) => bool, right: stream[B]) => stream[C] where A: Record, B: Record, C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### left

Left input stream. Default is piped-forward data (<-).



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




## Examples

### Perform a right outer join

In a right outer join, `r` is guaranteed to not be a default record, but `l` may be a
default record. Because `l` is more likely to contain null values, the output record
is built almost entirely from proprties of `r`, with the exception of `v_left`, which
we expect to sometimes be null.

For more information about the behavior of outer joins, see the [Outer joins](/flux/v0/stdlib/join/#outer-joins)
section in the `join` package documentation.

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

join.right(
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
