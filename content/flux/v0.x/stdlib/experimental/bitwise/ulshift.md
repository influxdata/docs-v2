---
title: bitwise.ulshift() function
description: >
  `bitwise.ulshift()` shifts bits in `a` left by `b` bits.
  Both `a` and `b` are [unsigned integers](/flux/v0.x/data-types/basic/uint/).
menu:
  flux_0_x_ref:
    name: bitwise.ulshift
    parent: bitwise
weight: 401
flux/v0.x/tags: [bitwise]
---

`bitwise.ulshift()` shifts bits in `a` left by `b` bits.
Both `a` and `b` are [unsigned integers](/flux/v0.x/data-types/basic/uint/).

```js
import "experimental/bitwise"

bitwise.ulshift(
  a: uint(v: 12),
  b: uint(v: 21)
)

// Returns 25165824 (uint)
```

## Parameters

### a {data-type="uint"}
Left operand.

### b {data-type="uint"}
Number of bits to shift.