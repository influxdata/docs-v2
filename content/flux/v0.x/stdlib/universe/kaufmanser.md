---
title: kaufmansER() function
description: >
  The `kaufmansER()` function calculates the Kaufman's Efficiency Ratio (KER) using
  values in an input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/kaufmanser/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/kaufmanser/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/kaufmanser/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/kaufmanser/
menu:
  flux_0_x_ref:
    name: kaufmansER
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /flux/v0.x/stdlib/universe/kaufmansama/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#kaufmans-efficiency-ratio, InfluxQL KAUFMANS_EFFICIENCY_RATIO()
introduced: 0.40.0
---

The `kaufmansER()` function calculates the Kaufman's Efficiency Ratio (KER) using
values in an input table.
The function operates on the `_value` column.

```js
kaufmansER(n: 10)
```

Kaufman's Efficiency Ratio indicator divides the absolute value of the
Chande Momentum Oscillator by 100 to return a value between 0 and 1.
Higher values represent a more efficient or trending market.

## Parameters

### n {data-type="int"}
({{< req >}})
The period or number of points to use in the calculation.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

```js
import "sampledata"

sampledata.int()
  |> kaufmansER(n: 3)
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag |              _value |
| :------------------- | :-- | ------------------: |
| 2021-01-01T00:00:30Z | t1  |                0.76 |
| 2021-01-01T00:00:40Z | t1  | 0.33333333333333337 |
| 2021-01-01T00:00:50Z | t1  | 0.13043478260869565 |

| _time                | tag |             _value |
| :------------------- | :-- | -----------------: |
| 2021-01-01T00:00:30Z | t2  |                0.0 |
| 2021-01-01T00:00:40Z | t2  | 0.2571428571428572 |
| 2021-01-01T00:00:50Z | t2  |                0.1 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
