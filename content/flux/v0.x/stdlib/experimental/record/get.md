---
title: record.get() function
description: >
  `record.get()` returns a value from a record by key name or a default value if the key
  doesn’t exist in the record.
menu:
  flux_0_x_ref:
    name: record.get
    parent: experimental/record
    identifier: experimental/record/get
weight: 201

introduced: 0.134.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/record/record.flux#L47-L47

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`record.get()` returns a value from a record by key name or a default value if the key
doesn’t exist in the record.

This is an interim solution for the exists operator’s limited use with
records outside of a stream of tables.
For more information, see [influxdata/flux#4073](https://github.com/influxdata/flux/issues/4073).

##### Function type signature

```js
(default: A, key: string, r: B) => A where B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### r
({{< req >}})
Record to retrieve the value from.



### key
({{< req >}})
Property key to retrieve.



### default
({{< req >}})
Default value to return if the specified key does not exist in the record.




## Examples

### Dynamically return a value from a record

```js
import "experimental/record"

key = "foo"
exampleRecord = {foo: 1.0, bar: "hello"}

record.get(r: exampleRecord, key: key, default: "")// Returns 1.0


```

