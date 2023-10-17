---
title: testing package
description: >
  The `testing` package provides functions for testing Flux operations.
menu:
  flux_v0_ref:
    name: testing 
    parent: stdlib
    identifier: testing
weight: 11
cascade:

  introduced: 0.14.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/testing/testing.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `testing` package provides functions for testing Flux operations.
Import the `testing` package:

```js
import "testing"
```



## Options

```js
option testing.load = (tables=<-) => tables

option testing.tags = []
```
 
### load

`load` loads test data from a stream of tables.


### tags

`tags` is a list of tags that will be applied to a test case.

The test harness allows filtering based on included tags.

 Tags are expected to be overridden per test file and test case
 using normal option semantics.


## Functions

{{< children type="functions" show="pages" >}}

## Packages

{{< children show="sections" >}}
