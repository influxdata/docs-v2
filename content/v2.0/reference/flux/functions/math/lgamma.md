---
title: math.lgamma() function
description: The math.lgamma() function returns the natural logarithm and sign (-1 or +1) of `math.gamma(x:x)`.
menu:
  v2_0_ref:
    name: math.lgamma
    parent: Math
weight: 301
---

The `math.lgamma()` function returns the natural logarithm and sign (-1 or +1) of `math.gamma(x:x)`.

```js
import "math"

math.lgamma(x: 3.14)
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.lgamma(x: +Inf)     // Returns +Inf
math.lgamma(x: 0)        // Returns +Inf
math.lgamma(x: -integer) // Returns +Inf
math.lgamma(x: -Inf)     // Returns -Inf
math.lgamma(x: NaN)      // Returns NaN
```
