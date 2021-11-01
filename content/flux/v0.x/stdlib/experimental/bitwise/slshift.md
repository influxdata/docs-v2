---
title: bitwise.slshift() function
description: >
  `bitwise.slshift()` shifts bits in `a` left by `b` bits.
  Both `a` and `b` are [integers](/flux/v0.x/data-types/basic/int/).
menu:
  flux_0_x_ref:
    name: bitwise.slshift
    parent: bitwise
weight: 401
flux/v0.x/tags: [bitwise]
---

`bitwise.slshift()` shifts bits in `a` left by `b` bits.
Both `a` and `b` are [integers](/flux/v0.x/data-types/basic/int/).

```js
import "experimental/bitwise"

bitwise.slshift(
  a: 12,
  b: 21
)

// Returns 25165824
```

## Parameters

### a {data-type="int"}
Left operand.

### b {data-type="int"}
Number of bits to shift.