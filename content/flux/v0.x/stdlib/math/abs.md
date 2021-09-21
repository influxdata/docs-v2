---
title: math.abs() function
description: The math.abs() function returns the absolute value of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/abs/
  - /influxdb/v2.0/reference/flux/stdlib/math/abs/
  - /influxdb/cloud/reference/flux/stdlib/math/abs/
menu:
  flux_0_x_ref:
    name: math.abs
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.abs()` function returns the absolute value of `x`.

_**Output data type:** Float_

```js
import "math"

math.abs(x: -1.22)

// Returns 1.22
```

## Parameters

### x {data-type="float"}
The value used in the operation.

## Special cases
```js
math.abs(x: ±Inf) // Returns +Inf
math.abs(x: NaN)  // Returns NaN
```
