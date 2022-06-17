---
title: join.join() function
description: >
  `join.join()` is under active development and is not yet ready for public consumption.
menu:
  flux_0_x_ref:
    name: join.join
    parent: join
    identifier: join/join
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/join/join.flux#L13-L23

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`join.join()` is under active development and is not yet ready for public consumption.



##### Function type signature

```js
join.join = (
    <-left: stream[A],
    as: (l: A, r: B) => C,
    method: string,
    on: (l: A, r: B) => bool,
    right: stream[B],
) => stream[C] where A: Record, B: Record, C: Record
```

## Parameters

### left

left:



### right
({{< req >}})
right:



### on
({{< req >}})
on:



### as
({{< req >}})
as:



### method
({{< req >}})
method:



