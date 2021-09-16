---
title: math.mInf() function
description: The math.mInf() function returns positive infinity if `sign >= 0`, negative infinity if `sign < 0`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/m_inf/
  - /influxdb/v2.0/reference/flux/stdlib/math/m_inf/
  - /influxdb/v2.0/reference/flux/stdlib/math/minf/
  - /influxdb/cloud/reference/flux/stdlib/math/minf/
menu:
  flux_0_x_ref:
    name: math.mInf
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.mInf()` function returns positive infinity if `sign >= 0`, negative infinity if `sign < 0`.

_**Output data type:** Float_

```js
import "math"

math.mInf(sign: 1)

// Returns +Inf
```

## Parameters

### sign {data-type="int"}
The sign value used in the operation.
