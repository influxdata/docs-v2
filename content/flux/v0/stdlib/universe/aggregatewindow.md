---
title: aggregateWindow() function
description: >
  `aggregateWindow()` downsamples data by grouping data into fixed windows of time
  and applying an aggregate or selector function to each window.
menu:
  flux_v0_ref:
    name: aggregateWindow
    parent: universe
    identifier: universe/aggregateWindow
weight: 101
flux/v0/tags: [transformations, aggregates, selectors]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3881-L3904

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`aggregateWindow()` downsamples data by grouping data into fixed windows of time
and applying an aggregate or selector function to each window.

All columns not in the group key other than the specified `column` are dropped
from output tables. This includes `_time`. `aggregateWindow()` uses the
`timeSrc` and `timeDst` parameters to assign a time to the aggregate value.

`aggregateWindow()` requires `_start` and `_stop` columns in input data.
Use `range()` to assign `_start` and `_stop` values.

This function is intended to be used when `timeColumn` (`_time` by default) is not in the group key.
If `timeColumn` _is_ in the group key, resulting output is confusing and generally not useful.

#### Downsample by calendar months and years
`every`, `period`, and `offset` parameters support all valid duration units,
including calendar months (`1mo`) and years (`1y`).

#### Downsample by week
When windowing by week (`1w`), weeks are determined using the Unix epoch
(1970-01-01T00:00:00Z UTC). The Unix epoch was on a Thursday, so all
calculated weeks begin on Thursday.

##### Function type signature

```js
(
    <-tables: stream[D],
    every: duration,
    fn: (<-: stream[B], column: A) => stream[C],
    ?column: A,
    ?createEmpty: bool,
    ?location: {zone: string, offset: duration},
    ?offset: duration,
    ?period: duration,
    ?timeDst: string,
    ?timeSrc: string,
) => stream[E] where B: Record, C: Record, D: Record, E: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### every
({{< req >}})
Duration of time between windows.



### period

Duration of windows. Default is the `every` value.

`period` can be negative, indicating the start and stop boundaries are reversed.

### offset

Duration to shift the window boundaries by. Default is `0s`.

`offset` can be negative, indicating that the offset goes backwards in time.

### fn
({{< req >}})
Aggregate or selector function to apply to each time window.



### location

Location used to determine timezone. Default is the `location` option.



### column

Column to operate on.



### timeSrc

Column to use as the source of the new time value for aggregate values.
Default is `_stop`.



### timeDst

Column to store time values for aggregate values in.
Default is `_time`.



### createEmpty

Create empty tables for empty window. Default is `true`.

**Note:** When using `createEmpty: true`, aggregate functions return empty
tables, but selector functions do not. By design, selectors drop empty tables.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Use an aggregate function with default parameters](#use-an-aggregate-function-with-default-parameters)
- [Specify parameters of the aggregate function](#specify-parameters-of-the-aggregate-function)
- [Downsample by calendar month](#downsample-by-calendar-month)
- [Downsample by calendar week starting on Monday](#downsample-by-calendar-week-starting-on-monday)

### Use an aggregate function with default parameters

```js
data
    |> aggregateWindow(every: 20s, fn: mean)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_start              | *_stop               | _time                | *tag | _value  |
| -------------------- | -------------------- | -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | t1   | -2.18   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | t1   | 10.92   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | t1   | 7.35    |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | t1   | 17.53   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t1   | 15.23   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | t1   | 4.43    |

| *_start              | *_stop               | _time                | *tag | _value  |
| -------------------- | -------------------- | -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | t2   | 19.85   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | t2   | 4.97    |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | t2   | -3.75   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | t2   | 19.77   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t2   | 13.86   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | t2   | 1.86    |


#### Output data

| _time                | *_start              | *_stop               | *tag | _value             |
| -------------------- | -------------------- | -------------------- | ---- | ------------------ |
| 2021-01-01T00:00:20Z | 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1   | 4.37               |
| 2021-01-01T00:00:40Z | 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1   | 12.440000000000001 |
| 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1   | 9.83               |

| _time                | *_start              | *_stop               | *tag | _value            |
| -------------------- | -------------------- | -------------------- | ---- | ----------------- |
| 2021-01-01T00:00:20Z | 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2   | 12.41             |
| 2021-01-01T00:00:40Z | 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2   | 8.01              |
| 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2   | 7.859999999999999 |

{{% /expand %}}
{{< /expand-wrapper >}}

### Specify parameters of the aggregate function

To use functions that don’t provide defaults for required parameters with
`aggregateWindow()`, define an anonymous function with `column` and `tables`
parameters that pipes-forward tables into the aggregate or selector function
with all required parameters defined:

