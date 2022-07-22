---
title: location package
description: >
  The `location` package loads a timezone based on a location name.
menu:
  flux_0_x_ref:
    name: location 
    parent: internal
    identifier: internal/location
weight: 21
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/location/location.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `location` package loads a timezone based on a location name.



## Options

```js
option location = {zone: "UTC", offset: 0h}
```
 
### location

`location` loads a timezone based on a location name.



