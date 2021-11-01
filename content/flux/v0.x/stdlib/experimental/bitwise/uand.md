---
title: bitwise.uand() function
description: >
  `bitwise.uand()` performs the bitwise operation `a AND b` with
  [unsigned integer](/flux/v0.x/data-types/basic/uint/) values.
menu:
  flux_0_x_ref:
    name: bitwise.uand
    parent: bitwise
weight: 401
flux/v0.x/tags: [bitwise]
---

`bitwise.uand()` performs the bitwise operation, `a AND b`, with
[unsigned integer](/flux/v0.x/data-types/basic/uint/) values.

```js
import "experimental/bitwise"

bitwise.uand(
  a: uint(v: 12),
  b: uint(v: 21)
)

// Returns 4 (uint)
```

## Parameters

### a {data-type="uint"}
Left operand.

### b {data-type="uint"}
Right operand.