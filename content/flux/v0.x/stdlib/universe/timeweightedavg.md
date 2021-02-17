---
title: timeWeightedAvg() function
description: The `timeWeightedAvg()` function outputs the timeWeightedAvg of non-null records as a float.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/timeweightedavg/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/timeweightedavg/
menu:
  flux_0_x_ref:
    name: timeWeightedAvg
    parent: universe
weight: 102
flux/v0.x/tags: [aggregates, transformations]
related:
  - /flux/v0.x/stdlib/universe/integral/
introduced: 0.83.0
---

The `timeWeightedAvg()` function outputs the time-weighted average of non-null records
in a table as a float.
Time is weighted using the linearly interpolated integral of values in the table.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
timeWeightedAvg(unit: "_value")
```

## Parameters

### unit
Time duration used when computing the time-weighted average.

_**Data type:** Duration_

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> timeWeightedAvg(unit: 1m)
```

## Function definition
```js
timeWeightedAvg = (tables=<-, unit) => tables
  |> integral(
    unit: unit,
    interpolate: "linear"
  )
  |> map(fn: (r) => ({
    r with
    _value: (r._value * float(v: uint(v: unit))) / float(v: int(v: r._stop) - int(v: r._start))
  }))
```
