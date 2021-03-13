---
title: kaufmansER() function
description: >
  The `kaufmansER()` function calculates the Kaufman's Efficiency Ratio (KER) using
  values in an input table.
aliases:
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/aggregates/kaufmanser/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/kaufmanser/
menu:
  influxdb_cloud_ref:
    name: kaufmansER
    parent: built-in-transformations
weight: 402
related:
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/kaufmansama/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#kaufmans-efficiency-ratio, InfluxQL KAUFMANS_EFFICIENCY_RATIO()
---

The `kaufmansER()` function calculates the Kaufman's Efficiency Ratio (KER) using
values in an input table.
The function operates on the `_value` column.

_**Function type:** Transformation_

```js
kaufmansER(n: 10)
```

Kaufman's Efficiency Ratio indicator divides the absolute value of the
Chande Momentum Oscillator by 100 to return a value between 0 and 1.
Higher values represent a more efficient or trending market.

## Parameters

### n
The period or number of points to use in the calculation.

_**Data type:** Integer_

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -7d)
  |> kaufmansER(n: 10)
```
