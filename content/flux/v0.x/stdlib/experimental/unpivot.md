---
title: experimental.unpivot() function
description: >
  `experimental.unpivot()` removes the `_time` column and any other column not in the group key and outputs a new table with `_field` and `_value` columns pairs.
  The output stream retains the group key and all group key columns of the input stream.
  Specialized to transform the pivoted output from `iox.from()` into the unpivoted format.
menu:
  flux_0_x_ref:
    name: experimental.unpivot
    parent: experimental
    identifier: experimental/unpivot
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L1299-L1302

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.unpivot()` removes the `_time` column and any other column not in the group key and outputs a new table with `_field` and `_value` columns pairs.
The output stream retains the group key and all group key columns of the input stream.
Specialized to transform the pivoted output from `iox.from()` into the unpivoted format.



##### Function type signature

```js
(<-tables: stream[{A with _time: time}]) => stream[{B with _value: C, _field: string}] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).



