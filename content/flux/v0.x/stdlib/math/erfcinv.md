---
title: math.erfcinv() function
description: The math.erfcinv() function returns the inverse of `math.erfc()`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/erfcinv/
  - /influxdb/v2.0/reference/flux/stdlib/math/erfcinv/
  - /influxdb/cloud/reference/flux/stdlib/math/erfcinv/
menu:
  flux_0_x_ref:
    name: math.erfcinv
    parent: Math
weight: 301
introduced: 0.22.0
---

The `math.erfcinv()` function returns the inverse of `math.erfc()`.

_**Output data type:** Float_

```js
import "math"

math.erfcinv(x: 0.42345)

// Returns 0.5660037715858239
```

## Parameters

### x
The value used in the operation.
`x` should be greater than 0 and less than 2.
Otherwise, the operation will return `NaN`.

_**Data type:** Float_

## Special cases
```js
math.erfcinv(x: 0)   // Returns +Inf
math.erfcinv(x: 2)   // Returns -Inf
math.erfcinv(x: <0)  // Returns NaN
math.erfcinv(x: >2)  // Returns NaN
math.erfcinv(x: NaN) // Returns NaN
```
