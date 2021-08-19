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

## Parameters

### every {data-type="duration"}
({{< req >}})
Frequency of time windows.

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

###### Calculate a five year moving average every year
```js
from(bucket: "example-bucket"):
  |> range(start: -7y)
  |> filter(fn: (r) =>
    r._measurement == "financial" and
    r._field == "closing_price"
  )
  |> timedMovingAverage(every: 1y, period: 5y)
```

###### Calculate a seven day moving average every day
```js
from(bucket: "example-bucket"):
  |> range(start: -50d)
  |> filter(fn: (r) =>
    r._measurement == "financial" and
    r._field == "closing_price"
  )
  |> timedMovingAverage(every: 1d, period: 7d)
```

## Function definition
```js
timedMovingAverage = (every, period, column="_value", tables=<-) =>
  tables
    |> window(every: every, period: period)
    |> mean(column:column)
    |> duplicate(column: "_stop", as: "_time")
    |> window(every: inf)
```
