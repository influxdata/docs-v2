---
title: events.duration() function
description: >
  The `events.duration()` function calculates the duration of events.
  The function determines the time between a record and the subsequent record and
  associates the duration with the first record (start of the event).
menu:
  influxdb_cloud_ref:
    name: events.duration
    parent: contrib-events
weight: 301
influxdb/v2.0/tags: [functions, events, package]
related:
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/elapsed/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/stateduration/
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
  stop: 2020-01-01T00:00:00Z
)
```

{{% note %}}
#### Similar functions
`events.duration()` is similar to `elapsed()` and `stateDuration()`, but differs
in important ways:

- `elapsed()` drops the first record. `events.duration()` does not.
- `stateDuration()` calculates the total time spent in a state (determined by a
  [predicate function](/influxdb/cloud/reference/glossary/#predicate-function)).
  `events.duration()` returns the duration between all records and their subsequent records.

For examples, see [below](#compared-to-similar-functions).
{{% /note %}}

## Parameters

### unit
Duration unit of the calculated state duration.
Default is `1ns`

_**Data type:** Duration_

### columnName
Name of the result column.
Default is `"duration"`.

_**Data type:** String_

### timeColumn
Name of the time column.
Default is `"_time"`.

_**Data type:** String_

### stopColumn
Name of the stop column.
Default is `"_stop"`.

_**Data type:** String_

### stop
The latest time to use when calculating results.
If provided, `stop` overrides the time value in the [`stopColumn`](#stopcolumn).

_**Data type:** Time_

## Examples

##### Calculate the duration of states
```js
import "contrib/tomhollingworth/events"

data
  |> events.duration(
    unit: 1m,
    stop: 2020-01-02T00:00:00Z
  )
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
data |> events.duration(
  unit: 1m,
  stop: 2020-01-02T00:00:00Z
)

data |> elapsed(
  unit: 1m
)

data |> stateDuration(
  unit: 1m,
  fn: (r) => true
)
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


{{% note %}}
#### Package author and maintainer
**Github:** [@tomhollingworth](https://github.com/tomhollingworth)  
**InfluxDB Slack:** [@Tom Hollingworth](https://influxdata.com/slack)  
{{% /note %}}
