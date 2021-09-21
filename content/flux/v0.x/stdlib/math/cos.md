---
title: math.cos() function
description: The math.cos() function returns the cosine of the radian argument `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/cos/
  - /influxdb/v2.0/reference/flux/stdlib/math/cos/
  - /influxdb/cloud/reference/flux/stdlib/math/cos/
menu:
  flux_0_x_ref:
    name: math.cos
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.cos()` function returns the cosine of the radian argument `x`.

_**Output data type:** Float_

```js
import "math"

math.cos(x: 3.14)

// Returns -0.9999987317275396
```

## Parameters

### x {data-type="float"}
The value used in the operation.

## Special cases
```js
math.cos(±Inf) // Returns NaN
math.cos(NaN)  // Returns NaN
```
