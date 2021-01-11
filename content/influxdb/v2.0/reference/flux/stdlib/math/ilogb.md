---
title: math.ilogb() function
description: The math.ilogb() function returns the binary exponent of `x` as an integer.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/ilogb/
  - /influxdb/v2.0/reference/flux/stdlib/math/ilogb/
  - /influxdb/cloud/reference/flux/stdlib/math/ilogb/
menu:
  influxdb_2_0_ref:
    name: math.ilogb
    parent: Math
weight: 301
introduced: 0.22.0
---

The `math.ilogb()` function returns the binary exponent of `x` as an integer.

_**Output data type:** Integer_

```js
import "math"

math.ilogb(x: 123.45)

// Returns  6.0
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.ilogb(x: ±Inf) // Returns MaxInt32
math.ilogb(x: 0)    // Returns MinInt32
math.ilogb(x: NaN)  // Returns MaxInt32
```
