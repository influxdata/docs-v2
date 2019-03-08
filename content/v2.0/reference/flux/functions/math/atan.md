---
title: math.atan() function
description: The math.atan() function returns the arctangent, in radians, of `x`.
menu:
  v2_0_ref:
    name: math.atan
    parent: Math
weight: 301
---

The `math.atan()` function returns the arctangent, in radians, of `x`.

```js
import "math"

math.atan( EXAMPLE )
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.atan(x: ±0)    // Returns ±0
math.atan(x: ±Inf)  // Returns ±Pi/2
```
