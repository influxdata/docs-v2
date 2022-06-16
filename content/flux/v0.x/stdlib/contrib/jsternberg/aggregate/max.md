---
title: aggregate.max() function
description: >
  `aggregate.max()` constructs a max aggregate or selector for the column.
menu:
  flux_0_x_ref:
    name: aggregate.max
    parent: contrib/jsternberg/aggregate
    identifier: contrib/jsternberg/aggregate/max
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/jsternberg/aggregate/aggregate.flux#L136-L136

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`aggregate.max()` constructs a max aggregate or selector for the column.



##### Function type signature

```js
aggregate.max = (
    ?column: A,
    ?fill: B,
) => {
    reduce: (state: D, values: [D]) => D,
    init: (values: [D]) => D,
    fill: B,
    compute: (state: C) => C,
    column: A,
} where D: Numeric
```

## Parameters

### column


Name of the column to aggregate.

### fill


When set, value to replace missing values.

