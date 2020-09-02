---
title: math.atanh() function
description: The math.atanh() function returns the inverse hyperbolic tangent of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/atanh/
menu:
  influxdb_2_0_ref:
    name: math.atanh
    parent: Math
weight: 301
---

The `math.atanh()` function returns the inverse hyperbolic tangent of `x`.

_**Output data type:** Float_

```js
import "math"

math.atanh(x: 0.22)

// Returns 0.22365610902183242
```

## Parameters

### x
The value used in the operation.
`x` should be greater than -1 and less than 1.
Otherwise, the operation will return `NaN`.

_**Data type:** Float_

## Special cases
```js
math.atanh(x: 1)   // Returns +Inf
math.atanh(x: ±0)  // Returns ±0
math.atanh(x: -1)  // Returns -Inf
math.atanh(x: <-1) // Returns NaN
math.atanh(x: >1)  // Returns NaN
math.atanh(x: NaN) // Returns NaN
```
