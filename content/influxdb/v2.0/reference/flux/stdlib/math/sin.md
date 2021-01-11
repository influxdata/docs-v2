---
title: math.sin() function
description: The math.sin() function returns the sine of the radian argument `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/sin/
  - /influxdb/v2.0/reference/flux/stdlib/math/sin/
  - /influxdb/cloud/reference/flux/stdlib/math/sin/
menu:
  influxdb_2_0_ref:
    name: math.sin
    parent: Math
weight: 301
---

The `math.sin()` function returns the sine of the radian argument `x`.

_**Output data type:** Float_

```js
import "math"

math.sin(x: 3.14)

// Returns 0.0015926529164868282
```

## Parameters

### x
The radian value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.sin(x: ±0)   // Returns ±0
math.sin(x: ±Inf) // Returns NaN
math.sin(x: NaN)  // Returns NaN
```
