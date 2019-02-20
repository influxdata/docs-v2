---
title: uint() function
description: The uint() function converts a single value to an uinteger.
menu:
  v2_0_ref:
    name: uint
    parent: built-in-type-conversions
weight: 502
---

The `uint()` function converts a single value to an UInteger.

_**Function type:** Type conversion_  
_**Output data type:** UInteger_

```js
uint(v: "4")
```

## Parameters

### v
The value to convert.

## Examples
```js
from(bucket: "sensor-data")
  |> filter(fn:(r) =>
    r._measurement == "camera" and
  )
  |> map(fn:(r) => uint(v: r.exposures))
```
