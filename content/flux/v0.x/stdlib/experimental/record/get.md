---
title: record.get() function
seotitle: Experimental record.get() function
description: >
  `record.get()` returns a value from a record by key name or a default value if 
  the key doesn't exist in the record.
menu:
  flux_0_x_ref:
    name: record.get
    parent: record
weight: 401
introduced: 0.134.0
---

`record.get()` returns a value from a record by key name or a default value if 
the key doesn't exist in the record.

{{% note %}}
This is an interim solution for the `exists` operator's limited use with records
outside of a stream of tables.
For more information, see [influxdata/flux#4073](https://github.com/influxdata/flux/issues/4073).
{{% /note %}}

```js
import "experimental/record"

record.get(
  r: {foo, "bar"},
  key: "foo",
  default: "quz"  
)
```

## Parameters

### r {data-type="record"}
({{< req >}})
Record to retrieve the value from.

### key {data-type="string"}
({{< req >}})
Property key to retrieve

### default {data-type="any data type"}
({{< req >}})
Default value to return if the specified key does not exist in the record.

## Examples

#### Dynamically return a value from a record
```js
import "experimental/record"

key = "foo"
exampleRecord = {foo: 1.0, bar: "hello"}

record.get(
  r: exampleRecord,
  key: key,
  default: ""
)

// Returns 1.0
```