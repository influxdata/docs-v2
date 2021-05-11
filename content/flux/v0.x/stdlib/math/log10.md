---
title: math.log10() function
description: The math.log10() function returns the decimal logarithm of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/log10/
  - /influxdb/v2.0/reference/flux/stdlib/math/log10/
  - /influxdb/cloud/reference/flux/stdlib/math/log10/
menu:
  flux_0_x_ref:
    name: math.log10
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.log10()` function returns the decimal logarithm of `x`.

_**Output data type:** Float_

```js
import "math"

math.log10(x: 3.14)

// Returns 0.4969296480732149
```

## Parameters

### x {data-type="float"}
The value used in the operation.

## Special cases
```js
math.log10(x: +Inf) // Returns +Inf
math.log10(x: 0)    // Returns -Inf
math.log10(x: <0)   // Returns NaN
math.log10(x: NaN)  // Returns NaN
```
