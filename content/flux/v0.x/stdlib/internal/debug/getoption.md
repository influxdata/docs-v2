---
title: debug.getOption() function
description: >
  `debug.getOption()` gets the value of an option using a form of reflection.
menu:
  flux_0_x_ref:
    name: debug.getOption
    parent: internal/debug
    identifier: internal/debug/getOption
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/debug/debug.flux#L44-L44

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`debug.getOption()` gets the value of an option using a form of reflection.



##### Function type signature

```js
debug.getOption = (name: string, pkg: string) => A
```

## Parameters

### pkg

({{< req >}})
Full path of the package.

### name

({{< req >}})
Option name.

