---
title: math.sqrt() function
description: The math.sqrt() function returns the square root of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/sqrt/
  - /influxdb/v2.0/reference/flux/stdlib/math/sqrt/
  - /influxdb/cloud/reference/flux/stdlib/math/sqrt/
menu:
  flux_0_x_ref:
    name: math.sqrt
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.sqrt()` function returns the square root of `x`.

_**Output data type:** Float_

```js
import "math"

math.sqrt(x: 4.0)

// Returns 2.0
```

## Parameters

### x {data-type="float"}
The value used in the operation.

## Special cases
```js
math.sqrt(x: +Inf) // Returns +Inf
math.sqrt(x: ±0)   // Returns ±0
math.sqrt(x: <0)   // Returns NaN
math.sqrt(x: NaN)  // Returns NaN
```
