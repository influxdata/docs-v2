---
title: bitwise.uor() function
description: >
  `bitwise.uor()` performs the bitwise operation `a OR b` with
  [unsigned integer](/flux/v0.x/data-types/basic/uint/) values.
menu:
  flux_0_x_ref:
    name: bitwise.uor
    parent: bitwise
weight: 401
flux/v0.x/tags: [bitwise]
---

`bitwise.uor()` performs the bitwise operation, `a OR b`, with
[unsigned integer](/flux/v0.x/data-types/basic/uint/) values.

```js
import "experimental/bitwise"

bitwise.uor(
  a: uint(v: 12),
  b: uint(v: 21)
)

// Returns 29 (uint)
```

## Parameters

### a {data-type="uint"}
Left operand.

### b {data-type="uint"}
Right operand.