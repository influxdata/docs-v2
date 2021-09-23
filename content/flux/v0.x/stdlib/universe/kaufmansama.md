---
title: kaufmansAMA() function
description: >
  The `kaufmansAMA()` function calculates the Kaufman's Adaptive Moving Average (KAMA)
  using values in an input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/kaufmansama/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/kaufmansama/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/kaufmansama/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/kaufmansama/
menu:
  flux_0_x_ref:
    name: kaufmansAMA
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /flux/v0.x/stdlib/universe/kaufmanser/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#kaufmans-adaptive-moving-average, InfluxQL KAUFMANS_ADAPTIVE_MOVING_AVERAGE()
  - /flux/v0.x/stdlib/experimental/kaufmansama/
introduced: 0.40.0
---

The `kaufmansAMA()` function calculates the Kaufman's Adaptive Moving Average (KAMA)
using values in an input table.

```js
kaufmansAMA(
  n: 10,
  column: "_value"
)
```

Kaufman's Adaptive Moving Average is a trend-following indicator designed to account
for market noise or volatility.

## Parameters

### n {data-type="int"}
({{< req >}})
The period or number of points to use in the calculation.

### column {data-type="string"}
The column to operate on.
Defaults to `"_value"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

```js
import "sampledata"

sampledata.int()
  |> kaufmansAMA(n: 3)
```

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
| 2021-01-01T00:00:30Z | t1  |   9.72641183951902 |
| 2021-01-01T00:00:40Z | t1  | 10.097401019601417 |
| 2021-01-01T00:00:50Z | t1  |  9.972614968115325 |

| _time                | tag |              _value |
| :------------------- | :-- | ------------------: |
| 2021-01-01T00:00:30Z | t2  | -2.9084287200832466 |
| 2021-01-01T00:00:40Z | t2  |  -2.142970089472789 |
| 2021-01-01T00:00:50Z | t2  | -2.0940721758134693 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
