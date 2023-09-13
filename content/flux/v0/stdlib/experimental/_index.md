---
title: experimental package
description: >
  The `experimental` package includes experimental functions and packages.
menu:
  flux_v0_ref:
    name: experimental 
    parent: stdlib
    identifier: experimental
weight: 11
cascade:

  introduced: 0.39.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `experimental` package includes experimental functions and packages.
Import the `experimental` package:

```js
import "experimental"
```

### Experimental packages are subject to change
Please note that experimental packages and functions may:

- be moved or promoted to a permanent location
- undergo API changes
- stop working with no planned fixes
- be removed without warning or explanation


## Functions

{{< children type="functions" show="pages" >}}

## Packages

{{< children show="sections" >}}
