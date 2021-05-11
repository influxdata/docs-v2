---
title: math.cbrt() function
description: The math.cbrt() function returns the cube root of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/cbrt/
  - /influxdb/v2.0/reference/flux/stdlib/math/cbrt/
  - /influxdb/cloud/reference/flux/stdlib/math/cbrt/
menu:
  flux_0_x_ref:
    name: math.cbrt
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.cbrt()` function returns the cube root of `x`.

_**Output data type:** Float_

```js
import "math"

math.cbrt(x: 1728.0)

// Returns 12.0
```

## Parameters

### x {data-type="float"}
The value used in the operation.

## Special cases
```js
math.cbrt(±0)   // Returns ±0
math.cbrt(±Inf) // Returns ±Inf
math.cbrt(NaN)  // Returns NaN
```
