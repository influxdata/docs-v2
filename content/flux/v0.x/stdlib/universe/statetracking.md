---
title: stateTracking() function
description: >
  `stateTracking()` returns the cumulative count and duration of consecutive
  rows that match a predicate function that defines a state.
menu:
  flux_0_x_ref:
    name: stateTracking
    parent: universe
    identifier: universe/stateTracking
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2482-L2492

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`stateTracking()` returns the cumulative count and duration of consecutive
rows that match a predicate function that defines a state.

To return the cumulative count of consecutive rows that match the predicate,
include the `countColumn` parameter.
To return the cumulative duration of consecutive rows that match the predicate,
include the `durationColumn` parameter.
Rows that do not match the predicate function `fn` return `-1` in the count
and duration columns.

##### Function type signature

```js
(
    <-tables: stream[A],
    fn: (r: A) => bool,
    ?countColumn: string,
    ?durationColumn: string,
    ?durationUnit: duration,
    ?timeColumn: string,
) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### fn
({{< req >}})
Predicate function to determine state.



### countColumn

Column to store state count in.

If not defined, `stateTracking()` does not return the state count.

### durationColumn

Column to store state duration in.

If not defined, `stateTracking()` does not return the state duration.

### durationUnit

Unit of time to report state duration in. Default is `1s`.



### timeColumn

Column with time values used to calculate state duration.
Default is `_time`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Return a cumulative state count](#return-a-cumulative-state-count)
- [Return a cumulative state duration in milliseconds](#return-a-cumulative-state-duration-in-milliseconds)
- [Return a cumulative state count and duration](#return-a-cumulative-state-count-and-duration)

### Return a cumulative state count

```js
data
    |> stateTracking(fn: (r) => r.state == "crit", countColumn: "count")
```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

#### Input data

| _time                | _value  | state  | *tag |
| -------------------- | ------- | ------ | ---- |
| 2021-01-01T00:00:00Z | -2      | ok     | t1   |
| 2021-01-01T00:00:10Z | 10      | crit   | t1   |
| 2021-01-01T00:00:20Z | 7       | crit   | t1   |
| 2021-01-01T00:00:30Z | 17      | crit   | t1   |
| 2021-01-01T00:00:40Z | 15      | crit   | t1   |
| 2021-01-01T00:00:50Z | 4       | ok     | t1   |

| _time                | _value  | state  | *tag |
| -------------------- | ------- | ------ | ---- |
| 2021-01-01T00:00:00Z | 19      | crit   | t2   |
| 2021-01-01T00:00:10Z | 4       | ok     | t2   |
| 2021-01-01T00:00:20Z | -3      | ok     | t2   |
| 2021-01-01T00:00:30Z | 19      | crit   | t2   |
| 2021-01-01T00:00:40Z | 13      | crit   | t2   |
| 2021-01-01T00:00:50Z | 1       | ok     | t2   |


#### Output data

| _time                | _value  | state  | *tag | count  |
| -------------------- | ------- | ------ | ---- | ------ |
| 2021-01-01T00:00:00Z | -2      | ok     | t1   | -1     |
| 2021-01-01T00:00:10Z | 10      | crit   | t1   | 1      |
| 2021-01-01T00:00:20Z | 7       | crit   | t1   | 2      |
| 2021-01-01T00:00:30Z | 17      | crit   | t1   | 3      |
| 2021-01-01T00:00:40Z | 15      | crit   | t1   | 4      |
| 2021-01-01T00:00:50Z | 4       | ok     | t1   | -1     |

| _time                | _value  | state  | *tag | count  |
| -------------------- | ------- | ------ | ---- | ------ |
| 2021-01-01T00:00:00Z | 19      | crit   | t2   | 1      |
| 2021-01-01T00:00:10Z | 4       | ok     | t2   | -1     |
| 2021-01-01T00:00:20Z | -3      | ok     | t2   | -1     |
| 2021-01-01T00:00:30Z | 19      | crit   | t2   | 1      |
| 2021-01-01T00:00:40Z | 13      | crit   | t2   | 2      |
| 2021-01-01T00:00:50Z | 1       | ok     | t2   | -1     |

{{% /expand %}}
{{< /expand-wrapper >}}

### Return a cumulative state duration in milliseconds

```js
data
    |> stateTracking(fn: (r) => r.state == "crit", durationColumn: "duration", durationUnit: 1ms)
