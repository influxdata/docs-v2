---
title: math.log() function
description: The math.log() function returns the natural logarithm of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/log/
  - /influxdb/v2.0/reference/flux/stdlib/math/log/
  - /influxdb/cloud/reference/flux/stdlib/math/log/
menu:
  flux_0_x_ref:
    name: math.log
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.log()` function returns the natural logarithm of `x`.

_**Output data type:** Float_

```js
import "math"

math.log(x: 3.14)

// Returns 1.144222799920162
```

## Parameters

### x {data-type="float"}
The value used in the operation.

## Special cases
```js
math.log(x: +Inf) // Returns +Inf
math.log(x: 0)    // Returns -Inf
math.log(x: <0)   // Returns NaN
math.log(x: NaN)  // Returns NaN
```
