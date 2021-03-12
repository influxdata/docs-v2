---
title: math.mInf() function
description: The math.mInf() function returns positive infinity if `sign >= 0`, negative infinity if `sign < 0`.
aliases:
  - /influxdb/cloud/reference/flux/functions/math/m_inf/
  - /influxdb/cloud/reference/flux/stdlib/math/m_inf/
menu:
  influxdb_cloud_ref:
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
