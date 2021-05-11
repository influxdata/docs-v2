---
title: covariance() function
description: The `covariance()` function computes the covariance between two columns.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/covariance
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/covariance/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/covariance/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/covariance/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/covariance/
menu:
  flux_0_x_ref:
    name: covariance
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

The `covariance()` function computes the covariance between two columns.
 
_**Output data type:** Float_

```js
covariance(columns: ["column_x", "column_y"], pearsonr: false, valueDst: "_value")
```

## Parameters

### columns {data-type="array of strings"}
({{< req >}}) A list of **two columns** on which to operate.

### pearsonr {data-type="bool"}
Normalized results to the Pearson R coefficient.
Default is `false`.

### valueDst {data-type="string"}
The column into which the result will be placed.
Defaults to `"_value"`.

## Examples
```js
from(bucket: "example-bucket")
  |> range(start:-5m)  
  |> map(fn: (r) => ({r with x: r._value, y: r._value * r._value / 2}))
  |> covariance(columns: ["x", "y"])
```
