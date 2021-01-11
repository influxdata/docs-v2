---
title: math.log1p() function
description: >
  The math.log1p() function returns the natural logarithm of 1 plus its argument `x`.
  It is more accurate than `math.log(x: 1 + x)` when `x` is near zero.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/log1p/
  - /influxdb/v2.0/reference/flux/stdlib/math/log1p/
  - /influxdb/cloud/reference/flux/stdlib/math/log1p/
menu:
  influxdb_2_0_ref:
    name: math.log1p
    parent: Math
weight: 301
introduced: 0.22.0
---

The `math.log1p()` function returns the natural logarithm of 1 plus its argument `x`.
It is more accurate than `math.log(x: 1 + x)` when `x` is near zero.

_**Output data type:** Float_

```js
import "math"

math.log1p(x: 0.56)

// Returns 0.44468582126144574
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.log1p(x: +Inf) // Returns +Inf
math.log1p(x: ±0)   // Returns ±0
math.log1p(x: -1)   // Returns -Inf
math.log1p(x: <-1)  // Returns NaN
math.log1p(x: NaN)  // Returns NaN
```
