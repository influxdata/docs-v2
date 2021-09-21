---
title: math.acosh() function
description: The math.acosh() function returns the inverse hyperbolic cosine of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/acosh/
  - /influxdb/v2.0/reference/flux/stdlib/math/acosh/
  - /influxdb/cloud/reference/flux/stdlib/math/acosh/
menu:
  flux_0_x_ref:
    name: math.acosh
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.acosh()` function returns the inverse hyperbolic cosine of `x`.

_**Output data type:** Float_

```js
import "math"

math.acosh(x: 1.22)

// Returns 0.6517292837263385
```

## Parameters

### x {data-type="float"}
`x` should be greater than 1.
If less than 1, the operation will return `NaN`.

## Special cases
```js
math.acosh(x: +Inf) // Returns +Inf
math.acosh(x: <1)   // Returns NaN
math.acosh(x: NaN)  // Returns NaN
```
