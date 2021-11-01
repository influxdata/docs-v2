---
title: Flux experimental bitwise package
list_title: bitwise package
description: >
  The Flux experimental `bitwise` package provides functions for performing
  bitwise operations on integers.
  Import the `experimental/bitwise` package.
menu:
  flux_0_x_ref:
    name: bitwise
    parent: experimental
weight: 301
flux/v0.x/tags: [functions, bitwise, package]
cascade:
  introduced: 0.138.0
---

The Flux experimental `bitwise` package provides functions for performing bitwise
operations on integers and unsigned integers.
Import the `experimental/bitwise` package:

```js
import "experimental/bitwise"
```

## Functions
Functions prefixed with `s` operate on [signed integers (int)](/flux/v0.x/data-types/basic/int).
Functions prefixed with `u` operate on [unsigned integers (uint)](/flux/v0.x/data-types/basic/uint).

{{< children type="functions" show="pages" >}}
