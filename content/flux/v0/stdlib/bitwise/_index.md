---
title: bitwise package
description: >
  The `bitwise` package provides functions for performing bitwise operations on integers.
menu:
  flux_v0_ref:
    name: bitwise 
    parent: stdlib
    identifier: bitwise
weight: 11
cascade:
  flux/v0/tags: [bitwise]
  introduced: 0.173.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/bitwise/bitwise.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `bitwise` package provides functions for performing bitwise operations on integers.
Import the `bitwise` package:

```js
import "bitwise"
```

All integers are 64 bit integers.

Functions prefixed with s operate on signed integers (int).
Functions prefixed with u operate on unsigned integers (uint).


## Functions

{{< children type="functions" show="pages" >}}
