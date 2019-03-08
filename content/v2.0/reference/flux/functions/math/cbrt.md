---
title: math.cbrt() function
description: The math.cbrt() function returns the cube root of `x`.
menu:
  v2_0_ref:
    name: math.cbrt
    parent: Math
weight: 301
---

The `math.cbrt()` function returns the cube root of `x`.

```js
import "math"

math.cbrt(x: 1728)
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.cbrt(±0)   // Returns ±0
math.cbrt(±Inf) // Returns ±Inf
math.cbrt(NaN)  // Returns NaN
```
