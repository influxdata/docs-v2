---
title: math.ceil() function
description: The math.ceil() function returns the least integer value greater than or equal to `x`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/ceil/
  - /influxdb/v2.0/reference/flux/stdlib/math/ceil/
  - /influxdb/cloud/reference/flux/stdlib/math/ceil/
menu:
  flux_0_x_ref:
    name: math.ceil
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.ceil()` function returns the least integer value greater than or equal to `x`.

_**Output data type:** Float_

```js
import "math"

math.ceil(x: 3.14)

// Returns 4.0
```

## Parameters

### x {data-type="float"}
The value used in the operation.

## Special cases
```js
math.ceil(±0)   // Returns ±0
math.ceil(±Inf) // Returns ±Inf
math.ceil(NaN)  // Returns NaN
```
