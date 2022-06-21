---
title: aggregate.count() function
description: >
  `aggregate.count()` constructs a count aggregate for the column.
menu:
  flux_0_x_ref:
    name: aggregate.count
    parent: contrib/jsternberg/aggregate
    identifier: contrib/jsternberg/aggregate/count
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/jsternberg/aggregate/aggregate.flux#L157-L165

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`aggregate.count()` constructs a count aggregate for the column.



##### Function type signature

```js
(
    ?column: A,
    ?fill: B,
) => {
    reduce: (state: int, values: [E]) => int,
    init: (values: [D]) => int,
    fill: B,
    compute: (state: C) => C,
    column: A,
}
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### column

Name of the column to aggregate.



### fill

When set, value to replace missing values.



