---
title: math.floor() function
description: The math.floor() function returns the greatest integer value less than or equal to `x`.
menu:
  v2_0_ref:
    name: math.floor
    parent: Math
weight: 301
---

The `math.floor()` function returns the greatest integer value less than or equal to `x`.

```js
import "math"

math.floor(x: 1.22)
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.floor(±0)   // Returns ±0
math.floor(±Inf) // Returns ±Inf
math.floor(NaN)  // Returns NaN
```
