---
title: system.time() function
description: >
  `system.time()` returns the current system time.
menu:
  flux_v0_ref:
    name: system.time
    parent: system
    identifier: system/time
weight: 101
flux/v0/tags: [date/time]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/system/system.flux#L24-L24

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`system.time()` returns the current system time.



##### Function type signature

```js
() => time
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}


## Examples

### Return a stream of tables with the current system time

```js
import "array"
import "system"

array.from(rows: [{time: system.time()}])

```

