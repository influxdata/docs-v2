---
title: math.sincos() function
description: The math.sincos() function returns the values of `math.sin(x:x)` and `math.cos(x:x)`.
menu:
  v2_0_ref:
    name: math.sincos
    parent: Math
weight: 301
---

The `math.sincos()` function returns the values of `math.sin(x:x)` and `math.cos(x:x)`.

```js
import "math"

math.sincos(x: 1.23)
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.sincos(x: ±0)   // Returns ±0, 1
math.sincos(x: ±Inf) // Returns NaN, NaN
math.sincos(x: NaN)  // Returns NaN, NaN
```
