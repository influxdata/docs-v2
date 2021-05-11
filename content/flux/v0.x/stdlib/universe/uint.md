---
title: uint() function
description: The `uint()` function converts a single value to a UInteger.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/uint/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/uint/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/uint/
menu:
  flux_0_x_ref:
    name: uint
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions]
introduced: 0.7.0
---

The `uint()` function converts a single value to a UInteger.

_**Output data type:** UInteger_

```js
uint(v: "4")
```

## Parameters

### v {data-type="string, bool, int, uint, float, duration, time"}
The value to convert.

For duration and time values, `uint()` returns the following:

| Input type | Returned value                                      |
|:---------- |:--------------                                      |
| Duration   | The number of nanoseconds in the specified duration |
| Time       | A nanosecond epoch timestamp                        |

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> filter(fn:(r) => r._measurement == "camera" )
  |> map(fn:(r) => ({ r with exposures: uint(v: r.exposures) }))
```
