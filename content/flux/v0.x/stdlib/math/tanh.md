---
title: math.tanh() function
description: The math.tanh() function returns the hyperbolic tangent of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/tanh/
  - /influxdb/v2.0/reference/flux/stdlib/math/tanh/
  - /influxdb/cloud/reference/flux/stdlib/math/tanh/
menu:
  flux_0_x_ref:
    name: math.tanh
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.tanh()` function returns the hyperbolic tangent of `x`.

_**Output data type:** Float_

```js
import "math"

math.tanh(x: 1.23)

// Returns 0.8425793256589296
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.tanh(x: ±0)   // Returns ±0
math.tanh(x: ±Inf) // Returns ±1
math.tanh(x: NaN)  // Returns NaN
```
