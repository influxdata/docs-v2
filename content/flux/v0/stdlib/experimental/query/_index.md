---
title: query package
description: >
  The `query` package provides functions meant to simplify common InfluxDB queries.
menu:
  flux_v0_ref:
    name: query 
    parent: experimental
    identifier: experimental/query
weight: 21
cascade:

  introduced: 0.60.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/query/query.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `query` package provides functions meant to simplify common InfluxDB queries.
Import the `experimental/query` package:

```js
import "experimental/query"
```

The primary function in this package is `query.inBucket()`, which uses all
other functions in this package.


## Functions

{{< children type="functions" show="pages" >}}