```js
data
    |> aggregateWindow(
        column: "_value",
        every: 20s,
        fn: (column, tables=<-) => tables |> quantile(q: 0.99, column: column),
    )

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_start              | *_stop               | _time                | *tag | _value  |
| -------------------- | -------------------- | -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | t1   | -2.18   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | t1   | 10.92   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | t1   | 7.35    |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | t1   | 17.53   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t1   | 15.23   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | t1   | 4.43    |

| *_start              | *_stop               | _time                | *tag | _value  |
| -------------------- | -------------------- | -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | t2   | 19.85   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | t2   | 4.97    |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | t2   | -3.75   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | t2   | 19.77   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t2   | 13.86   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | t2   | 1.86    |


#### Output data

| *_start              | *_stop               | *tag | _value  | _time                |
| -------------------- | -------------------- | ---- | ------- | -------------------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1   | 10.92   | 2021-01-01T00:00:20Z |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1   | 17.53   | 2021-01-01T00:00:40Z |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1   | 15.23   | 2021-01-01T00:01:00Z |

| *_start              | *_stop               | *tag | _value  | _time                |
| -------------------- | -------------------- | ---- | ------- | -------------------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2   | 19.85   | 2021-01-01T00:00:20Z |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2   | 19.77   | 2021-01-01T00:00:40Z |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2   | 13.86   | 2021-01-01T00:01:00Z |

{{% /expand %}}
{{< /expand-wrapper >}}

### Downsample by calendar month

```js
data
    |> aggregateWindow(every: 1mo, fn: mean)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_start              | *_stop               | _time                | *tag | _value  |
| -------------------- | -------------------- | -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | t1   | -2.18   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | t1   | 10.92   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | t1   | 7.35    |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | t1   | 17.53   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t1   | 15.23   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | t1   | 4.43    |

| *_start              | *_stop               | _time                | *tag | _value  |
| -------------------- | -------------------- | -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | t2   | 19.85   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | t2   | 4.97    |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | t2   | -3.75   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | t2   | 19.77   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t2   | 13.86   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | t2   | 1.86    |


#### Output data

| _time                | *_start              | *_stop               | *tag | _value  |
| -------------------- | -------------------- | -------------------- | ---- | ------- |
| 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1   | 8.88    |

| _time                | *_start              | *_stop               | *tag | _value            |
| -------------------- | -------------------- | -------------------- | ---- | ----------------- |
| 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2   | 9.426666666666668 |

{{% /expand %}}
{{< /expand-wrapper >}}

### Downsample by calendar week starting on Monday

Flux increments weeks from the Unix epoch, which was a Thursday.
Because of this, by default, all `1w` windows begin on Thursday.
Use the `offset` parameter to shift the start of weekly windows to the
desired day of the week.

| Week start | Offset |
| :--------- | :----: |
| Monday     |  -3d   |
| Tuesday    |  -2d   |
| Wednesday  |  -1d   |
| Thursday   |   0d   |
| Friday     |   1d   |
| Saturday   |   2d   |
| Sunday     |   3d   |

```js
data
    |> aggregateWindow(every: 1w, offset: -3d, fn: mean)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _start               | _stop                | _time                | *tag | _value  |
| -------------------- | -------------------- | -------------------- | ---- | ------- |
| 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 2022-01-01T00:00:00Z | t1   | 2       |
| 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 2022-01-03T00:00:00Z | t1   | 2.2     |
| 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 2022-01-06T00:00:00Z | t1   | 4.1     |
| 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 2022-01-09T00:00:00Z | t1   | 3.8     |
| 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 2022-01-11T00:00:00Z | t1   | 1.7     |
| 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 2022-01-12T00:00:00Z | t1   | 2.1     |
| 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 2022-01-15T00:00:00Z | t1   | 3.8     |
| 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 2022-01-16T00:00:00Z | t1   | 4.2     |
| 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 2022-01-20T00:00:00Z | t1   | 5       |
| 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 2022-01-24T00:00:00Z | t1   | 5.8     |
| 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 2022-01-28T00:00:00Z | t1   | 3.9     |


#### Output data

| _time                | *tag | *_start              | *_stop               | _value             |
| -------------------- | ---- | -------------------- | -------------------- | ------------------ |
| 2022-01-03T00:00:00Z | t1   | 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 2                  |
| 2022-01-10T00:00:00Z | t1   | 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 3.3666666666666667 |
| 2022-01-17T00:00:00Z | t1   | 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 2.95               |
| 2022-01-24T00:00:00Z | t1   | 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 5                  |
| 2022-01-31T00:00:00Z | t1   | 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z | 4.85               |
| 2022-01-31T23:59:59Z | t1   | 2022-01-01T00:00:00Z | 2022-01-31T23:59:59Z |                    |

{{% /expand %}}
{{< /expand-wrapper >}}
