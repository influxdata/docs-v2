---
title: record package
description: >
  The `record` package provides tools for working with Flux records.
menu:
  flux_v0_ref:
    name: record 
    parent: experimental
    identifier: experimental/record
weight: 21
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/record/record.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `record` package provides tools for working with Flux records.
Import the `experimental/record` package:

```js
import "experimental/record"
```

**Note**: The `experimental/record` package is an interim solution for
[influxdata/flux#3461](https://github.com/influxdata/flux/issues/3461) and
will either be removed after this issue is resolved or promoted out of the
experimental package if other uses are found.## Constants

```js
record.any
```

- **record.any** is a polymorphic record value that can be used as a default record value
when input record property types are not known.


## Functions

{{< children type="functions" show="pages" >}}
