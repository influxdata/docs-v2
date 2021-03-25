---
title: experimental.kaufmansAMA() function
description: >
  The `experimental.kaufmansAMA()` function calculates the Kaufman's Adaptive Moving Average (KAMA)
  of input tables using the `_value` column in each table.
menu:
  influxdb_2_0_ref:
    name: experimental.kaufmansAMA
    parent: Experimental
weight: 302
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/kaufmanama/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/kaufmanser/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#kaufmans-adaptive-moving-average, InfluxQL KAUFMANS_ADAPTIVE_MOVING_AVERAGE()
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