---
title: math.signbit() function
description: The math.signbit() function reports whether `x` is negative or negative zero.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/signbit/
  - /influxdb/v2.0/reference/flux/stdlib/math/signbit/
  - /influxdb/cloud/reference/flux/stdlib/math/signbit/
menu:
  flux_0_x_ref:
    name: math.signbit
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.signbit()` function reports whether `x` is negative or negative zero.

_**Output data type:** Boolean_

```js
import "math"

math.signbit(x: -1.2)

// Returns true
```

## Parameters

### x {data-type="float"}
The value used in the evaluation.
