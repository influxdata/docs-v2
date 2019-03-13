---
title: math.cosh() function
description: The math.cosh() function returns the hyperbolic cosine of `x`.
menu:
  v2_0_ref:
    name: math.cosh
    parent: Math
weight: 301
---

The `math.cosh()` function returns the hyperbolic cosine of `x`.

_**Output data type:** Float_

```js
import "math"

math.cosh(x: 1.22)
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.cosh(±0)   // Returns 1
math.cosh(±Inf) // Returns +Inf
math.cosh(NaN)  // Returns NaN
```
