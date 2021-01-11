---
title: math.mMin() function
description: The math.mMin() function returns the smaller of `x` or `y`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/m_min/
  - /influxdb/v2.0/reference/flux/stdlib/math/m_min/
  - /influxdb/v2.0/reference/flux/stdlib/math/mmin/
  - /influxdb/cloud/reference/flux/stdlib/math/mmin/
menu:
  influxdb_2_0_ref:
    name: math.mMin
    parent: Math
weight: 301
---

The `math.mMin()` function returns the smaller of `x` or `y`.

_**Output data type:** Float_

```js
import "math"

math.mMin(x: 1.23, y: 4.56)

// Returns 1.23
```

## Parameters

### x
The X value used in the operation.

_**Data type:** Float_

### y
The Y value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.mMin(x:x, y: -Inf) // Returns -Inf
math.mMin(x: -Inf, y:y) // Returns -Inf
math.mMin(x:x, y: NaN)  // Returns NaN
math.mMin(x: NaN, y:y)  // Returns NaN
math.mMin(x: -0, y: ±0) // Returns -0
math.mMin(x: ±0, y: -0) // Returns -0
```
