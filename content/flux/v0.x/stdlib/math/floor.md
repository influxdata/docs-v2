---
title: math.floor() function
description: The math.floor() function returns the greatest integer value less than or equal to `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/floor/
  - /influxdb/v2.0/reference/flux/stdlib/math/floor/
  - /influxdb/cloud/reference/flux/stdlib/math/floor/
menu:
  flux_0_x_ref:
    name: math.floor
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.floor()` function returns the greatest integer value less than or equal to `x`.

_**Output data type:** Float_

```js
import "math"

math.floor(x: 1.22)

// Returns 1.0
```

## Parameters

### x {data-type="float"}
The value used in the operation.

## Special cases
```js
math.floor(±0)   // Returns ±0
math.floor(±Inf) // Returns ±Inf
math.floor(NaN)  // Returns NaN
```
