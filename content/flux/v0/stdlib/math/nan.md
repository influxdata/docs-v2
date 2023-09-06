---
title: math.NaN() function
description: >
  `math.NaN()` returns a IEEE 754 "not-a-number" value.
menu:
  flux_v0_ref:
    name: math.NaN
    parent: math
    identifier: math/NaN
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1704-L1704

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.NaN()` returns a IEEE 754 "not-a-number" value.



##### Function type signature

```js
() => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}


## Examples

### Return a NaN value

```js
import "math"

math.NaN()

```

