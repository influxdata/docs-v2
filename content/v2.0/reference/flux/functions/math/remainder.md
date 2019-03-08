---
title: math.remainder() function
description: The math.remainder() function returns the IEEE 754 floating-point remainder of `x / y`.
menu:
  v2_0_ref:
    name: math.remainder
    parent: Math
weight: 301
---

The `math.remainder()` function returns the IEEE 754 floating-point remainder of `x / y`.

```js
import "math"

math.remainder(x: 21.0, y: 4.0)
```

## Parameters

### x
The numerator used in the operation.

_**Data type:** Float_

### x
The denominator used in the operation.

_**Data type:** Float_

## Special cases
```js
math.remainder(x: ±Inf, y:y)  // Returns NaN
math.remainder(x: NaN, y:y)   // Returns NaN
math.remainder(x:x, y: 0)     // Returns NaN
math.remainder(x:x, y: ±Inf)  // Returns x
math.remainder(x:x, y: NaN)   // Returns NaN
```
