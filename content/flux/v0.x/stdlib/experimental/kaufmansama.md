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

```js
import "experimental"

experimental.kaufmansAMA(n: 10)
```

Kaufman's Adaptive Moving Average is a trend-following indicator designed to account
for market noise or volatility.

## Parameters

### n {data-type="int"}
The period or number of points to use in the calculation.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data (`<-`).

## Examples
```js
import "experimental"

from(bucket: "example-bucket"):
  |> range(start: -7d)
  |> experimental.kaufmansAMA(n: 10)
```