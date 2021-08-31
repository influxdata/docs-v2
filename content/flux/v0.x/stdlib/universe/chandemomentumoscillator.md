---
title: chandeMomentumOscillator() function
description: >
  The `chandeMomentumOscillator()` function applies the technical momentum indicator
  developed by Tushar Chande.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/chandemomentumoscillator/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/chandemomentumoscillator/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/chandemomentumoscillator/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/chandemomentumoscillator/
menu:
  flux_0_x_ref:
    name: chandeMomentumOscillator
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#triple-exponential-moving-average, InfluxQL CHANDE_MOMENTUM_OSCILLATOR()
introduced: 0.39.0
---

The `chandeMomentumOscillator()` function applies the technical momentum indicator
developed by Tushar Chande.

```js
chandeMomentumOscillator(
  n: 10,
  columns: ["_value"]
)
```

The Chande Momentum Oscillator (CMO) indicator calculates the difference between
the sum of all recent data points with values greater than the median value of the data set
and the sum of all recent data points with values lower than the median value of the data set,
then divides the result by the sum of all data movement over a given time period.
It then multiplies the result by 100 and returns a value between -100 and +100.

## Parameters

### n {data-type="int"}
The period or number of points to use in the calculation.

### columns {data-type="array of strings"}
The columns to operate on.
Defaults to `["_value"]`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Output tables
For each input table with `x` rows, `chandeMomentumOscillator()` outputs a table
with `x - n` rows.

## Examples

#### Transform data with a two point Chande Momentum Oscillator
{{% flux/sample-example-intro %}}

```js
import "sampledata"

data = sampledata.int()

data
  |> chandeMomentumOscillator(n: 2)
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample set="int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag |            _value |
| :------------------- | :-- | ----------------: |
| 2021-01-01T00:00:20Z | t1  |                60 |
| 2021-01-01T00:00:30Z | t1  | 53.84615384615385 |
| 2021-01-01T00:00:40Z | t1  | 66.66666666666667 |
| 2021-01-01T00:00:50Z | t1  |              -100 |

| _time                | tag |             _value |
| :------------------- | :-- | -----------------: |
| 2021-01-01T00:00:20Z | t2  |               -100 |
| 2021-01-01T00:00:30Z | t2  | 51.724137931034484 |
| 2021-01-01T00:00:40Z | t2  | 57.142857142857146 |
| 2021-01-01T00:00:50Z | t2  |               -100 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
