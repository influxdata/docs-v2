---
title: debug.slurp() function
description: >
  `debug.slurp()` will read the incoming tables and concatenate buffers with the same group key
  into a single in memory table buffer. This is useful for testing the performance impact of multiple
  buffers versus a single buffer.
menu:
  flux_0_x_ref:
    name: debug.slurp
    parent: internal/debug
    identifier: internal/debug/slurp
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/debug/debug.flux#L29-L29

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`debug.slurp()` will read the incoming tables and concatenate buffers with the same group key
into a single in memory table buffer. This is useful for testing the performance impact of multiple
buffers versus a single buffer.



##### Function type signature

```js
debug.slurp = (<-tables: stream[A]) => stream[A] where A: Record
```

## Parameters

### tables

Stream to consume into single buffers per table.



