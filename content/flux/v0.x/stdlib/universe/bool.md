---
title: bool() function
description: The `bool()` function converts a single value to a boolean.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/bool/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/bool/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/bool/
menu:
  flux_0_x_ref:
    name: bool
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions]
introduced: 0.7.0
---

The `bool()` function converts a single value to a boolean.

_**Output data type:** Boolean_

```js
bool(v: "true")
```

## Parameters

### v {data-type="string, int, uint, float"}
The value to convert.

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> filter(fn:(r) => r._measurement == "system" )
  |> map(fn:(r) => ({ r with responsive: bool(v: r.responsive) }))
```
