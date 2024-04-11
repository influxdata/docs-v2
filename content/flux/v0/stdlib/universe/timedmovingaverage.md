---
title: timedMovingAverage() function
description: >
  `timedMovingAverage()` returns the mean of values in a defined time range at a
  specified frequency.
menu:
  flux_v0_ref:
    name: timedMovingAverage
    parent: universe
    identifier: universe/timedMovingAverage
weight: 101
flux/v0/tags: [transformations]
introduced: 0.36.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L4431-L4436

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`timedMovingAverage()` returns the mean of values in a defined time range at a
specified frequency.

For each row in a table, `timedMovingAverage()` returns the average of the
current value and all row values in the previous `period` (duration).
It returns moving averages at a frequency defined by the `every` parameter.

#### Aggregate by calendar months and years
`every` and `period` parameters support all valid duration units, including
calendar months (`1mo`) and years (`1y`).

#### Aggregate by week
When aggregating by week (`1w`), weeks are determined using the Unix epoch
(1970-01-01T00:00:00Z UTC). The Unix epoch was on a Thursday, so all
calculated weeks begin on Thursday.

##### Function type signature

```js
(<-tables: stream[A], every: duration, period: duration, ?column: string) => stream[B] where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### every
({{< req >}})
Frequency of time window.



### period
({{< req >}})
Length of each averaged time window.

A negative duration indicates start and stop boundaries are reversed.

### column

Column to operate on. Default is `_value`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Calculate a five year moving average every year

```js
data
    |> timedMovingAverage(every: 1y, period: 5y)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_start              | *_stop               | _time                | _value  |
| -------------------- | -------------------- | -------------------- | ------- |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2015-01-01T00:00:00Z | 0       |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2016-01-01T08:00:00Z | 1       |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2016-12-31T16:00:00Z | 4       |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2018-01-01T00:00:00Z | 9       |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2019-01-01T08:00:00Z | 16      |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2020-01-01T16:00:00Z | 25      |


#### Output data

| _time                | *_start              | *_stop               | _value             |
| -------------------- | -------------------- | -------------------- | ------------------ |
| 2016-01-01T00:00:00Z | 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 0                  |
| 2017-01-01T00:00:00Z | 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 1.6666666666666667 |
| 2018-01-01T00:00:00Z | 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 1.6666666666666667 |
| 2019-01-01T00:00:00Z | 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 3.5                |
| 2020-01-01T00:00:00Z | 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 6                  |
| 2021-01-01T00:00:00Z | 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 11                 |
| 2021-01-01T00:00:00Z | 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 16.666666666666668 |
| 2021-01-01T00:00:00Z | 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 16.666666666666668 |
| 2021-01-01T00:00:00Z | 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 20.5               |
| 2021-01-01T00:00:00Z | 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 25                 |

{{% /expand %}}
{{< /expand-wrapper >}}
