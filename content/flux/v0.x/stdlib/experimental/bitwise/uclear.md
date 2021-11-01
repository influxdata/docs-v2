---
title: bitwise.uclear() function
description: >
  `bitwise.uclear()` performs the bitwise operation `a AND NOT b` with
  [unsigned integer](/flux/v0.x/data-types/basic/uint/) values.
menu:
  flux_0_x_ref:
    name: bitwise.uclear
    parent: bitwise
weight: 401
flux/v0.x/tags: [bitwise]
---

`bitwise.uclear()` performs the bitwise operation, `a AND NOT b`, with
[unsigned integer](/flux/v0.x/data-types/basic/uint/) values.

```js
import "experimental/bitwise"

bitwise.uclear(
  a: uint(v: 12),
  b: uint(v: 21)
)

// Returns 8 (uint)
```

## Parameters

### a {data-type="uint"}
Left operand.

### b {data-type="uint"}
Right operand.