---
title: usage package
description: >
  The `usage` package provides tools for collecting usage and usage limit data from
  **InfluxDB Cloud**.
menu:
  flux_v0_ref:
    name: usage 
    parent: experimental
    identifier: experimental/usage
weight: 21
cascade:

  introduced: 0.114.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/usage/usage.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `usage` package provides tools for collecting usage and usage limit data from
**InfluxDB Cloud**.
Import the `experimental/usage` package:

```js
import "experimental/usage"
```




## Functions

{{< children type="functions" show="pages" >}}
