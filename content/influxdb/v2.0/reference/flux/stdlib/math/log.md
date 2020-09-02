---
title: math.log() function
description: The math.log() function returns the natural logarithm of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/log/
menu:
  influxdb_2_0_ref:
    name: math.log
    parent: Math
weight: 301
---

The `math.log()` function returns the natural logarithm of `x`.

_**Output data type:** Float_

```js
import "math"

math.log(x: 3.14)

// Returns 1.144222799920162
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.log(x: +Inf) // Returns +Inf
math.log(x: 0)    // Returns -Inf
math.log(x: <0)   // Returns NaN
math.log(x: NaN)  // Returns NaN
```
