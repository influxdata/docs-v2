---
title: math.frexp() function
description: >
  The math.frexp() function breaks `f` into a normalized fraction and an integral power of two.
  It returns `frac` and `exp` satisfying `f == frac × 2**exp`, with the absolute
  value of `frac` in the interval [½, 1).
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/frexp/
  - /influxdb/v2.0/reference/flux/stdlib/math/frexp/
  - /influxdb/cloud/reference/flux/stdlib/math/frexp/
menu:
  influxdb_2_0_ref:
    name: math.frexp
    parent: Math
weight: 301
introduced: 0.22.0
---

The `math.frexp()` function breaks `f` into a normalized fraction and an integral power of two.
It returns `frac` and `exp` satisfying `f == frac × 2**exp`, with the absolute value
of `frac` in the interval `[½, 1)`.

_**Output data type:** Record_

```js
import "math"

math.frexp(f: 22.0)

// Returns {frac: 0.6875, exp: 5}
```

## Parameters

### f
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.frexp(f: ±0)   // Returns {frac: ±0, exp: 0}
math.frexp(f: ±Inf) // Returns {frac: ±Inf, exp: 0}
math.frexp(f: NaN)  // Returns {frac: NaN, exp: 0}
```
