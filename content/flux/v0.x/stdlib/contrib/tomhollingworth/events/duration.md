---
title: events.duration() function
description: >
  The `events.duration()` function calculates the duration of events.
  The function determines the time between a record and the subsequent record and
  associates the duration with the first record (start of the event).
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/events/duration/
  - /influxdb/cloud/reference/flux/stdlib/contrib/events/duration/
menu:
  flux_0_x_ref:
    name: events.duration
    parent: tomhollingworth-events
weight: 301
flux/v0.x/tags: [functions, events, package]
related:
  - /flux/v0.x/stdlib/universe/elapsed/
  - /flux/v0.x/stdlib/universe/stateduration/
---

The `events.duration()` function calculates the duration of events.
The function determines the time between a record and the subsequent record and
associates the duration with the first record (start of the event).
To calculate the duration of the last event, the function compares the timestamp
of the final record to the timestamp in the [`stopColumn`](#stopcolumn) or the
specified [`stop`](#stop) time.

```js
import "contrib/tomhollingworth/events"

events.duration(
    unit: 1ns,
    columnName: "duration",
    timeColumn: "_time",
    stopColumn: "_stop",
    stop: 2020-01-01T00:00:00Z,
)
```

{{% note %}}
#### Similar functions
`events.duration()` is similar to `elapsed()` and `stateDuration()`, but differs
in important ways:

- `elapsed()` drops the first record. `events.duration()` does not.
- `stateDuration()` calculates the total time spent in a state (determined by a
  [predicate function](/flux/v0.x/get-started/syntax-basics/#predicate-functions)).
  `events.duration()` returns the duration between all records and their subsequent records.

For examples, see [below](#compared-to-similar-functions).
{{% /note %}}

## Parameters

### unit {data-type="duration"}
Duration unit of the calculated state duration.
Default is `1ns`

### columnName {data-type="string"}
Name of the result column.
Default is `"duration"`.

### timeColumn {data-type="string"}
Name of the time column.
Default is `"_time"`.

### stopColumn {data-type="string"}
Name of the stop column.
Default is `"_stop"`.

### stop {data-type="time"}
The latest time to use when calculating results.
If provided, `stop` overrides the time value in the [`stopColumn`](#stopcolumn).

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

##### Calculate the duration of states
```js
import "contrib/tomhollingworth/events"

data
    |> events.duration(unit: 1m, stop: 2020-01-02T00:00:00Z)
```

{{< flex >}}
{{% flex-content %}}
##### Input
| _time                | state |
|:-----                | -----:|
| 2020-01-01T00:00:00Z | ok    |
| 2020-01-01T00:12:34Z | warn  |
| 2020-01-01T00:25:01Z | ok    |
| 2020-01-01T16:07:55Z | crit  |
| 2020-01-01T16:54:21Z | warn  |
| 2020-01-01T18:20:45Z | ok    |
{{% /flex-content %}}
{{% flex-content %}}
##### Output
| _time                | state | duration |
|:-----                |:-----:| --------:|
| 2020-01-01T00:00:00Z | ok    | 12       |
| 2020-01-01T00:12:34Z | warn  | 12       |
| 2020-01-01T00:25:01Z | ok    | 942      |
| 2020-01-01T16:07:55Z | crit  | 46       |
| 2020-01-01T16:54:21Z | warn  | 86       |
| 2020-01-01T18:20:45Z | ok    | 339      |
{{% /flex-content %}}
{{< /flex >}}

## Compared to similar functions
The example below includes output values of `events.duration()`, `elapsed()`, and
`stateDuration()` related to the `_time` and `state` values of input data.

{{< flex >}}
{{% flex-content %}}
##### Input
| _time                | state |
|:-----                | -----:|
| 2020-01-01T00:00:00Z | ok    |
| 2020-01-01T00:12:34Z | warn  |
| 2020-01-01T00:25:01Z | ok    |
| 2020-01-01T16:07:55Z | crit  |
| 2020-01-01T16:54:21Z | warn  |
| 2020-01-01T18:20:45Z | ok    |
{{% /flex-content %}}
{{% flex-content %}}
##### Functions
```js
data |> events.duration(unit: 1m, stop: 2020-01-02T00:00:00Z)

data |> elapsed(unit: 1m)

data |> stateDuration(unit: 1m, fn: (r) => true)
```
{{% /flex-content %}}
{{< /flex >}}

##### Output values
| _time                | state | events.duration() | elapsed()                           | stateDuration() |
|:-----                |:-----:| -----------------:| ---------:                          | ---------------:|
| 2020-01-01T00:00:00Z | ok    | 12                | <span style="opacity:.2">N/A</span> | 0               |
| 2020-01-01T00:12:34Z | warn  | 12                | 12                                  | 12              |
| 2020-01-01T00:25:01Z | ok    | 942               | 12                                  | 25              |
| 2020-01-01T16:07:55Z | crit  | 46                | 942                                 | 967             |
| 2020-01-01T16:54:21Z | warn  | 86                | 46                                  | 1014            |
| 2020-01-01T18:20:45Z | ok    | 339               | 86                                  | 1100            |
