---
title: boundaries package
description: >
  The `boundaries` package provides operators for finding the boundaries around certain days, months, and weeks.
menu:
  flux_v0_ref:
    name: boundaries 
    parent: date
    identifier: date/boundaries
weight: 21
cascade:

  introduced: 0.172.0
  deprecated: 0.177.1
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/boundaries/boundaries.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `boundaries` package provides operators for finding the boundaries around certain days, months, and weeks.
Import the `date/boundaries` package:

```js
import "date/boundaries"
```

{{% warn %}}
#### Deprecated
The `boundaries` package is deprecated in favor of [`experimental/date/boundaries`](/flux/v0/stdlib/experimental/date/boundaries/).
{{% /warn %}}


## Functions

{{< children type="functions" show="pages" >}}
