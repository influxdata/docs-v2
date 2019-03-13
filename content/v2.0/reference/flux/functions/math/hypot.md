---
title: math.hypot() function
description: >
  The math.hypot() function returns the square root of `p*p + q*q`,
  taking care to avoid unnecessary overflow and underflow.
menu:
  v2_0_ref:
    name: math.hypot
    parent: Math
weight: 301
---

The `math.hypot()` function returns the square root  of `p*p + q*q`,
taking care to avoid unnecessary overflow and underflow.

_**Output data type:** Float_

```js
import "math"

math.hypot(p: 2.0, q: 5.0)
```

## Parameters

### p
The P value used in the operation.

_**Data type:** Float_

### q
The Q value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.hypot(p: ±Inf, q:q) // Returns +Inf
math.hypot(p:p, q: ±Inf) // Returns +Inf
math.hypot(p: NaN, q:q)  // Returns NaN
math.hypot(p:p, q: NaN)  // Returns NaN
```
