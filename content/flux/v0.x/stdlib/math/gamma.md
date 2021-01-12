---
title: math.gamma() function
description: The math.gamma() function returns the Gamma function of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/gamma/
  - /influxdb/v2.0/reference/flux/stdlib/math/gamma/
  - /influxdb/cloud/reference/flux/stdlib/math/gamma/
menu:
  flux_0_x_ref:
    name: math.gamma
    parent: Math
weight: 301
introduced: 0.22.0
---

The `math.gamma()` function returns the Gamma function of `x`.

_**Output data type:** Float_

```js
import "math"

math.gamma(x: 2.12)

// Returns 1.056821007887572
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.gamma(x: +Inf) = +Inf
math.gamma(x: +0) = +Inf
math.gamma(x: -0) = -Inf
math.gamma(x: <0) = NaN for integer x < 0
math.gamma(x: -Inf) = NaN
math.gamma(x: NaN) = NaN
```
