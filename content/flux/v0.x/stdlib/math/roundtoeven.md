---
title: math.roundtoeven() function
description: The math.roundtoeven() function returns the nearest integer, rounding ties to even.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/roundtoeven/
  - /influxdb/v2.0/reference/flux/stdlib/math/roundtoeven/
  - /influxdb/cloud/reference/flux/stdlib/math/roundtoeven/
menu:
  flux_0_x_ref:
    name: math.roundtoeven
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.roundtoeven()` function returns the nearest integer, rounding ties to even.

_**Output data type:** Float_

```js
import "math"

math.roundtoeven(x: 3.14)
// Returns 3.0

math.roundtoeven(x: 3.5)
// Returns 4.0
```

## Parameters

### x {data-type="float"}
The value used in the operation.

## Special cases
```js
math.roundtoeven(x: ±0)   // Returns ±0
math.roundtoeven(x: ±Inf) // Returns ±Inf
math.roundtoeven(x: NaN)  // Returns NaN
```
