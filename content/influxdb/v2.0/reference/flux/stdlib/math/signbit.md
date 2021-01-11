---
title: math.signbit() function
description: The math.signbit() function reports whether `x` is negative or negative zero.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/signbit/
  - /influxdb/v2.0/reference/flux/stdlib/math/signbit/
  - /influxdb/cloud/reference/flux/stdlib/math/signbit/
menu:
  influxdb_2_0_ref:
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
