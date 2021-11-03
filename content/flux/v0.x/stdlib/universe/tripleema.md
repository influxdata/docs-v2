---
title: tripleEMA() function
description: >
  The `tripleEMA()` function calculates the exponential moving average of values
  grouped into `n` number of points, giving more weight to recent data with less lag
  than `exponentialMovingAverage()` and `doubleEMA()`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/tripleema/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/tripleema/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/tripleema/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/tripleema/
menu:
  flux_0_x_ref:
    name: tripleEMA
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /flux/v0.x/stdlib/universe/movingaverage/
  - /flux/v0.x/stdlib/universe/doubleema/
  - /flux/v0.x/stdlib/universe/timedmovingaverage/
  - /flux/v0.x/stdlib/universe/exponentialmovingaverage/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#triple-exponential-moving-average, InfluxQL TRIPLE_EXPONENTIAL_MOVING_AVERAGE()
introduced: 0.38.0
---

The `tripleEMA()` function calculates the exponential moving average of values in
the `_value` column grouped into `n` number of points, giving more weight to recent
data with less lag than
[`exponentialMovingAverage()`](/flux/v0.x/stdlib/universe/exponentialmovingaverage/)
and [`doubleEMA()`](/flux/v0.x/stdlib/universe/doubleema/).

```js
tripleEMA(n: 5)
```

##### Triple exponential moving average rules
- A triple exponential moving average is defined as `tripleEMA = (3 * EMA_1) - (3 * EMA_2) + EMA_3`.
  - `EMA_1` is the exponential moving average of the original data.
  - `EMA_2` is the exponential moving average of `EMA_1`.
  - `EMA_3` is the exponential moving average of `EMA_2`.
- A true triple exponential moving average requires at least requires at least `3 * n - 2` values.
  If not enough values exist to calculate the triple EMA, it returns a `NaN` value.
- `tripleEMA()` inherits all [exponential moving average rules](/flux/v0.x/stdlib/universe/exponentialmovingaverage/#exponential-moving-average-rules).

## Parameters

### n {data-type="int"}
({{< req >}})
Number of points to average.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

#### Calculate a three point triple exponential moving average
```js
import "sampledata"

sampledata.int()
  |> tripleEMA(n: 3)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag |             _value |
| :------------------- | :-- | -----------------: |
| 2021-01-01T00:00:50Z | t1  | 7.6250000000000036 |

| _time                | tag |             _value |
| :------------------- | :-- | -----------------: |
| 2021-01-01T00:00:50Z | t2  | 4.0729166666666625 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
