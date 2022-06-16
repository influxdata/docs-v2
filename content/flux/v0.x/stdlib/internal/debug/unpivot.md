---
title: debug.unpivot() function
description: >
  `debug.unpivot()` removes the `_time` column and any other column not in the group key and outputs a new table with `_field` and `_value` columns pairs.
  The output stream retains the group key and all group key columns of the input stream.
  Specialized to transform the pivoted output from `iox.from()` into the unpivoted format.
menu:
  flux_0_x_ref:
    name: debug.unpivot
    parent: internal/debug
    identifier: internal/debug/unpivot
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/debug/debug.flux#L62-L65

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`debug.unpivot()` removes the `_time` column and any other column not in the group key and outputs a new table with `_field` and `_value` columns pairs.
The output stream retains the group key and all group key columns of the input stream.
Specialized to transform the pivoted output from `iox.from()` into the unpivoted format.



##### Function type signature

```js
debug.unpivot = (<-tables: stream[{A with _time: time}]) => stream[{B with _value: C, _field: string}] where A: Record, B: Record
```

## Parameters

### tables


Input data. Default is piped-forward data (`<-`).

