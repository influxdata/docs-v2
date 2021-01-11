---
title: math.logb() function
description: The math.logb() function returns the binary exponent of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/logb/
  - /influxdb/v2.0/reference/flux/stdlib/math/logb/
  - /influxdb/cloud/reference/flux/stdlib/math/logb/
menu:
  influxdb_2_0_ref:
    name: math.logb
    parent: Math
weight: 301
---

The `math.logb()` function returns the binary exponent of `x`.

_**Output data type:** Float_

```js
import "math"

math.logb(x: 3.14)

// Returns 1.0
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.logb(x: ±Inf) // Returns +Inf
math.logb(x: 0)    // Returns -Inf
math.logb(x: NaN)  // Returns NaN
```
