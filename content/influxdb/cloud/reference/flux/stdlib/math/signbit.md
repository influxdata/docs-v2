---
title: math.signbit() function
description: The math.signbit() function reports whether `x` is negative or negative zero.
aliases:
  - /influxdb/cloud/reference/flux/functions/math/signbit/
menu:
  influxdb_cloud_ref:
    name: math.signbit
    parent: Math
weight: 301
---

The `math.signbit()` function reports whether `x` is negative or negative zero.

_**Output data type:** Boolean_

```js
import "math"

math.signbit(x: -1.2)

// Returns true
```

## Parameters

### x
The value used in the evaluation.

_**Data type:** Float_
