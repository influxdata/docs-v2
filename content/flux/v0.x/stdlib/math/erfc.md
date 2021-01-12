---
title: math.erfc() function
description: The math.erfc() function returns the complementary error function of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/erfc/
  - /influxdb/v2.0/reference/flux/stdlib/math/erfc/
  - /influxdb/cloud/reference/flux/stdlib/math/erfc/
menu:
  flux_0_x_ref:
    name: math.erfc
    parent: Math
weight: 301
introduced: 0.22.0
---

The `math.erfc()` function returns the complementary error function of `x`.

_**Output data type:** Float_

```js
import "math"

math.erfc(x: 22.6)

// Returns 3.7726189138490583e-224
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.erfc(+Inf) // Returns 0
math.erfc(-Inf) // Returns 2
math.erfc(NaN)  // Returns NaN
```
