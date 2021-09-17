---
title: math.modf() function
description: >
  The math.modf() function returns integer and fractional floating-point numbers that sum to `f`.
  Both values have the same sign as `f`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/modf/
  - /influxdb/v2.0/reference/flux/stdlib/math/modf/
  - /influxdb/cloud/reference/flux/stdlib/math/modf/
menu:
  flux_0_x_ref:
    name: math.modf
    parent: math
weight: 301
introduced: 0.22.0
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

### f {data-type="float"}
The value used in the operation.

## Special cases
```js
math.modf(f: ±Inf) // Returns {int: ±Inf, frac: NaN}
math.modf(f: NaN)  // Returns {int: NaN, frac: NaN}
```
