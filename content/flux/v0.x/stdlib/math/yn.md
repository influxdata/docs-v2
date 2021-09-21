---
title: math.yn() function
description: The math.yn() function returns the order-n Bessel function of the second kind.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/yn/
  - /influxdb/v2.0/reference/flux/stdlib/math/yn/
  - /influxdb/cloud/reference/flux/stdlib/math/yn/
menu:
  flux_0_x_ref:
    name: math.yn
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.yn()` function returns the order-n Bessel function of the second kind.

_**Output data type:** Float_

```js
import "math"

math.yn(n: 3, x: 3.14)

// Returns -0.4866506930335083
```

## Parameters

### n {data-type="int"}
The order number used in the operation.

### x {data-type="float"}
The value used in the operation.

## Special cases
```js
math.yn(n:n, x: +Inf) // Returns 0
math.yn(n: ≥0, x: 0)  // Returns -Inf
math.yn(n: <0, x: 0)  // Returns +Inf if n is odd, -Inf if n is even
math.yn(n:n, x: <0)   // Returns NaN
math.yn(n:n, x:NaN)   // Returns NaN
```
