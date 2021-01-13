---
title: math.dim() function
description: The math.dim() function returns the maximum of `x`-`y` or 0.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/dim/
  - /influxdb/v2.0/reference/flux/stdlib/math/dim/
  - /influxdb/cloud/reference/flux/stdlib/math/dim/
menu:
  flux_0_x_ref:
    name: math.dim
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.dim()` function returns the maximum of `x - y` or 0.

_**Output data type:** Float_

```js
import "math"

math.dim(x: 12.2, y: 8.1)

// Returns 4.1
```

## Parameters

### x
The X value used in the operation.

_**Data type:** Float_

### y
The Y value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.dim(x: +Inf, y: +Inf) // Returns NaN
math.dim(x: -Inf, y: -Inf) // Returns NaN
math.dim(x:x, y    : NaN)  // Returns NaN
math.dim(x: NaN, y :y)     // Returns NaN
```
