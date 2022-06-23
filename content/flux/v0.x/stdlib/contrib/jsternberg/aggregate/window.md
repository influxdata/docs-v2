---
title: aggregate.window() function
description: >
  `aggregate.window()` aggregates columns and create tables by
  organizing incoming points into windows.
menu:
  flux_0_x_ref:
    name: aggregate.window
    parent: contrib/jsternberg/aggregate
    identifier: contrib/jsternberg/aggregate/window
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/jsternberg/aggregate/aggregate.flux#L66-L76

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`aggregate.window()` aggregates columns and create tables by
organizing incoming points into windows.

Each table will have two additional columns: start and stop.
These are the start and stop times for each interval.
It is not possible to use start or stop as destination column
names with this function. The start and stop columns are not
added to the group key.

##### Function type signature

```js
(
    <-tables: stream[B],
    columns: A,
    every: duration,
    ?period: duration,
    ?time: string,
) => stream[C] where A: Record, B: Record, C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).



### columns
({{< req >}})
Columns to aggregate and which aggregate method to use. See `aggregate.table()` for details.



### every
({{< req >}})
Duration between the start of each interval.



### time

Column name for the time input. Defaults to `_time` or `time` (whichever is earlier in the list of columns).



### period

Length of the interval. Defaults to the `every` duration.



