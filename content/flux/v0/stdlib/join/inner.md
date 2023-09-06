---
title: join.inner() function
description: >
  `join.inner()` performs an inner join on two table streams.
menu:
  flux_v0_ref:
    name: join.inner
    parent: join
    identifier: join/inner
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

https://github.com/influxdata/flux/blob/master/stdlib/join/join.flux#L311-L318

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`join.inner()` performs an inner join on two table streams.

The function calls `join.tables()` with the `method` parameter set to `"inner"`.

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

### Perform an inner join

```js
import "sampledata"
import "join"

ints = sampledata.int()
strings = sampledata.string()

join.inner(
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
