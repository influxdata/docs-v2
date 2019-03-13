---
title: math.abs() function
description: The math.abs() function returns the absolute value of `x`.
menu:
  v2_0_ref:
    name: math.abs
    parent: Math
weight: 301
---

The `math.abs()` function returns the absolute value of `x`.

_**Output data type:** Float_

```js
import "math"

math.abs(x: -1.22)

// Returns 1.22
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.abs(x: ±Inf) // Returns +Inf
math.abs(x: NaN)  // Returns NaN
```
