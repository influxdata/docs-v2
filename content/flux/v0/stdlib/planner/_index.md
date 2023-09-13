---
title: planner package
description: >
  The `planner` package provides an API for interacting with the Flux engine planner.
menu:
  flux_v0_ref:
    name: planner 
    parent: stdlib
    identifier: planner
weight: 11
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/planner/planner.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `planner` package provides an API for interacting with the Flux engine planner.



## Options

```js
option planner.disableLogicalRules = [""]

option planner.disablePhysicalRules = [""]
```
 
### disableLogicalRules

`disableLogicalRules` is a set of logical planner rules that should NOT be applied.



### disablePhysicalRules

`disablePhysicalRules` is a set of physical planner rules that should NOT be applied.



