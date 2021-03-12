---
title: covariance() function
description: The `covariance()` function computes the covariance between two columns.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/covariance
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/covariance/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/covariance/
menu:
  influxdb_2_0_ref:
    name: covariance
    parent: built-in-transformations
weight: 402
---

The `covariance()` function computes the covariance between two columns.

_**Function type:** Transformation_  
_**Output data type:** Float_

```js
covariance(columns: ["column_x", "column_y"], pearsonr: false, valueDst: "_value")
```

## Parameters

### columns
({{< req >}}) A list of **two columns** on which to operate.

_**Data type:** Array of strings_

### pearsonr
Indicates whether the result should be normalized to be the Pearson R coefficient.

_**Data type:** Boolean_

### valueDst
The column into which the result will be placed. Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket: "example-bucket")
  |> range(start:-5m)  
  |> map(fn: (r) => ({r with x: r._value, y: r._value * r._value / 2}))
  |> covariance(columns: ["x", "y"])
```
