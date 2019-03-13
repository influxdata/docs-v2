---
title: math.asin() function
description: The math.asin() function returns the arcsine, in radians, of `x`.
menu:
  v2_0_ref:
    name: math.asin
    parent: Math
weight: 301
---

The `math.asin()` function returns the arcsine, in radians, of `x`.

_**Output data type:** Float_

```js
import "math"

math.asin(x: 0.22)

// Returns 0.22181447049679442
```

## Parameters

### x
The value used in the operation.
`x` should be greater than -1 and less than 1.
Otherwise, the operation will return `NaN`.

_**Data type:** Float_

## Special cases
```js
math.asin(x: ±0)  // Returns ±0
math.asin(x: <-1) // Returns NaN
math.asin(x: >1)  // Returns NaN
```
