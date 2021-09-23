---
title: exponentialMovingAverage() function
description: >
  The `exponentialMovingAverage()` function calculates the exponential moving average of values
  in the `_value` column grouped into `n` number of points, giving more weight to recent data.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/exponentialmovingaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/exponentialmovingaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/exponentialmovingaverage/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/exponentialmovingaverage/
menu:
  flux_0_x_ref:
    name: exponentialMovingAverage
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /flux/v0.x/stdlib/universe/movingaverage/
  - /flux/v0.x/stdlib/universe/timedmovingaverage/
  - /flux/v0.x/stdlib/universe/doubleema/
  - /flux/v0.x/stdlib/universe/tripleema/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#exponential-moving-average, InfluxQL EXPONENTIAL_MOVING_AVERAGE()
introduced: 0.37.0
---

The `exponentialMovingAverage()` function calculates the exponential moving average of values
in the `_value` column grouped into `n` number of points, giving more weight to recent data.

```js
exponentialMovingAverage(n: 5)
```

##### Exponential moving average rules
- The first value of an exponential moving average over `n` values is the
  algebraic mean of `n` values.
- Subsequent values are calculated as `y(t) = x(t) * k + y(t-1) * (1 - k)`, where:
    - `y(t)` is the exponential moving average at time `t`.
    - `x(t)` is the value at time `t`.
    - `k = 2 / (1 + n)`.
- The average over a period populated by only `null` values is `null`.
- Exponential moving averages skip `null` values.

## Parameters

### n {data-type="int"}
The number of points to average.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Calculate a three point exponential moving average](#calculate-a-three-point-exponential-moving-average)
- [Calculate a three point exponential moving average with null values](#calculate-a-three-point-exponential-moving-average-with-null-values)

#### Calculate a three point exponential moving average
```js
import "sampledata"

sampledata.int()
  |> exponentialMovingAverage(n: 3)
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
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:20Z | t1  |      5 |
| 2021-01-01T00:00:30Z | t1  |     11 |
| 2021-01-01T00:00:40Z | t1  |     13 |
| 2021-01-01T00:00:50Z | t1  |    8.5 |

| _time                | tag |             _value |
| :------------------- | :-- | -----------------: |
| 2021-01-01T00:00:20Z | t2  |  6.666666666666667 |
| 2021-01-01T00:00:30Z | t2  | 12.833333333333334 |
| 2021-01-01T00:00:40Z | t2  | 12.916666666666668 |
| 2021-01-01T00:00:50Z | t2  |  6.958333333333334 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Calculate a three point exponential moving average with null values

```js
import "sampledata"

sampledata.int(includeNull: true)
  |> exponentialMovingAverage(n: 3)
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" true %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag | _time                | _value |
| :-- | :------------------- | -----: |
| t1  | 2021-01-01T00:00:20Z |    2.5 |
| t1  | 2021-01-01T00:00:30Z |    2.5 |
| t1  | 2021-01-01T00:00:40Z |    2.5 |
| t1  | 2021-01-01T00:00:50Z |   3.25 |

| tag | _time                | _value |
| :-- | :------------------- | -----: |
| t2  | 2021-01-01T00:00:20Z |    0.5 |
| t2  | 2021-01-01T00:00:30Z |   9.75 |
| t2  | 2021-01-01T00:00:40Z |   9.75 |
| t2  | 2021-01-01T00:00:50Z |  5.375 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
