---
title: math.min() function
description: >
  `math.min()` returns the minimum value within the array.
menu:
  flux_0_x_ref:
    name: math.min
    parent: contrib/jsternberg/math
    identifier: contrib/jsternberg/math/min
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/jsternberg/math/math.flux#L15-L19

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.min()` returns the minimum value within the array.



##### Function type signature

```js
math.min = (values: [A]) => A where A: Numeric
```

## Parameters

### values

({{< req >}})
Array of values.

