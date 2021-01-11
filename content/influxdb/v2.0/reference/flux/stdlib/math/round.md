---
title: math.round() function
description: The math.round() function returns the nearest integer, rounding half away from zero.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/round/
  - /influxdb/v2.0/reference/flux/stdlib/math/round/
  - /influxdb/cloud/reference/flux/stdlib/math/round/
menu:
  influxdb_2_0_ref:
    name: math.round
    parent: Math
weight: 301
---

The `math.round()` function returns the nearest integer, rounding half away from zero.

_**Output data type:** Float_

```js
import "math"

math.round(x: 2.12)

// Returns 2.0
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.round(x: ±0)   // Returns ±0
math.round(x: ±Inf) // Returns ±Inf
math.round(x: NaN)  // Returns NaN
```
