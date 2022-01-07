---
title: movingAverage() function
description: >
  The `movingAverage()` function calculates the mean of values grouped into `n` number of points.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/movingaverage/
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/movingaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/movingaverage/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/movingaverage/
menu:
  flux_0_x_ref:
    name: movingAverage
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/moving-average/
  - /flux/v0.x/stdlib/universe/timedmovingaverage/
  - /flux/v0.x/stdlib/universe/exponentialmovingaverage/
  - /flux/v0.x/stdlib/universe/doubleema/
  - /flux/v0.x/stdlib/universe/tripleema/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#moving-average, InfluxQL MOVING_AVERAGE()
introduced: 0.35.0
---

The `movingAverage()` function calculates the mean of values in the `_values` column
grouped into `n` number of points.

```js
movingAverage(n: 5)
```

##### Moving average rules
- The average over a period populated by `n` values is equal to their algebraic mean.
- The average over a period populated by only `null` values is `null`.
- Moving averages skip `null` values.
- If `n` is less than the number of records in a table, `movingAverage` returns
  the average of the available values.

## Parameters

### n {data-type="int"}
({{< req >}})
The number of points to average.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Calculate a three point moving average](#calculate-a-three-point-moving-average)
- [Calculate a three point moving average with null values](#calculate-a-three-point-moving-average-with-null-values)

#### Calculate a three point moving average
```js
import "sampledata"

sampledata.int()
  |> movingAverage(n: 3)
```

{{% expand-wrapper %}}
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
| 2021-01-01T00:00:20Z | t1  |                5.0 |
| 2021-01-01T00:00:30Z | t1  | 11.333333333333334 |
| 2021-01-01T00:00:40Z | t1  |               13.0 |
| 2021-01-01T00:00:50Z | t1  |               12.0 |

| _time                | tag |            _value |
| :------------------- | :-- | ----------------: |
| 2021-01-01T00:00:20Z | t2  | 6.666666666666667 |
| 2021-01-01T00:00:30Z | t2  | 6.666666666666667 |
| 2021-01-01T00:00:40Z | t2  | 9.666666666666666 |
| 2021-01-01T00:00:50Z | t2  |              11.0 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{% /expand-wrapper %}}

#### Calculate a three point moving average with null values
```js
import "sampledata"

sampledata.int(includeNull: true)
  |> movingAverage(n: 3)
```

{{% expand-wrapper %}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" true %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:20Z | t1  |    2.5 |
| 2021-01-01T00:00:30Z | t1  |    7.0 |
| 2021-01-01T00:00:40Z | t1  |    7.0 |
| 2021-01-01T00:00:50Z | t1  |    4.0 |

| _time                | tag |            _value |
| :------------------- | :-- | ----------------: |
| 2021-01-01T00:00:20Z | t2  |               0.5 |
| 2021-01-01T00:00:30Z | t2  | 6.666666666666667 |
| 2021-01-01T00:00:40Z | t2  |               8.0 |
| 2021-01-01T00:00:50Z | t2  |              10.0 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{% /expand-wrapper %}}
