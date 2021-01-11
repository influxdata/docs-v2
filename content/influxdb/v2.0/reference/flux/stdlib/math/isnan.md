---
title: math.isNaN() function
description: The math.isNaN() function reports whether `f` is an IEEE 754 “not-a-number” value.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/isnan/
  - /influxdb/v2.0/reference/flux/stdlib/math/isnan/
  - /influxdb/cloud/reference/flux/stdlib/math/isnan/
menu:
  influxdb_2_0_ref:
    name: math.isNaN
    parent: Math
weight: 301
introduced: 0.22.0
---

The `math.isNaN()` function reports whether `f` is an IEEE 754 “not-a-number” value.

_**Output data type:** Boolean_

```js
import "math"

math.isNaN(f: 12.345)

// Returns false
```

## Parameters

### f
The value used in the evaluation.

_**Data type:** Float_
