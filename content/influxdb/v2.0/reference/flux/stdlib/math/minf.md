---
title: math.mInf() function
description: The math.mInf() function returns positive infinity if `sign >= 0`, negative infinity if `sign < 0`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/m_inf/
  - /influxdb/v2.0/reference/flux/stdlib/math/m_inf/
menu:
  influxdb_2_0_ref:
    name: math.mInf
    parent: Math
weight: 301
---

The `math.mInf()` function returns positive infinity if `sign >= 0`, negative infinity if `sign < 0`.

_**Output data type:** Float_

```js
import "math"

math.mInf(sign: 1)

// Returns +Inf
```

## Parameters

### sign
The sign value used in the operation.

_**Data type:** Integer_
