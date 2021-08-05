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
related:
  - /flux/v0.x/data-types/basic/integer/
  - /flux/v0.x/stdlib/universe/toint/
introduced: 0.7.0
---

The `int()` function converts a single value to an integer.

_**Output data type:** Integer_

```js
int(v: "4")
```

## Parameters

### v {data-type="numeric string, bool, uint, float, time, duration"}
Value to convert.

`int()` behavior depends on the input data type:

| Input type | Returned value                                  |
| :--------- | :---------------------------------------------- |
| string     | Integer equivalent of the numeric string        |
| bool       | 1 (true) or 0 (false)                           |
| duration   | Number of nanoseconds in the specified duration |
| time       | Equivalent nanosecond epoch timestamp           |
| float      | Value truncated at the decimal                  |
| uint       | Integer equivalent of the unsigned integer      |

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> filter(fn:(r) => r._measurement == "camera" )
  |> map(fn:(r) => ({ r with exposures: int(v: r.exposures) }))
```
