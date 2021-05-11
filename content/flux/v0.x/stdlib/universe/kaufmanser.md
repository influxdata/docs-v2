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

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -7d)
  |> kaufmansER(n: 10)
```
