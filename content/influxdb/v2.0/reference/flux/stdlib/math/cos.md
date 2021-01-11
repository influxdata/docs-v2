---
title: math.cos() function
description: The math.cos() function returns the cosine of the radian argument `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/cos/
  - /influxdb/v2.0/reference/flux/stdlib/math/cos/
  - /influxdb/cloud/reference/flux/stdlib/math/cos/
menu:
  influxdb_2_0_ref:
    name: math.cos
    parent: Math
weight: 301
---

The `math.cos()` function returns the cosine of the radian argument `x`.

_**Output data type:** Float_

```js
import "math"

math.cos(x: 3.14)

// Returns -0.9999987317275396
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.cos(±Inf) // Returns NaN
math.cos(NaN)  // Returns NaN
```
