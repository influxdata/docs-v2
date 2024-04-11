---
title: experimental.preview() function
description: >
  `experimental.preview()` limits the number of rows and tables in the stream.
menu:
  flux_v0_ref:
    name: experimental.preview
    parent: experimental
    identifier: experimental/preview
weight: 101
flux/v0/tags: [transformations]
introduced: 0.167.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L1310-L1310

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.preview()` limits the number of rows and tables in the stream.

Included group keys are not deterministic and depends on the order
that the engine sends them.

##### Function type signature

```js
(<-tables: stream[A], ?nrows: int, ?ntables: int) => stream[A] where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### nrows

Maximum number of rows per table to return. Default is `5`.



### ntables

Maximum number of tables to return.
Default is `5`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Preview data output

```js
import "experimental"
import "sampledata"

sampledata.int()
    |> experimental.preview()

```

