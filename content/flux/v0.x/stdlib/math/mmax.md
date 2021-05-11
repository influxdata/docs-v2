---
title: math.mMax() function
description: The math.mMax() function returns the larger of `x` or `y`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/m_max/
  - /influxdb/v2.0/reference/flux/stdlib/math/m_max/
  - /influxdb/v2.0/reference/flux/stdlib/math/mmax/
  - /influxdb/cloud/reference/flux/stdlib/math/mmax/
menu:
  flux_0_x_ref:
    name: math.mMax
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.mMax()` function returns the larger of `x` or `y`.

_**Output data type:** Float_

```js
import "math"

math.mMax(x: 1.23, y: 4.56)

// Returns 4.56
```

## Parameters

### x {data-type="float"}
The X value used in the operation.

### y {data-type="float"}
The Y value used in the operation.

## Special cases
```js
math.mMax(x:x, y:+Inf)  // Returns +Inf
math.mMax(x: +Inf, y:y) // Returns +Inf
math.mMax(x:x, y: NaN)  // Returns NaN
math.mMax(x: NaN, y:y)  // Returns NaN
math.mMax(x: +0, y: ±0) // Returns +0
math.mMax(x: ±0, y: +0) // Returns +0
math.mMax(x: -0, y: -0) // Returns -0
```
