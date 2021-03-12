---
title: math.tan() function
description: The math.tan() function returns the tangent of the radian argument `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/tan/
menu:
  influxdb_2_0_ref:
    name: math.tan
    parent: Math
weight: 301
---

The `math.tan()` function returns the tangent of the radian argument `x`.

_**Output data type:** Float_

```js
import "math"

math.tan(x: 3.14)

// Returns -0.001592654936407223
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.tan(x: ±0)   // Returns ±0
math.tan(x: ±Inf) // Returns NaN
math.tan(x: NaN)  // Returns NaN
```
