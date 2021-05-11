---
title: math.sinh() function
description: The math.sinh() function returns the hyperbolic sine of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/sinh/
  - /influxdb/v2.0/reference/flux/stdlib/math/sinh/
  - /influxdb/cloud/reference/flux/stdlib/math/sinh/
menu:
  flux_0_x_ref:
    name: math.sinh
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.sinh()` function returns the hyperbolic sine of `x`.

_**Output data type:** Float_

```js
import "math"

math.sinh(x: 1.23)

// Returns 1.564468479304407
```

## Parameters

### x {data-type="float"}
The value used in the operation.

## Special cases
```js
math.sinh(x: ±0)   // Returns ±0
math.sinh(x: ±Inf) // Returns ±Inf
math.sinh(x: NaN)  // Returns NaN
```
