---
title: bitwise.sxor() function
description: >
  `bitwise.sxor()` performs the bitwise operation `a XOR b` with
  [integer](/flux/v0.x/data-types/basic/int/) values.
menu:
  flux_0_x_ref:
    name: bitwise.sxor
    parent: bitwise
weight: 401
related:
  - /flux/v0.x/data-types/basic/int/
flux/v0.x/tags: [bitwise]
---

`bitwise.sxor()` performs the bitwise operation, `a XOR b`, with
[integer](/flux/v0.x/data-types/basic/int/) values.

```js
import "experimental/bitwise"

bitwise.sxor(
  a: 12,
  b: 21
)

// Returns 25
```

## Parameters

### a {data-type="int"}
Left operand.

### b {data-type="int"}
Right operand.