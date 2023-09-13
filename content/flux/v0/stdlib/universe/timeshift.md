---
title: timeShift() function
description: >
  `timeShift()` adds a fixed duration to time columns.
menu:
  flux_v0_ref:
    name: timeShift
    parent: universe
    identifier: universe/timeShift
weight: 101
flux/v0.x/tags: [transformations, date/time]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2421-L2421

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`timeShift()` adds a fixed duration to time columns.

The output table schema is the same as the input table schema.
`null` time values remain `null`.

##### Function type signature

```js
(<-tables: stream[A], duration: duration, ?columns: [string]) => stream[A]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### duration
({{< req >}})
Amount of time to add to each time value. May be a negative duration.



### columns

List of time columns to operate on. Default is `["_start", "_stop", "_time"]`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Shift timestamps forward in time](#shift-timestamps-forward-in-time)
- [Shift timestamps backward in time](#shift-timestamps-backward-in-time)

### Shift timestamps forward in time

```js
import "sampledata"

sampledata.int()
    |> timeShift(duration: 12h)

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

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T12:00:00Z | -2      | t1   |
| 2021-01-01T12:00:10Z | 10      | t1   |
| 2021-01-01T12:00:20Z | 7       | t1   |
| 2021-01-01T12:00:30Z | 17      | t1   |
| 2021-01-01T12:00:40Z | 15      | t1   |
| 2021-01-01T12:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T12:00:00Z | 19      | t2   |
| 2021-01-01T12:00:10Z | 4       | t2   |
| 2021-01-01T12:00:20Z | -3      | t2   |
| 2021-01-01T12:00:30Z | 19      | t2   |
| 2021-01-01T12:00:40Z | 13      | t2   |
| 2021-01-01T12:00:50Z | 1       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Shift timestamps backward in time

```js
import "sampledata"

sampledata.int()
    |> timeShift(duration: -12h)

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

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2020-12-31T12:00:00Z | -2      | t1   |
| 2020-12-31T12:00:10Z | 10      | t1   |
| 2020-12-31T12:00:20Z | 7       | t1   |
| 2020-12-31T12:00:30Z | 17      | t1   |
| 2020-12-31T12:00:40Z | 15      | t1   |
| 2020-12-31T12:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2020-12-31T12:00:00Z | 19      | t2   |
| 2020-12-31T12:00:10Z | 4       | t2   |
| 2020-12-31T12:00:20Z | -3      | t2   |
| 2020-12-31T12:00:30Z | 19      | t2   |
| 2020-12-31T12:00:40Z | 13      | t2   |
| 2020-12-31T12:00:50Z | 1       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
