---
title: string() function
description: The `string()` function converts a single value to a string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/string/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/string/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/string/
menu:
  flux_0_x_ref:
    name: string
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions]
introduced: 0.7.0
---

The `string()` function converts a single value to a string.

_**Output data type:** String_

```js
string(v: 123456789)
```

## Parameters

### v {data-type="bool, int, uint, float, duration, time, bytes"}
Value to convert.

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> filter(fn:(r) => r._measurement == "system" )
  |> map(fn:(r) => ({ r with model_number: string(v: r.model_number) }))
```
