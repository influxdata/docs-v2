---
title: expect package
description: >
  The `expect` package includes functions to mark
  any expectations for a testcase to be satisfied
  before the testcase finishes running.
menu:
  flux_v0_ref:
    name: expect 
    parent: testing
    identifier: testing/expect
weight: 21
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/testing/expect/expect.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `expect` package includes functions to mark
any expectations for a testcase to be satisfied
before the testcase finishes running.
Import the `testing/expect` package:

```js
import "testing/expect"
```

These functions are intended to be called at the
beginning of a testcase, but it doesn't really
matter when they get invoked within the testcase.


## Functions

{{< children type="functions" show="pages" >}}
