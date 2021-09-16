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
_`timeWeightedAvg()` is an [aggregate function](/flux/v0.x/function-types/#aggregates)._

_**Output data type:** Float_

```js
timeWeightedAvg(unit: 1m)
```

## Parameters

### unit {data-type="duration"}
({{< req >}})
Time duration used when computing the time-weighted average.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}
```js
import "sampledata"

data = sampledata.int(includeNull: true)
  |> range(start: sampledata.start, stop: sampledata.stop)
  |> fill(usePrevious: true)
  |> unique()

data
  |> timeWeightedAvg(unit: 1s)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
##### Input data
| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | t1  |     -2 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | t1  |      7 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | t1  |      4 |

| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | t2  |        |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | t2  |      4 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | t2  |     -3 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | t2  |     19 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | t2  |      1 |

##### Output data
| _start               | _stop                | tag |            _value |
| :------------------- | :------------------- | :-- | ----------------: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1  | 4.166666666666667 |

| _start               | _stop                | tag |            _value |
| :------------------- | :------------------- | :-- | ----------------: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2  | 5.416666666666667 |

{{% /expand %}}
{{< /expand-wrapper >}}

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
