---
title: math.erfinv() function
description: The math.erfinv() function returns the inverse error function of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/erfinv/
  - /influxdb/v2.0/reference/flux/stdlib/math/erfinv/
  - /influxdb/cloud/reference/flux/stdlib/math/erfinv/
menu:
  flux_0_x_ref:
    name: math.erfinv
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.erfinv()` function returns the inverse error function of `x`.

_**Output data type:** Float_

```js
import "math"

math.erfinv(x: 0.22)

// Returns 0.19750838337227364
```

## Parameters

### x
The value used in the operation.
`x` should be greater than -1 and less than 1.
Otherwise, the operation will return `NaN`.

_**Data type:** Float_

## Special cases
```js
math.erfinv(x: 1)   // Returns +Inf
math.erfinv(x: -1)  // Returns -Inf
math.erfinv(x: <-1) // Returns NaN
math.erfinv(x: > 1) // Returns NaN
math.erfinv(x: NaN) // Returns NaN
```
