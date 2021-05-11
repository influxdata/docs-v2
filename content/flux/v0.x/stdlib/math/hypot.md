---
title: math.hypot() function
description: >
  The math.hypot() function returns the square root of `p*p + q*q`,
  taking care to avoid unnecessary overflow and underflow.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/hypot/
  - /influxdb/v2.0/reference/flux/stdlib/math/hypot/
  - /influxdb/cloud/reference/flux/stdlib/math/hypot/
menu:
  flux_0_x_ref:
    name: math.hypot
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.hypot()` function returns the square root  of `p*p + q*q`,
taking care to avoid overflow and underflow.

_**Output data type:** Float_

```js
import "math"

math.hypot(p: 2.0, q: 5.0)

// Returns 5.385164807134505
```

## Parameters

### p {data-type="float"}
The p value used in the operation.

### q {data-type="float"}
The q value used in the operation.

## Special cases
```js
math.hypot(p: ±Inf, q:q) // Returns +Inf
math.hypot(p:p, q: ±Inf) // Returns +Inf
math.hypot(p: NaN, q:q)  // Returns NaN
math.hypot(p:p, q: NaN)  // Returns NaN
```
