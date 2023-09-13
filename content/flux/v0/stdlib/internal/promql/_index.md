---
title: promql package
description: >
  The `promql` package provides an internal API for implementing PromQL via Flux.
menu:
  flux_v0_ref:
    name: promql 
    parent: internal
    identifier: internal/promql
weight: 21
cascade:

  introduced: 0.47.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `promql` package provides an internal API for implementing PromQL via Flux.
Import the `internal/promql` package:

```js
import "internal/promql"
```

**Important**: This package is not meant for external use.


## Functions

{{< children type="functions" show="pages" >}}
