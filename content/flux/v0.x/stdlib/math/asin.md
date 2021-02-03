---
title: math.asin() function
description: The math.asin() function returns the arcsine of `x` in radians.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/asin/
  - /influxdb/v2.0/reference/flux/stdlib/math/asin/
  - /influxdb/cloud/reference/flux/stdlib/math/asin/
menu:
  flux_0_x_ref:
    name: math.asin
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.asin()` function returns the arcsine of `x` in radians.

_**Output data type:** Float_

```js
import "math"

math.asin(x: 0.22)

// Returns 0.22181447049679442
```

## Parameters

### x
The value used in the operation.
`x` should be greater than -1 and less than 1.
Otherwise, the function will return `NaN`.

_**Data type:** Float_

## Special cases
```js
math.asin(x: ±0)  // Returns ±0
math.asin(x: <-1) // Returns NaN
math.asin(x: >1)  // Returns NaN
```
