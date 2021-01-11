---
title: math.log2() function
description: The math.log2() function returns the binary logarithm of `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/log2/
  - /influxdb/v2.0/reference/flux/stdlib/math/log2/
  - /influxdb/cloud/reference/flux/stdlib/math/log2/
menu:
  influxdb_2_0_ref:
    name: math.log2
    parent: Math
weight: 301
---

The `math.log2()` function returns the binary logarithm of `x`.

_**Output data type:** Float_

```js
import "math"

math.log2(x: 3.14)

// Returns 1.6507645591169022
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.log2(x: +Inf) // Returns +Inf
math.log2(x: 0)    // Returns -Inf
math.log2(x: <0)   // Returns NaN
math.log2(x: NaN)  // Returns NaN
```
