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
related:
  - /flux/v0.x/data-types/basic/uinteger/
  - /flux/v0.x/stdlib/universe/touint/
introduced: 0.7.0
---

The `uint()` function converts a single value to a UInteger.

_**Output data type:** UInteger_

```js
uint(v: "4")
```

## Parameters

### v {data-type="numeric string, bool, int, float, duration, time"}
The value to convert.

`uint()` behavior depends on the input data type:

| Input type | Returned value                                                  |
| :--------- | :-------------------------------------------------------------- |
| string     | UInteger equivalent of the numeric string                       |
| bool       | 1 (true) or 0 (false)                                           |
| duration   | Number of nanoseconds in the specified duration                 |
| time       | Equivalent nanosecond epoch timestamp                           |
| float      | UInteger equivalent of the float value truncated at the decimal |
| int        | UInteger equivalent of the integer                              |

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> filter(fn:(r) => r._measurement == "camera" )
  |> map(fn:(r) => ({ r with exposures: uint(v: r.exposures) }))
```
