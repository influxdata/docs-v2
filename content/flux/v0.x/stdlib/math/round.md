---
title: math.round() function
description: The math.round() function returns the nearest integer, rounding half away from zero.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/round/
  - /influxdb/v2.0/reference/flux/stdlib/math/round/
  - /influxdb/cloud/reference/flux/stdlib/math/round/
menu:
  flux_0_x_ref:
    name: math.round
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.round()` function returns the nearest integer, rounding half away from zero.

_**Output data type:** Float_

```js
import "math"

math.round(x: 2.12)

// Returns 2.0
```

## Parameters

### x {data-type="float"}
The value used in the operation.

## Special cases
```js
math.round(x: ±0)   // Returns ±0
math.round(x: ±Inf) // Returns ±Inf
math.round(x: NaN)  // Returns NaN
```
