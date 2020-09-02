---
title: math.sincos() function
description: The math.sincos() function returns the values of `math.sin(x:x)` and `math.cos(x:x)`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/sincos/
menu:
  influxdb_2_0_ref:
    name: math.sincos
    parent: Math
weight: 301
---

The `math.sincos()` function returns the values of `math.sin(x:x)` and `math.cos(x:x)`.

_**Output data format:** Record_

```js
import "math"

math.sincos(x: 1.23)

// Returns {sin: 0.9424888019316975, cos: 0.3342377271245026}
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.sincos(x: ±0)   // Returns {sin: ±0, cos: 1}
math.sincos(x: ±Inf) // Returns {sin: NaN, cos: NaN}
math.sincos(x: NaN)  // Returns {sin: NaN, cos:  NaN}
```
