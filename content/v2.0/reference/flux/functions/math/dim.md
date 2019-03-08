---
title: math.dim() function
description: The math.dim() function returns the maximum of `x`-`y` or 0.
menu:
  v2_0_ref:
    name: math.dim
    parent: Math
weight: 301
---

The `math.dim()` function returns the maximum of `x`-`y` or 0.

```js
import "math"

math.dim(x: 12.2, y: 8.1)
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
