---
title: array package
description: >
  The `array` package provides functions for manipulating arrays and for building tables from Flux arrays.
menu:
  flux_v0_ref:
    name: array 
    parent: experimental
    identifier: experimental/array
weight: 21
cascade:
  flux/v0.x/tags: [array, tables]
  introduced: 0.79.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/array/array.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `array` package provides functions for manipulating arrays and for building tables from Flux arrays.
Import the `experimental/array` package:

```js
import "experimental/array"
```

{{% warn %}}
#### Deprecated
This package is deprecated in favor of [`array`](/flux/v0/stdlib/array/).
{{% /warn %}}


## Functions

{{< children type="functions" show="pages" >}}