```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

#### Input data

| _time                | _value  | state  | *tag |
| -------------------- | ------- | ------ | ---- |
| 2021-01-01T00:00:00Z | -2      | ok     | t1   |
| 2021-01-01T00:00:10Z | 10      | crit   | t1   |
| 2021-01-01T00:00:20Z | 7       | crit   | t1   |
| 2021-01-01T00:00:30Z | 17      | crit   | t1   |
| 2021-01-01T00:00:40Z | 15      | crit   | t1   |
| 2021-01-01T00:00:50Z | 4       | ok     | t1   |

| _time                | _value  | state  | *tag |
| -------------------- | ------- | ------ | ---- |
| 2021-01-01T00:00:00Z | 19      | crit   | t2   |
| 2021-01-01T00:00:10Z | 4       | ok     | t2   |
| 2021-01-01T00:00:20Z | -3      | ok     | t2   |
| 2021-01-01T00:00:30Z | 19      | crit   | t2   |
| 2021-01-01T00:00:40Z | 13      | crit   | t2   |
| 2021-01-01T00:00:50Z | 1       | ok     | t2   |


#### Output data

| _time                | _value  | state  | *tag | duration  |
| -------------------- | ------- | ------ | ---- | --------- |
| 2021-01-01T00:00:00Z | -2      | ok     | t1   | -1        |
| 2021-01-01T00:00:10Z | 10      | crit   | t1   | 0         |
| 2021-01-01T00:00:20Z | 7       | crit   | t1   | 10000     |
| 2021-01-01T00:00:30Z | 17      | crit   | t1   | 20000     |
| 2021-01-01T00:00:40Z | 15      | crit   | t1   | 30000     |
| 2021-01-01T00:00:50Z | 4       | ok     | t1   | -1        |

| _time                | _value  | state  | *tag | duration  |
| -------------------- | ------- | ------ | ---- | --------- |
| 2021-01-01T00:00:00Z | 19      | crit   | t2   | 0         |
| 2021-01-01T00:00:10Z | 4       | ok     | t2   | -1        |
| 2021-01-01T00:00:20Z | -3      | ok     | t2   | -1        |
| 2021-01-01T00:00:30Z | 19      | crit   | t2   | 0         |
| 2021-01-01T00:00:40Z | 13      | crit   | t2   | 10000     |
| 2021-01-01T00:00:50Z | 1       | ok     | t2   | -1        |

{{% /expand %}}
{{< /expand-wrapper >}}

### Return a cumulative state count and duration

```js
data
    |> stateTracking(fn: (r) => r.state == "crit", countColumn: "count", durationColumn: "duration")
```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

#### Input data

| _time                | _value  | state  | *tag |
| -------------------- | ------- | ------ | ---- |
| 2021-01-01T00:00:00Z | -2      | ok     | t1   |
| 2021-01-01T00:00:10Z | 10      | crit   | t1   |
| 2021-01-01T00:00:20Z | 7       | crit   | t1   |
| 2021-01-01T00:00:30Z | 17      | crit   | t1   |
| 2021-01-01T00:00:40Z | 15      | crit   | t1   |
| 2021-01-01T00:00:50Z | 4       | ok     | t1   |

| _time                | _value  | state  | *tag |
| -------------------- | ------- | ------ | ---- |
| 2021-01-01T00:00:00Z | 19      | crit   | t2   |
| 2021-01-01T00:00:10Z | 4       | ok     | t2   |
| 2021-01-01T00:00:20Z | -3      | ok     | t2   |
| 2021-01-01T00:00:30Z | 19      | crit   | t2   |
| 2021-01-01T00:00:40Z | 13      | crit   | t2   |
| 2021-01-01T00:00:50Z | 1       | ok     | t2   |


#### Output data

| _time                | _value  | state  | *tag | count  | duration  |
| -------------------- | ------- | ------ | ---- | ------ | --------- |
| 2021-01-01T00:00:00Z | -2      | ok     | t1   | -1     | -1        |
| 2021-01-01T00:00:10Z | 10      | crit   | t1   | 1      | 0         |
| 2021-01-01T00:00:20Z | 7       | crit   | t1   | 2      | 10        |
| 2021-01-01T00:00:30Z | 17      | crit   | t1   | 3      | 20        |
| 2021-01-01T00:00:40Z | 15      | crit   | t1   | 4      | 30        |
| 2021-01-01T00:00:50Z | 4       | ok     | t1   | -1     | -1        |

| _time                | _value  | state  | *tag | count  | duration  |
| -------------------- | ------- | ------ | ---- | ------ | --------- |
| 2021-01-01T00:00:00Z | 19      | crit   | t2   | 1      | 0         |
| 2021-01-01T00:00:10Z | 4       | ok     | t2   | -1     | -1        |
| 2021-01-01T00:00:20Z | -3      | ok     | t2   | -1     | -1        |
| 2021-01-01T00:00:30Z | 19      | crit   | t2   | 1      | 0         |
| 2021-01-01T00:00:40Z | 13      | crit   | t2   | 2      | 10        |
| 2021-01-01T00:00:50Z | 1       | ok     | t2   | -1     | -1        |

{{% /expand %}}
{{< /expand-wrapper >}}
