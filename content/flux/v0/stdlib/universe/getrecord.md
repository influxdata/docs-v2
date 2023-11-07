---
title: getRecord() function
description: >
  `getRecord()` extracts a row at a specified index from a table as a record.
menu:
  flux_v0_ref:
    name: getRecord
    parent: universe
    identifier: universe/getRecord
weight: 101
flux/v0/tags: [dynamic queries]
introduced: 0.29.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3023-L3023

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`getRecord()` extracts a row at a specified index from a table as a record.

If the specified index is out of bounds, the function returns an error.

##### Function type signature

```js
(<-table: stream[A], idx: int) => A where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### idx
({{< req >}})
Index of the record to extract.



### table

Input table. Default is piped-forward data (`<-`).




## Examples

### Extract the first row from a table as a record

```js
import "sampledata"

sampledata.int()
    |> tableFind(fn: (key) => key.tag == "t1")
    |> getRecord(idx: 0)// Returns {_time: 2021-01-01T00:00:00.000000000Z, _value: -2, tag: t1}


```

