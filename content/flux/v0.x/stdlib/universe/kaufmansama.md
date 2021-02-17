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
introduced: 0.40.0
---

The `kaufmansAMA()` function calculates the Kaufman's Adaptive Moving Average (KAMA)
using values in an input table.

_**Function type:** Transformation_

```js
kaufmansAMA(
  n: 10,
  column: "_value"
)
```

Kaufman's Adaptive Moving Average is a trend-following indicator designed to account
for market noise or volatility.

## Parameters

### n
The period or number of points to use in the calculation.

_**Data type:** Integer_

### column
The column to operate on.
Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket: "telegraf/autogen"):
  |> range(start: -7d)
  |> kaufmansAMA(
    n: 10,
    column: "_value"
  )
```
