---
title: experimental.window() function
description: >
  `experimental.window()` groups records based on time.
menu:
  flux_v0_ref:
    name: experimental.window
    parent: experimental
    identifier: experimental/window
weight: 101
flux/v0.x/tags: [transformations, date/time]
introduced: 0.106.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L580-L595

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.window()` groups records based on time.

`_start` and `_stop` columns are updated to reflect the bounds of
the window the row's time value is in.
Input tables must have `_start`, `_stop`, and `_time` columns.

A single input record can be placed into zero or more output tables depending
on the specific windowing function.

By default the start boundary of a window will align with the Unix epoch
modified by the offset of the `location` option.

#### Calendar months and years
`every`, `period`, and `offset` support all valid duration units, including
calendar months (`1mo`) and years (`1y`).

##### Function type signature

```js
(
    <-tables: stream[{A with _time: time, _stop: time, _start: time}],
    ?createEmpty: bool,
    ?every: duration,
    ?location: {zone: string, offset: duration},
    ?offset: duration,
    ?period: duration,
) => stream[{A with _time: time, _stop: time, _start: time}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### every

Duration of time between windows. Default is the `0s`.



### period

Duration of the window. Default is `0s`.

Period is the length of each interval.
It can be negative, indicating the start and stop boundaries are reversed.

### offset

Duration to shift the window boundaries by. Default is 0s.

`offset` can be negative, indicating that the offset goes backwards in time.

### location

Location used to determine timezone. Default is the `location` option.



### createEmpty

Create empty tables for empty windows. Default is `false`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Window data into thirty second intervals](#window-data-into-thirty-second-intervals)
- [Window by calendar month](#window-by-calendar-month)

### Window data into thirty second intervals

```js
import "experimental"

data
    |> experimental.window(every: 30s)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 4       | t1   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:30Z | 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:30Z | 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:30Z | 2021-01-01T00:00:20Z | 7       | t1   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:30Z | 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:30Z | 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:30Z | 2021-01-01T00:00:20Z | -3      | t2   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:30Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:30Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:30Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 4       | t1   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:30Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:30Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:30Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 1       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Window by calendar month

```js
import "experimental"

data
    |> experimental.window(every: 1mo)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_start              | *_stop               | _time                | _value  |
| -------------------- | -------------------- | -------------------- | ------- |
| 2021-01-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-01-01T00:00:00Z | 32.1    |
| 2021-01-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-01-02T00:00:00Z | 32.9    |
| 2021-01-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-01-03T00:00:00Z | 33.2    |
| 2021-01-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-02-01T00:00:00Z | 38.3    |
| 2021-01-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-02-02T00:00:00Z | 38.4    |
| 2021-01-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-02-03T00:00:00Z | 37.8    |


#### Output data

| *_start              | *_stop               | _time                | _value  |
| -------------------- | -------------------- | -------------------- | ------- |
| 2021-01-01T00:00:00Z | 2021-02-01T00:00:00Z | 2021-01-01T00:00:00Z | 32.1    |
| 2021-01-01T00:00:00Z | 2021-02-01T00:00:00Z | 2021-01-02T00:00:00Z | 32.9    |
| 2021-01-01T00:00:00Z | 2021-02-01T00:00:00Z | 2021-01-03T00:00:00Z | 33.2    |

| *_start              | *_stop               | _time                | _value  |
| -------------------- | -------------------- | -------------------- | ------- |
| 2021-02-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-02-01T00:00:00Z | 38.3    |
| 2021-02-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-02-02T00:00:00Z | 38.4    |
| 2021-02-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-02-03T00:00:00Z | 37.8    |

{{% /expand %}}
{{< /expand-wrapper >}}
