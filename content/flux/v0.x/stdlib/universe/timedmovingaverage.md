---
title: timedMovingAverage() function
description: >
  The `timedMovingAverage()` function calculates the mean of values in a defined time
  range at a specified frequency.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/timedmovingaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/timedmovingaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/timedmovingaverage/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/timedmovingaverage/
menu:
  flux_0_x_ref:
    name: timedMovingAverage
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /flux/v0.x/stdlib/universe/movingaverage/
  - /flux/v0.x/stdlib/universe/exponentialmovingaverage/
  - /flux/v0.x/stdlib/universe/doubleema/
  - /flux/v0.x/stdlib/universe/tripleema/
  - /{{< latest "influxdb" >}}/query-data/flux/moving-average/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#moving-average, InfluxQL MOVING_AVERAGE()
introduced: 0.36.0
---

The `timedMovingAverage()` function calculates the mean of values in a defined time
range at a specified frequency.

```js
timedMovingAverage(
  every: 1d,
  period: 5d,
  column: "_value"
)
```

For each row in a table, `timedMovingAverage()` returns the average of the
current value and all row values in the **previous** `period` (duration).
It returns moving averages at a frequency defined by the `every` parameter.

Each color in the diagram below represents a period of time used to calculate an
average and the time a point representing the average is returned.
If `every = 30m` and `period = 1h`:

{{< svg "/static/svgs/timed-moving-avg.svg" >}}

## Parameters

### every {data-type="duration"}
({{< req >}})
Frequency of time windows.

{{% note %}}
#### Calendar months and years
`every` supports all [valid duration units](/flux/v0.x/spec/types/#duration-types),
including **calendar months (`1mo`)** and **years (`1y`)**.

#### Aggregate by week
When aggregating by week (`1w`), weeks are determined using the 
**Unix epoch (1970-01-01T00:00:00Z UTC)**. The Unix epoch was on a Thursday, so
all calculated weeks begin on Thursday.
{{% /note %}}

### period {data-type="duration"}
({{< req >}})
Length of each averaged time window.
_A negative duration indicates start and stop boundaries are reversed._

### column {data-type="string"}
Column used to compute the moving average.
Defaults to `"_value"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
The following examples use [`generate.from()`](/flux/v0.x/stdlib/generate/from/)
to generate sample data and illustrate how `timedMovingAverage()` transforms data.

#### Calculate a five year moving average every year
```js
import "generate"

timeRange = {start: 2015-01-01T00:00:00Z, stop: 2021-01-01T00:00:00Z}

data = generate.from(
    count: 6,
    fn: (n) => n * n,
    start: timeRange.start,
    stop: timeRange.stop
  )
  |> range(start: timeRange.start, stop: timeRange.stop)

data
  |> timedMovingAverage(every: 1y, period: 5y)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
##### Input data
| _start               | _stop                | _time                | _value |
| :------------------- | :------------------- | :------------------- | -----: |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2015-01-01T00:00:00Z |      0 |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2016-01-01T08:00:00Z |      1 |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2016-12-31T16:00:00Z |      4 |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2018-01-01T00:00:00Z |      9 |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2019-01-01T08:00:00Z |     16 |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2020-01-01T16:00:00Z |     25 |

##### Output data
| _start               | _stop                | _time                | _value |
| :------------------- | :------------------- | :------------------- | -----: |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2016-01-01T00:00:00Z |    0.0 |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2017-01-01T00:00:00Z | 1.6667 |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2018-01-01T00:00:00Z | 1.6667 |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2019-01-01T00:00:00Z |    3.5 |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2020-01-01T00:00:00Z |    6.0 |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2021-01-01T00:00:00Z |   11.0 |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 16.668 |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 16.668 |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2021-01-01T00:00:00Z |   20.5 |
| 2015-01-01T00:00:00Z | 2021-01-01T00:00:00Z | 2021-01-01T00:00:00Z |   25.0 |

{{% /expand %}}
{{< /expand-wrapper >}}

#### Calculate a seven day moving average every day
```js
import "generate"

timeRange = {start: 2021-01-01T00:00:00Z, stop: 2021-01-08T00:00:00Z}

data = generate.from(
    count: 7,
    fn: (n) => n + n,
    start: timeRange.start,
    stop: timeRange.stop
  )
  |> range(start: timeRange.start, stop: timeRange.stop)

data
  |> timedMovingAverage(every: 1d, period: 7d)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
##### Input data
| _start               | _stop                | _time                | _value |
| :------------------- | :------------------- | :------------------- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-01T00:00:00Z |      0 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-02T00:00:00Z |      2 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-03T00:00:00Z |      4 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-04T00:00:00Z |      6 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-05T00:00:00Z |      8 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-06T00:00:00Z |     10 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-07T00:00:00Z |     12 |

##### Output data
| _start               | _stop                | _time                | _value |
| :------------------- | :------------------- | :------------------- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-02T00:00:00Z |    0.0 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-03T00:00:00Z |    1.0 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-04T00:00:00Z |    2.0 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-05T00:00:00Z |    3.0 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-06T00:00:00Z |    4.0 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-07T00:00:00Z |    5.0 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-08T00:00:00Z |    6.0 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-08T00:00:00Z |    7.0 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-08T00:00:00Z |    8.0 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-08T00:00:00Z |    9.0 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-08T00:00:00Z |   10.0 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-08T00:00:00Z |   11.0 |
| 2021-01-01T00:00:00Z | 2021-01-08T00:00:00Z | 2021-01-08T00:00:00Z |   12.0 |

{{% /expand %}}
{{< /expand-wrapper >}}

## Function definition
```js
timedMovingAverage = (every, period, column="_value", tables=<-) =>
  tables
    |> window(every: every, period: period)
    |> mean(column:column)
    |> duplicate(column: "_stop", as: "_time")
    |> window(every: inf)
```
