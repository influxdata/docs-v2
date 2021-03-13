---
title: math.floor() function
description: The math.floor() function returns the greatest integer value less than or equal to `x`.
aliases:
  - /influxdb/cloud/reference/flux/functions/math/floor/
menu:
  influxdb_cloud_ref:
    name: math.floor
    parent: Math
weight: 301
---

The `math.floor()` function returns the greatest integer value less than or equal to `x`.

_**Output data type:** Float_

```js
import "math"

math.floor(x: 1.22)

// Returns 1.0
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.floor(±0)   // Returns ±0
math.floor(±Inf) // Returns ±Inf
math.floor(NaN)  // Returns NaN
```
