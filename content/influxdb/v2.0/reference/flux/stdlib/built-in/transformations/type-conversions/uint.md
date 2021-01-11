---
title: uint() function
description: The `uint()` function converts a single value to a UInteger.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/uint/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/uint/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/uint/
menu:
  influxdb_2_0_ref:
    name: uint
    parent: built-in-type-conversions
weight: 502
---

The `uint()` function converts a single value to a UInteger.

_**Function type:** Type conversion_  
_**Output data type:** UInteger_

```js
uint(v: "4")
```

## Parameters

### v
The value to convert.

_**Data type:** Boolean | Duration | Float | Integer | Numeric String | Time_

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
