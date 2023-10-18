---
title: interpolate package
description: >
  The `interpolate` package provides functions that insert rows for missing data
  at regular intervals and estimate values using different interpolation methods.
menu:
  flux_v0_ref:
    name: interpolate 
    parent: stdlib
    identifier: interpolate
weight: 11
cascade:

  introduced: 0.87.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/interpolate/interpolate.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `interpolate` package provides functions that insert rows for missing data
at regular intervals and estimate values using different interpolation methods.
Import the `interpolate` package:

```js
import "interpolate"
```




## Functions

{{< children type="functions" show="pages" >}}
