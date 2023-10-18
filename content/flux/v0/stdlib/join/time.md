---
title: join.time() function
description: >
  `join.time()` joins two table streams together exclusively on the `_time` column.
menu:
  flux_v0_ref:
    name: join.time
    parent: join
    identifier: join/time
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

https://github.com/influxdata/flux/blob/master/stdlib/join/join.flux#L265-L272

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`join.time()` joins two table streams together exclusively on the `_time` column.

This function calls `join.tables()` with the `on` parameter set to `(l, r) => l._time == r._time`.

##### Function type signature

```js
(
    <-left: stream[{A with _time: B}],
    as: (l: {A with _time: B}, r: {C with _time: D}) => E,
    right: stream[{C with _time: D}],
    ?method: string,
) => stream[E] where B: Equatable, D: Equatable, E: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### left

Left input stream. Default is piped-forward data (<-).



### right
({{< req >}})
Right input stream.



### as
({{< req >}})
Function that takes a left and a right record (`l` and `r` respectively), and returns a record.
The returned record is included in the final output.



### method

String that specifies the join method. Default is `inner`.

**Supported methods:**
- inner
- left
- right
- full


## Examples

### Join two tables by timestamp

```js
import "sampledata"
import "join"

ints = sampledata.int()
strings = sampledata.string()

join.time(left: ints, right: strings, as: (l, r) => ({l with label: r._value}))

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
