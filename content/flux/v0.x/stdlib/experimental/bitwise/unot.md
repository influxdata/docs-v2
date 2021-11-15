---
title: bitwise.unot() function
description: >
  `bitwise.unot()` inverts every bit in `a`, an
  [unsigned integer](/flux/v0.x/data-types/basic/uint/) value.
menu:
  flux_0_x_ref:
    name: bitwise.unot
    parent: bitwise
weight: 401
related:
  - /flux/v0.x/data-types/basic/uint/
flux/v0.x/tags: [bitwise]
---

`bitwise.unot()` inverts every bit in `a`, an
[unsigned integer](/flux/v0.x/data-types/basic/uint/) value.

```js
import "experimental/bitwise"

bitwise.unot(a: uint(v: 12))

// Returns 18446744073709551603 (uint)
```

## Parameters

### a {data-type="uint"}
Unsigned integer to invert.