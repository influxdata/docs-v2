---
title: stateDuration() function
description: >
  `stateDuration()` returns the cumulative duration of a given state.
menu:
  flux_v0_ref:
    name: stateDuration
    parent: universe
    identifier: universe/stateDuration
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L4077-L4085

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`stateDuration()` returns the cumulative duration of a given state.

The state is defined by the `fn` predicate function. For each consecutive
record that evaluates to `true`, the state duration is incremented by the
duration of time between records using the specified `unit`. When a record
evaluates to `false`, the value is set to `-1` and the state duration is reset.
If the record generates an error during evaluation, the point is discarded,
and does not affect the state duration.

The state duration is added as an additional column to each record.
The duration is represented as an integer in the units specified.

**Note:** As the first point in the given state has no previous point, its
state duration will be 0.

##### Function type signature

```js
(
    <-tables: stream[A],
    fn: (r: A) => bool,
    ?column: string,
    ?timeColumn: string,
    ?unit: duration,
) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### fn
({{< req >}})
Predicate function that identifies the state of a record.



### column

Column to store the state duration in. Default is `stateDuration`.



### timeColumn

Time column to use to calculate elapsed time between rows.
Default is `_time`.



### unit

Unit of time to use to increment state duration. Default is `1s` (seconds).

**Example units:**
- 1ns (nanoseconds)
- 1us (microseconds)
- 1ms (milliseconds)
- 1s (seconds)
- 1m (minutes)
- 1h (hours)
- 1d (days)

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Return the time spent in a specified state

```js
import "sampledata"

sampledata.int()
    |> stateDuration(fn: (r) => r._value < 15)

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

| _time                | _value  | *tag | stateDuration  |
| -------------------- | ------- | ---- | -------------- |
| 2021-01-01T00:00:00Z | -2      | t1   | 0              |
| 2021-01-01T00:00:10Z | 10      | t1   | 10             |
| 2021-01-01T00:00:20Z | 7       | t1   | 20             |
| 2021-01-01T00:00:30Z | 17      | t1   | -1             |
| 2021-01-01T00:00:40Z | 15      | t1   | -1             |
| 2021-01-01T00:00:50Z | 4       | t1   | 0              |

| _time                | _value  | *tag | stateDuration  |
| -------------------- | ------- | ---- | -------------- |
| 2021-01-01T00:00:00Z | 19      | t2   | -1             |
| 2021-01-01T00:00:10Z | 4       | t2   | 0              |
| 2021-01-01T00:00:20Z | -3      | t2   | 10             |
| 2021-01-01T00:00:30Z | 19      | t2   | -1             |
| 2021-01-01T00:00:40Z | 13      | t2   | 0              |
| 2021-01-01T00:00:50Z | 1       | t2   | 10             |

{{% /expand %}}
{{< /expand-wrapper >}}
