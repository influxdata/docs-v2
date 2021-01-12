---
title: math.asinh() function
description: The math.asinh() function returns the inverse hyperbolic sine of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/asinh/
  - /influxdb/v2.0/reference/flux/stdlib/math/asinh/
  - /influxdb/cloud/reference/flux/stdlib/math/asinh/
menu:
  flux_0_x_ref:
    name: math.asinh
    parent: Math
weight: 301
introduced: 0.22.0
---

The `math.asinh()` function returns the inverse hyperbolic sine of `x`.

_**Output data type:** Float_

```js
import "math"

math.asinh(x: 3.14)

// Returns 1.8618125572133835
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.asinh(x: ±0)   // Returns ±0
math.asinh(x: ±Inf) // Returns ±Inf
math.asinh(x: NaN)  // Returns NaN
```
