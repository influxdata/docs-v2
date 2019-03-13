---
title: math.acos() function
description: The math.acos() function returns the arccosine, in radians, of `x`.
menu:
  v2_0_ref:
    name: math.acos
    parent: Math
weight: 301
---

The `math.acos()` function returns the arccosine, in radians, of `x`.

_**Output data type:** Float_

```js
import "math"

math.acos(x: 0.22)

// Returns 1.3489818562981022
```

## Parameters

### x
The value used in the operation.
`x` should be greater than -1 and less than 1.
Otherwise, the operation will return `NaN`.

_**Data type:** Float_

## Special cases
```js
math.acos(x: <-1) // Returns NaN
math.acos(x: >1)  // Returns NaN
```
