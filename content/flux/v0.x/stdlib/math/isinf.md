---
title: math.isInf() function
description: The math.isInf() function reports whether `f` is an infinity, according to `sign`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/isinf/
  - /influxdb/v2.0/reference/flux/stdlib/math/isinf/
  - /influxdb/cloud/reference/flux/stdlib/math/isinf/
menu:
  flux_0_x_ref:
    name: math.isInf
    parent: math
weight: 301
flux/v0.x/tags: [tests]
introduced: 0.22.0
---

The `math.isInf()` function reports whether `f` is an infinity, according to sign.

_**Output data type:** Boolean_

- If `sign > 0`, `math.isInf` reports whether `f` is positive infinity.
- If `sign < 0`, `math.isInf` reports whether `f` is negative infinity.
- If `sign == 0`, `math.isInf` reports whether `f` is either infinity.

```js
import "math"

math.isInf(f: 2.12, sign: 3)

// Returns false
```

## Parameters

### f {data-type="float"}
The value used in the evaluation.

### sign {data-type="int"}
The sign used in the evaluation.
