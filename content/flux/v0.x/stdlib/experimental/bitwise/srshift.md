---
title: bitwise.srshift() function
description: >
  `bitwise.srshift()` shifts bits in `a` right by `b` bits.
  Both `a` and `b` are [integers](/flux/v0.x/data-types/basic/int/).
menu:
  flux_0_x_ref:
    name: bitwise.srshift
    parent: bitwise
weight: 401
flux/v0.x/tags: [bitwise]
---

`bitwise.srshift()` shifts bits in `a` right by `b` bits.
Both `a` and `b` are [integers](/flux/v0.x/data-types/basic/int/).

```js
import "experimental/bitwise"

bitwise.srshift(
  a: 21,
  b: 4
)

// Returns 1
```

## Parameters

### a {data-type="int"}
Left operand.

### b {data-type="int"}
Number of bits to shift.