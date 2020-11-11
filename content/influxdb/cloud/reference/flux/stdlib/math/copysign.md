---
title: math.copysign() function
description: The math.copysign() function returns a value with the magnitude of `x` and the sign of `y`.
aliases:
  - /influxdb/cloud/reference/flux/functions/math/copysign/
menu:
  influxdb_cloud_ref:
    name: math.copysign
    parent: Math
weight: 301
---

The `math.copysign()` function returns a value with the magnitude of `x` and the sign of `y`.

_**Output data type:** Float_

```js
import "math"

math.copysign(x: 1.0, y: 2.0)

// Returns 1.0
```

## Parameters

### x
The magnitude used in the operation.

_**Data type:** Float_

### y
The sign used in the operation.

_**Data type:** Float_
