---
title: stateCount() function
description: >
  `stateCount()` returns the number of consecutive rows in a given state.
menu:
  flux_v0_ref:
    name: stateCount
    parent: universe
    identifier: universe/stateCount
weight: 101
flux/v0/tags: [transformations]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L4026-L4028

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`stateCount()` returns the number of consecutive rows in a given state.

The state is defined by the `fn` predicate function. For each consecutive
record that evaluates to `true`, the state count is incremented. When a record
evaluates to `false`, the value is set to `-1` and the state count is reset.
If the record generates an error during evaluation, the point is discarded,
and does not affect the state count.
The state count is added as an additional column to each record.

##### Function type signature

```js
(<-tables: stream[A], fn: (r: A) => bool, ?column: string) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### fn
({{< req >}})
Predicate function that identifies the state of a record.



### column

Column to store the state count in. Default is `stateCount`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Count the number rows in a specific state

```js
import "sampledata"

sampledata.int()
    |> stateCount(fn: (r) => r._value < 10)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time                | _value  | *tag | stateCount  |
| -------------------- | ------- | ---- | ----------- |
| 2021-01-01T00:00:00Z | -2      | t1   | 1           |
| 2021-01-01T00:00:10Z | 10      | t1   | -1          |
| 2021-01-01T00:00:20Z | 7       | t1   | 1           |
| 2021-01-01T00:00:30Z | 17      | t1   | -1          |
| 2021-01-01T00:00:40Z | 15      | t1   | -1          |
| 2021-01-01T00:00:50Z | 4       | t1   | 1           |

| _time                | _value  | *tag | stateCount  |
| -------------------- | ------- | ---- | ----------- |
| 2021-01-01T00:00:00Z | 19      | t2   | -1          |
| 2021-01-01T00:00:10Z | 4       | t2   | 1           |
| 2021-01-01T00:00:20Z | -3      | t2   | 2           |
| 2021-01-01T00:00:30Z | 19      | t2   | -1          |
| 2021-01-01T00:00:40Z | 13      | t2   | -1          |
| 2021-01-01T00:00:50Z | 1       | t2   | 1           |

{{% /expand %}}
{{< /expand-wrapper >}}
