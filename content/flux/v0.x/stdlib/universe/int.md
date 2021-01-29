---
title: int() function
description: The `int()` function converts a single value to an integer.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/int/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/int/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/int/
menu:
  flux_0_x_ref:
    name: int
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions]
introduced: 0.7.0
---

The `int()` function converts a single value to an integer.

_**Function type:** Type conversion_  
_**Output data type:** Integer_

```js
int(v: "4")
```

## Parameters

### v
The value to convert.

_**Data type:** Boolean | Duration | Float | Numeric String | Time | Uinteger_

For duration and time values, `int()` returns the following:

| Input type | Returned value                                      |
|:---------- |:--------------                                      |
| Duration   | The number of nanoseconds in the specified duration |
| Time       | A nanosecond epoch timestamp                        |

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> filter(fn:(r) => r._measurement == "camera" )
  |> map(fn:(r) => ({ r with exposures: int(v: r.exposures) }))
```
