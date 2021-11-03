---
title: bitwise.uxor() function
description: >
  `bitwise.uxor()` performs the bitwise operation `a XOR b` with
  [unsigned integer](/flux/v0.x/data-types/basic/uint/) values.
menu:
  flux_0_x_ref:
    name: bitwise.uxor
    parent: bitwise
weight: 401
related:
  - /flux/v0.x/data-types/basic/uint/
flux/v0.x/tags: [bitwise]
---

`bitwise.uxor()` performs the bitwise operation, `a XOR b`, with
[unsigned integer](/flux/v0.x/data-types/basic/uint/) values.

```js
import "experimental/bitwise"

bitwise.uxor(
  a: uint(v: 12),
  b: uint(v: 21)
)

// Returns 25 (uint)
```

## Parameters

### a {data-type="uint"}
Left operand.

### b {data-type="uint"}
Right operand.