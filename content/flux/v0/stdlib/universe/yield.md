---
title: yield() function
description: >
  `yield()` delivers input data as a result of the query.
menu:
  flux_v0_ref:
    name: yield
    parent: universe
    identifier: universe/yield
weight: 101
flux/v0.x/tags: [outputs]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2923-L2923

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`yield()` delivers input data as a result of the query.

A query may have multiple yields, each identified by unique name specified in
the `name` parameter.

**Note:** `yield()` is implicit for queries that output a single stream of
tables and is only necessary when yielding multiple results from a query.

##### Function type signature

```js
(<-tables: stream[A], ?name: string) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### name

Unique name for the yielded results. Default is `_results`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Yield multiple results from a query

```js
import "sampledata"

sampledata.int()
    |> yield(name: "unmodified")
    |> map(fn: (r) => ({r with _value: r._value * r._value}))
    |> yield(name: "squared")

```

