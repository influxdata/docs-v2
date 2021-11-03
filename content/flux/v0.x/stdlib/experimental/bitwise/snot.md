---
title: bitwise.snot() function
description: >
  `bitwise.snot()` inverts every bit in `a`, an
  [integer](/flux/v0.x/data-types/basic/int/) value.
menu:
  flux_0_x_ref:
    name: bitwise.snot
    parent: bitwise
weight: 401
related:
  - /flux/v0.x/data-types/basic/int/
flux/v0.x/tags: [bitwise]
---

`bitwise.snot()` inverts every bit in `a`, an
[integer](/flux/v0.x/data-types/basic/int/) value.

```js
import "experimental/bitwise"

bitwise.snot(a: 12)

// Returns -13
```

## Parameters

### a {data-type="int"}
Integer to invert.