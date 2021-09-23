---
title: math.trunc() function
description: The math.trunc() function returns the integer value of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/trunc/
  - /influxdb/v2.0/reference/flux/stdlib/math/trunc/
  - /influxdb/cloud/reference/flux/stdlib/math/trunc/
menu:
  flux_0_x_ref:
    name: math.trunc
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.trunc()` function returns the integer value of `x`.

_**Output data type:** Float_

```js
import "math"

math.trunc(x: 3.14)

// Returns 3.0
```

## Parameters

### x {data-type="float"}
The value used in the operation.

## Special cases
```js
math.trunc(x: ±0)   // Returns ±0
math.trunc(x: ±Inf) // Returns ±Inf
math.trunc(x: NaN)  // Returns NaN
```
