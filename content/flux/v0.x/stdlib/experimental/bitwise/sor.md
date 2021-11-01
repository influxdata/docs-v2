---
title: bitwise.sor() function
description: >
  `bitwise.sor()` performs the bitwise operation `a OR b` with
  [integer](/flux/v0.x/data-types/basic/int/) values.
menu:
  flux_0_x_ref:
    name: bitwise.sor
    parent: bitwise
weight: 401
flux/v0.x/tags: [bitwise]
---

`bitwise.sor()` performs the bitwise operation, `a OR b`, with
[integer](/flux/v0.x/data-types/basic/int/) values.

```js
import "experimental/bitwise"

bitwise.sor(
  a: 12,
  b: 21
)

// Returns 29
```

## Parameters

### a {data-type="int"}
Left operand.

### b {data-type="int"}
Right operand.