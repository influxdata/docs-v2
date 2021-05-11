---
title: math.acos() function
description: The math.acos() function returns the arccosine of `x` in radians.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/acos/
  - /influxdb/v2.0/reference/flux/stdlib/math/acos/
  - /influxdb/cloud/reference/flux/stdlib/math/acos/
menu:
  flux_0_x_ref:
    name: math.acos
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.acos()` function returns the arccosine of `x` in radians.

_**Output data type:** Float_

```js
import "math"

math.acos(x: 0.22)

// Returns 1.3489818562981022
```

## Parameters

### x {data-type="float"}
`x` should be greater than -1 and less than 1.
Otherwise, the operation will return `NaN`.

## Special cases
```js
math.acos(x: <-1) // Returns NaN
math.acos(x: >1)  // Returns NaN
```
