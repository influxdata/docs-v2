---
title: math.modf() function
description: >
  The math.modf() function returns integer and fractional floating-point numbers that sum to `f`.
  Both values have the same sign as `f`.
aliases:
  - /influxdb/cloud/reference/flux/functions/math/modf/
menu:
  influxdb_cloud_ref:
    name: math.modf
    parent: Math
weight: 301
---

The `math.modf()` function returns integer and fractional floating-point numbers that sum to `f`.
Both values have the same sign as `f`.

_**Output data format:** Record_

```js
import "math"

math.modf(f: 3.14)

// Returns {int: 3, frac: 0.14000000000000012}
```

## Parameters

### f
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.modf(f: ±Inf) // Returns {int: ±Inf, frac: NaN}
math.modf(f: NaN)  // Returns {int: NaN, frac: NaN}
```
