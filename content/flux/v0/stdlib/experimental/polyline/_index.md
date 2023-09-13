---
title: polyline package
description: >
  The `polyline` package provides methods for polyline simplication, an efficient way of downsampling curves while retaining moments of variation throughout the path.
menu:
  flux_v0_ref:
    name: polyline 
    parent: experimental
    identifier: experimental/polyline
weight: 21
cascade:

  introduced: 0.181.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/polyline/polyline.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `polyline` package provides methods for polyline simplication, an efficient way of downsampling curves while retaining moments of variation throughout the path.
Import the `experimental/polyline` package:

```js
import "experimental/polyline"
```

This class of algorithms enable efficient rendering of graphs and visualizations without having to load all data into memory.
This is done by reducing the number of vertices that do not contribute significantly to the convexity and concavity of the shape.


## Functions

{{< children type="functions" show="pages" >}}
