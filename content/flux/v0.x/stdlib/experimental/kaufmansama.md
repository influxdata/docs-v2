---
title: experimental.kaufmansAMA() function
description: >
  The `experimental.kaufmansAMA()` function calculates the Kaufman's Adaptive Moving Average (KAMA)
  of input tables using the `_value` column in each table.
menu:
  flux_0_x_ref:
    name: experimental.kaufmansAMA
    parent: experimental
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/kaufmanama/
  - /influxdb/cloud/reference/flux/stdlib/experimental/kaufmanama/
related:
  - /flux/v0.x/stdlib/universe/kaufmanama/
  - /flux/v0.x/stdlib/universe/kaufmanser/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#kaufmans-adaptive-moving-average, InfluxQL KAUFMANS_ADAPTIVE_MOVING_AVERAGE()
flux/v0.x/tags: [transformations]
introduced: 0.107.0
---

The `experimental.kaufmansAMA()` function calculates the Kaufman's Adaptive Moving Average (KAMA)
of input tables using the `_value` column in each table.

_**Function type:** Transformation_

```js
import "experimental"

experimental.kaufmansAMA(n: 10)
```

Kaufman's Adaptive Moving Average is a trend-following indicator designed to account
for market noise or volatility.

## Parameters

### n
The period or number of points to use in the calculation.

_**Data type:** Integer_

## Examples
```js
import "experimental"

experimental.from(bucket: "example-bucket"):
  |> range(start: -7d)
  |> kaufmansAMA(n: 10)
```