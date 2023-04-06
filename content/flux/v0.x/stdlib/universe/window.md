---
title: window() function
description: >
  `window()` groups records using regular time intervals.
menu:
  flux_0_x_ref:
    name: window
    parent: universe
    identifier: universe/window
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2872-L2893

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`window()` groups records using regular time intervals.

The function calculates time windows and stores window bounds in the
`_start` and `_stop` columns. `_start` and `_stop` values are assigned to
rows based on the row's `_time` value.

A single input row may be placed into zero or more output tables depending on
the parameters passed into `window()`.

This function is intended to be used when `timeColumn` (`_time` by default) is not in the group key.
If `timeColumn` _is_ in the group key, resulting output is confusing and generally not useful.

#### Window by calendar months and years
`every`, `period`, and `offset` parameters support all valid duration units,
including calendar months (`1mo`) and years (`1y`).

#### Window by week
When windowing by week (`1w`), weeks are determined using the Unix epoch
(1970-01-01T00:00:00Z UTC). The Unix epoch was on a Thursday, so all
calculated weeks begin on Thursday.

##### Function type signature

```js
(
    <-tables: stream[A],
    ?createEmpty: bool,
    ?every: duration,
    ?location: {zone: string, offset: duration},
    ?offset: duration,
    ?period: duration,
    ?startColumn: string,
    ?stopColumn: string,
    ?timeColumn: string,
) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### every

Duration of time between windows.



### period

Duration of windows. Default is the `every` value.

`period` can be negative, indicating the start and stop boundaries are reversed.

### offset

Duration to shift the window boundaries by. Default is `0s`.

`offset` can be negative, indicating that the offset goes backwards in time.

### location

Location used to determine timezone. Default is the `location` option.



### timeColumn

Column that contains time values. Default is `_time`.



### startColumn

Column to store the window start time in. Default is `_start`.



### stopColumn

Column to store the window stop time in. Default is `_stop`.



### createEmpty

Create empty tables for empty window. Default is `false`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Window data into 30 second intervals](#window-data-into-30-second-intervals)
- [Window every 20 seconds covering 40 second periods](#window-every-20-seconds-covering-40-second-periods)
- [Window by calendar month](#window-by-calendar-month)

### Window data into 30 second intervals

```js
data
    |> window(every: 30s)

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

### Window every 20 seconds covering 40 second periods

```js
data
    |> window(every: 20s, period: 40s)

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
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:20Z | 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:20Z | 2021-01-01T00:00:10Z | 10      | t1   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:20Z | 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:20Z | 2021-01-01T00:00:10Z | 4       | t2   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:30Z | 17      | t1   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:30Z | 19      | t2   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 4       | t1   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 1       | t2   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:40Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:40Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 4       | t1   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:40Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:40Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 1       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Window by calendar month

```js
data
    |> window(every: 1mo)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_start              | *_stop               | _time                | _value  |
| -------------------- | -------------------- | -------------------- | ------- |
| 2021-01-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-01-01T00:00:00Z | 0       |
| 2021-01-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-01-16T00:00:00Z | 2       |
| 2021-01-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-01-31T00:00:00Z | 4       |
| 2021-01-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-02-15T00:00:00Z | 6       |
| 2021-01-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-03-02T00:00:00Z | 8       |
| 2021-01-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-03-17T00:00:00Z | 10      |


#### Output data

| *_start              | *_stop               | _time                | _value  |
| -------------------- | -------------------- | -------------------- | ------- |
| 2021-01-01T00:00:00Z | 2021-02-01T00:00:00Z | 2021-01-01T00:00:00Z | 0       |
| 2021-01-01T00:00:00Z | 2021-02-01T00:00:00Z | 2021-01-16T00:00:00Z | 2       |
| 2021-01-01T00:00:00Z | 2021-02-01T00:00:00Z | 2021-01-31T00:00:00Z | 4       |

| *_start              | *_stop               | _time                | _value  |
| -------------------- | -------------------- | -------------------- | ------- |
| 2021-02-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-02-15T00:00:00Z | 6       |

| *_start              | *_stop               | _time                | _value  |
| -------------------- | -------------------- | -------------------- | ------- |
| 2021-03-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-03-02T00:00:00Z | 8       |
| 2021-03-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-03-17T00:00:00Z | 10      |

{{% /expand %}}
{{< /expand-wrapper >}}
