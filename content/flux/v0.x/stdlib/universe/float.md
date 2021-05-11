---
title: float() function
description: The `float()` function converts a single value to a float.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/float/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/float/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/float/
menu:
  flux_0_x_ref:
    name: float
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions]
introduced: 0.7.0
---

The `float()` function converts a single value to a float.

_**Output data type:** Float_

```js
float(v: "3.14")
```

## Parameters

### v {data-type="numeric string, bool, int, uint"}
The value to convert.

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> filter(fn:(r) => r._measurement == "camera" )
  |> map(fn:(r) => ({ r with aperature: float(v: r.aperature) }))
```
