---
title: math.exp2() function
description: The math.exp2() function returns `2**x`, the base-2 exponential of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/exp2/
  - /influxdb/v2.0/reference/flux/stdlib/math/exp2/
  - /influxdb/cloud/reference/flux/stdlib/math/exp2/
menu:
  flux_0_x_ref:
    name: math.exp2
    parent: Math
weight: 301
introduced: 0.22.0
---

The `math.exp2()` function returns `2**x`, the base-2 exponential of `x`.

_**Output data type:** Float_

```js
import "math"

math.exp2(x: 21.0)

// Returns 2.097152e+06
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.exp2(x: +Inf) // Returns +Inf
math.exp2(x: NaN)  // Returns NaN
```

Very large values overflow to 0 or +Inf. Very small values underflow to 1.
