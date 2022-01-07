---
title: math.pow10() function
description: The math.pow10() function returns `10**n`, the base-10 exponential of `n`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/pow10/
  - /influxdb/v2.0/reference/flux/stdlib/math/pow10/
  - /influxdb/cloud/reference/flux/stdlib/math/pow10/
menu:
  flux_0_x_ref:
    name: math.pow10
    parent: math
weight: 301
introduced: 0.22.0
---

The `math.pow10()` function returns `10**n`, the base-10 exponential of `n`.

_**Output data type:** Float_

```js
import "math"

math.pow10(n: 3)

// Returns 1000
```

## Parameters

### n {data-type="int"}
The value used in the operation.

## Special cases
```js
math.pow10(n: <-323) // Returns 0
math.pow10(n: >308)  // Returns +Inf
```
