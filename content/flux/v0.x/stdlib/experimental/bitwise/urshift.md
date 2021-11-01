---
title: bitwise.urshift() function
description: >
  `bitwise.urshift()` shifts bits in `a` right by `b` bits.
  Both `a` and `b` are [unsigned integers](/flux/v0.x/data-types/basic/uint/).
menu:
  flux_0_x_ref:
    name: bitwise.urshift
    parent: bitwise
weight: 401
flux/v0.x/tags: [bitwise]
---

`bitwise.urshift()` shifts bits in `a` right by `b` bits.
Both `a` and `b` are [unsigned integers](/flux/v0.x/data-types/basic/uint/).

```js
import "experimental/bitwise"

bitwise.urshift(
  a: uint(v: 21),
  b: uint(v: 4)
)

// Returns 1 (uint)
```

## Parameters

### a {data-type="uint"}
Left operand.

### b {data-type="uint"}
Number of bits to shift.