---
title: math.erf() function
description: The math.erf() function returns the error function of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/erf/
  - /influxdb/v2.0/reference/flux/stdlib/math/erf/
  - /influxdb/cloud/reference/flux/stdlib/math/erf/
menu:
  flux_0_x_ref:
    name: math.erf
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.erf()` function returns the error function of `x`.

_**Output data type:** Float_

```js
import "math"

math.erf(x: 22.6)

// Returns 1.0
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.erf(+Inf) // Returns 1
math.erf(-Inf) // Returns -1
math.erf(NaN)  // Returns NaN
```
