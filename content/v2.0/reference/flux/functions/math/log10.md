---
title: math.log10() function
description: The math.log10() function returns the decimal logarithm of `x`.
menu:
  v2_0_ref:
    name: math.log10
    parent: Math
weight: 301
---

The `math.log10()` function returns the decimal logarithm of `x`.

```js
import "math"

math.log10(x: 3.14)
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.log10(x: +Inf) // Returns +Inf
math.log10(x: 0)    // Returns -Inf
math.log10(x: <0)   // Returns NaN
math.log10(x: NaN)  // Returns NaN
```
