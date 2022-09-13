---
title: aggregate package
description: >
  The `aggregate` package provides an API for computing multiple aggregates over multiple columns within the same table stream.
menu:
  flux_0_x_ref:
    name: aggregate 
    parent: contrib/jsternberg
    identifier: contrib/jsternberg/aggregate
weight: 31
cascade:

  introduced: 0.77.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/jsternberg/aggregate/aggregate.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `aggregate` package provides an API for computing multiple aggregates over multiple columns within the same table stream.
Import the `contrib/jsternberg/aggregate` package:

```js
import "contrib/jsternberg/aggregate"
```

## Constants

```js
aggregate.none
aggregate.null
```

- **aggregate.none** is a sentinel value for fill that will skip
emitting a row if there are no values for an interval.
- **aggregate.null** is a sentinel value for fill that will fill
in a null value if there were no values for an interval.


## Functions

{{< children type="functions" show="pages" >}}
