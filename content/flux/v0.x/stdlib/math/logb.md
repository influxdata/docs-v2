---
title: math.logb() function
description: The math.logb() function returns the binary exponent of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/logb/
  - /influxdb/v2.0/reference/flux/stdlib/math/logb/
  - /influxdb/cloud/reference/flux/stdlib/math/logb/
menu:
  flux_0_x_ref:
    name: math.logb
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.logb()` function returns the binary exponent of `x`.

_**Output data type:** Float_

```js
import "math"

math.logb(x: 3.14)

// Returns 1.0
```

## Parameters

### x {data-type="float"}
The value used in the operation.

## Special cases
```js
math.logb(x: ±Inf) // Returns +Inf
math.logb(x: 0)    // Returns -Inf
math.logb(x: NaN)  // Returns NaN
```
