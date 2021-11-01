---
title: bitwise.sand() function
description: >
  `bitwise.sand()` performs the bitwise operation `a AND b` with
  [integer](/flux/v0.x/data-types/basic/int/) values.
menu:
  flux_0_x_ref:
    name: bitwise.sand
    parent: bitwise
weight: 401
flux/v0.x/tags: [bitwise]
---

`bitwise.sand()` performs the bitwise operation, `a AND b`, with
[integer](/flux/v0.x/data-types/basic/int/) values.

```js
import "experimental/bitwise"

bitwise.sand(
  a: 12,
  b: 21
)

// Returns 4
```

## Parameters

### a {data-type="int"}
Left operand.

### b {data-type="int"}
Right operand.