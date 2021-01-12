---
title: math.cosh() function
description: The math.cosh() function returns the hyperbolic cosine of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/cosh/
  - /influxdb/v2.0/reference/flux/stdlib/math/cosh/
  - /influxdb/cloud/reference/flux/stdlib/math/cosh/
menu:
  flux_0_x_ref:
    name: math.cosh
    parent: Math
weight: 301
introduced: 0.22.0
---

The `math.cosh()` function returns the hyperbolic cosine of `x`.

_**Output data type:** Float_

```js
import "math"

math.cosh(x: 1.22)

// Returns 1.8412089502726743
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.cosh(±0)   // Returns 1
math.cosh(±Inf) // Returns +Inf
math.cosh(NaN)  // Returns NaN
```
