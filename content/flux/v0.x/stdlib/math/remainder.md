---
title: math.remainder() function
description: The math.remainder() function returns the IEEE 754 floating-point remainder of `x / y`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/remainder/
  - /influxdb/v2.0/reference/flux/stdlib/math/remainder/
  - /influxdb/cloud/reference/flux/stdlib/math/remainder/
menu:
  flux_0_x_ref:
    name: math.remainder
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.remainder()` function returns the IEEE 754 floating-point remainder of `x / y`.

_**Output data type:** Float_

```js
import "math"

math.remainder(x: 21.0, y: 4.0)

// Returns 1.0
```

## Parameters

### x {data-type="float"}
The numerator used in the operation.

### y {data-type="float"}
The denominator used in the operation.

## Special cases
```js
math.remainder(x: ±Inf, y:y)  // Returns NaN
math.remainder(x: NaN, y:y)   // Returns NaN
math.remainder(x:x, y: 0)     // Returns NaN
math.remainder(x:x, y: ±Inf)  // Returns x
math.remainder(x:x, y: NaN)   // Returns NaN
```
