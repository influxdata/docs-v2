---
title: math.copysign() function
description: The math.copysign() function returns a value with the magnitude of `x` and the sign of `y`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/copysign/
  - /influxdb/v2.0/reference/flux/stdlib/math/copysign/
  - /influxdb/cloud/reference/flux/stdlib/math/copysign/
menu:
  flux_0_x_ref:
    name: math.copysign
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.copysign()` function returns a value with the magnitude of `x` and the sign of `y`.

_**Output data type:** Float_

```js
import "math"

math.copysign(x: 1.0, y: 2.0)

// Returns 1.0
```

## Parameters

### x {data-type="float"}
The magnitude used in the operation.

### y {data-type="float"}
The sign used in the operation.
