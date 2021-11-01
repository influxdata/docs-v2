---
title: bitwise.sclear() function
description: >
  `bitwise.sclear()` performs the bitwise operation `a AND NOT b` with
  [integer](/flux/v0.x/data-types/basic/int/) values.
menu:
  flux_0_x_ref:
    name: bitwise.sclear
    parent: bitwise
weight: 401
flux/v0.x/tags: [bitwise]
---

`bitwise.sclear()` performs the bitwise operation, `a AND NOT b`, with
[integer](/flux/v0.x/data-types/basic/int/) values.

```js
import "experimental/bitwise"

bitwise.sclear(
  a: 12,
  b: 21
)

// Returns 8
```

## Parameters

### a {data-type="int"}
Left operand.

### b {data-type="int"}
Right operand.