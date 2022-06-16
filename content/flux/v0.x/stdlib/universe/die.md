---
title: die() function
description: >
  `die()` stops the Flux script execution and returns an error message.
menu:
  flux_0_x_ref:
    name: die
    parent: universe
    identifier: universe/die
weight: 101

introduced: 0.82.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L276-L276

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`die()` stops the Flux script execution and returns an error message.



##### Function type signature

```js
die = (msg: string) => A
```

## Parameters

### msg

({{< req >}})
Error message to return.


## Examples


### Force a script to exit with an error message

```js
die(msg: "This is an error message")
```

