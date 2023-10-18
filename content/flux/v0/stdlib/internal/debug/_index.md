---
title: debug package
description: >
  The `debug` package provides methods for debugging the Flux engine.
menu:
  flux_v0_ref:
    name: debug 
    parent: internal
    identifier: internal/debug
weight: 21
cascade:

  introduced: 0.68.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/debug/debug.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `debug` package provides methods for debugging the Flux engine.
Import the `internal/debug` package:

```js
import "internal/debug"
```



## Options

```js
option debug.vectorize = false
```
 
### vectorize

`vectorize` controls whether the compiler attempts to vectorize Flux functions.




## Functions

{{< children type="functions" show="pages" >}}
