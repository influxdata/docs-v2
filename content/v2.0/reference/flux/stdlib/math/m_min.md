---
title: math.m_min() function
description: The math.m_min() function returns the smaller of `x` or `y`.
aliases:
  - /v2.0/reference/flux/functions/math/m_min/
menu:
  v2_0_ref:
    name: math.m_min
    parent: Math
weight: 301
---

The `math.m_min()` function returns the smaller of `x` or `y`.

_**Output data type:** Float_

```js
import "math"

math.m_min(x: 1.23, y: 4.56)

// Returns 1.23
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
Min(x:x, y: -Inf) // Returns -Inf
Min(x: -Inf, y:y) // Returns -Inf
Min(x:x, y: NaN)  // Returns NaN
Min(x: NaN, y:y)  // Returns NaN
Min(x: -0, y: ±0) // Returns -0
Min(x: ±0, y: -0) // Returns -0
```
