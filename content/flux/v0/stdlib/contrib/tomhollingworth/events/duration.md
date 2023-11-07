---
title: events.duration() function
description: >
  `events.duration()` calculates the duration of events.
menu:
  flux_v0_ref:
    name: events.duration
    parent: contrib/tomhollingworth/events
    identifier: contrib/tomhollingworth/events/duration
weight: 301
flux/v0/tags: [transformations, events]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/tomhollingworth/events/duration.flux#L101-L111

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`events.duration()` calculates the duration of events.

The function determines the time between a record and the subsequent record
and associates the duration with the first record (start of the event).
To calculate the duration of the last event,
the function compares the timestamp of the final record
to the timestamp in the `stopColumn` or the specified stop time.

### Similar functions
`events.duration()` is similar to `elapsed()` and `stateDuration()`, but differs in important ways:

- `elapsed()` drops the first record. `events.duration()` does not.
- `stateDuration()` calculates the total time spent in a state (determined by a predicate function).
  `events.duration()` returns the duration between all records and their subsequent records.

See the example [below](#compared-to-similar-functions).

##### Function type signature

```js
(
    <-tables: stream[A],
    ?columnName: string,
    ?stop: time,
    ?stopColumn: string,
    ?timeColumn: string,
    ?unit: duration,
) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### unit

Duration unit of the calculated state duration.
Default is `1ns`.



### columnName

Name of the result column.
Default is `"duration"`.



### timeColumn

Name of the time column.
Default is `"_time"`.



### stopColumn

Name of the stop column.
Default is `"_stop"`.



### stop

The latest time to use when calculating results.

If provided, `stop` overrides the time value in the `stopColumn`.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Calculate the duration of states](#calculate-the-duration-of-states)
- [Compared to similar functions](#compared-to-similar-functions)

### Calculate the duration of states

```js
import "array"
import "contrib/tomhollingworth/events"

data
    |> events.duration(unit: 1m, stop: 2020-01-02T00:00:00Z)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | state  |
| -------------------- | ------ |
| 2020-01-01T00:00:00Z | ok     |
| 2020-01-01T00:12:34Z | warn   |
| 2020-01-01T00:25:01Z | ok     |
| 2020-01-01T16:07:55Z | crit   |
| 2020-01-01T16:54:21Z | warn   |
| 2020-01-01T18:20:45Z | ok     |


#### Output data

| _time                | state  | duration  |
| -------------------- | ------ | --------- |
| 2020-01-01T00:00:00Z | ok     | 12        |
| 2020-01-01T00:12:34Z | warn   | 12        |
| 2020-01-01T00:25:01Z | ok     | 942       |
| 2020-01-01T16:07:55Z | crit   | 46        |
| 2020-01-01T16:54:21Z | warn   | 86        |
| 2020-01-01T18:20:45Z | ok     | 339       |

{{% /expand %}}
{{< /expand-wrapper >}}

### Compared to similar functions

The example below includes output values of
`events.duration()`, `elapsed()`, and `stateDuration()`
related to the `_time` and `state` values of input data.

```js
import "array"
import "contrib/tomhollingworth/events"

union(
    tables: [
        data
            |> events.duration(unit: 1m, stop: 2020-01-02T00:00:00Z)
            |> map(
                fn: (r) =>
                    ({
                        _time: r._time,
                        state: r.state,
                        function: "events.Duration()",
                        value: r.duration,
                    }),
            ),
        data
            |> elapsed(unit: 1m)
            |> map(
                fn: (r) =>
                    ({_time: r._time, state: r.state, function: "elapsed()", value: r.elapsed}),
            ),
        data
            |> stateDuration(unit: 1m, fn: (r) => true)
            |> map(
                fn: (r) =>
                    ({
                        _time: r._time,
                        state: r.state,
                        function: "stateDuration()",
                        value: r.stateDuration,
                    }),
            ),
    ],
)
    |> pivot(rowKey: ["_time", "state"], columnKey: ["function"], valueColumn: "value")

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _time                | state  | events.Duration()  | elapsed()  | stateDuration()  |
| -------------------- | ------ | ------------------ | ---------- | ---------------- |
| 2020-01-01T00:00:00Z | ok     | 12                 |            | 0                |
| 2020-01-01T00:12:34Z | warn   | 12                 | 12         | 12               |
| 2020-01-01T00:25:01Z | ok     | 942                | 12         | 25               |
| 2020-01-01T16:07:55Z | crit   | 46                 | 942        | 967              |
| 2020-01-01T16:54:21Z | warn   | 86                 | 46         | 1014             |
| 2020-01-01T18:20:45Z | ok     | 339                | 86         | 1100             |

{{% /expand %}}
{{< /expand-wrapper >}}
