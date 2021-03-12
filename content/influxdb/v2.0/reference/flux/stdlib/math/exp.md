---
title: math.exp() function
description: The math.exp() function returns `e**x`, the base-e exponential of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/exp/
menu:
  influxdb_2_0_ref:
    name: math.exp
    parent: Math
weight: 301
---

The `math.exp()` function returns `e**x`, the base-e exponential of `x`.

_**Output data type:** Float_

```js
import "math"

math.exp(x: 21.0)

// Returns 1.3188157344832146e+09
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.exp(x: +Inf) // Returns +Inf
math.exp(x: NaN)  // Returns NaN
```

Very large values overflow to 0 or +Inf. Very small values underflow to 1.
