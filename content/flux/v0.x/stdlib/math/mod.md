---
title: math.mod() function
description: >
  The math.mod() function returns the floating-point remainder of `x`/`y`.
  The magnitude of the result is less than `y` and its sign agrees with that of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/mod/
  - /influxdb/v2.0/reference/flux/stdlib/math/mod/
  - /influxdb/cloud/reference/flux/stdlib/math/mod/
menu:
  flux_0_x_ref:
    name: math.mod
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.mod()` function returns the floating-point remainder of `x`/`y`.
The magnitude of the result is less than `y` and its sign agrees with that of `x`.

_**Output data type:** Float_

```js
import "math"

math.mod(x: 1.23, y: 4.56)

// Returns 1.23
```

## Parameters

### x {data-type="float"}
The X value used in the operation.

### y {data-type="float"}
The Y value used in the operation.

## Special cases
```js
math.mod(x: ±Inf, y:y)  // Returns NaN
math.mod(x: NaN, y:y)   // Returns NaN
math.mod(x:x, y: 0)     // Returns NaN
math.mod(x:x, y: ±Inf)  // Returns x
math.mod(x:x, y: NaN)   // Returns NaN
```
