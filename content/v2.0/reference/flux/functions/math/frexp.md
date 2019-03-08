---
title: math.frexp() function
description: >
  The math.frexp() function breaks `f` into a normalized fraction and an integral power of two.
  It returns `frac` and `exp` satisfying `f == frac × 2**exp`, with the absolute
  value of `frac` in the interval [½, 1).
menu:
  v2_0_ref:
    name: math.frexp
    parent: Math
weight: 301
---

The `math.frexp()` function breaks `f` into a normalized fraction and an integral power of two.
It returns `frac` and `exp` satisfying `f == frac × 2**exp`, with the absolute value
of `frac` in the interval `[½, 1)`.

```js
import "math"

math.frexp(f: 22.3)
```

## Parameters

### f
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.frexp(f: ±0)   // Returns ±0, 0
math.frexp(f: ±Inf) // Returns ±Inf, 0
math.frexp(f: NaN)  // Returns NaN, 0
```
