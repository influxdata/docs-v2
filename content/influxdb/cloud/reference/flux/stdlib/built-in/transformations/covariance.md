---
title: covariance() function
description: The `covariance()` function computes the covariance between two columns.
aliases:
  - /influxdb/cloud/reference/flux/functions/transformations/aggregates/covariance
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/aggregates/covariance/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/covariance/
menu:
  influxdb_cloud_ref:
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
A list of **two columns** on which to operate. <span class="required">Required</span>

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
