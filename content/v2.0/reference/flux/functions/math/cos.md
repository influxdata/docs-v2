---
title: math.cos() function
description: The math.cos() function returns the cosine of the radian argument `x`.
menu:
  v2_0_ref:
    name: math.cos
    parent: Math
weight: 301
---

The `math.cos()` function returns the cosine of the radian argument `x`.

```js
import "math"

math.cos(x: 3.14)
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.cos(±Inf) // Returns NaN
math.cos(NaN)  // Returns NaN
```
