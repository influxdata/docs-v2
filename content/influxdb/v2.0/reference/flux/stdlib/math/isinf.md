---
title: math.isInf() function
description: The math.isInf() function reports whether `f` is an infinity, according to `sign`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/isinf/
menu:
  influxdb_2_0_ref:
    name: math.isInf
    parent: Math
weight: 301
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

### f
The value used in the evaluation.

_**Data type:** Float_

### sign
The sign used in the evaluation.

_**Data type:** Integer_
