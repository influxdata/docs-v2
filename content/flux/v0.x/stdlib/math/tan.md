---
title: math.tan() function
description: The math.tan() function returns the tangent of the radian argument `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/tan/
  - /influxdb/v2.0/reference/flux/stdlib/math/tan/
  - /influxdb/cloud/reference/flux/stdlib/math/tan/
menu:
  flux_0_x_ref:
    name: math.tan
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.tan()` function returns the tangent of the radian argument `x`.

_**Output data type:** Float_

```js
import "math"

math.tan(x: 3.14)

// Returns -0.001592654936407223
```

## Parameters

### x {data-type="float"}
The value used in the operation.

## Special cases
```js
math.tan(x: ±0)   // Returns ±0
math.tan(x: ±Inf) // Returns NaN
math.tan(x: NaN)  // Returns NaN
```
