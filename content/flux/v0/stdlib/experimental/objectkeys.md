---
title: experimental.objectKeys() function
description: >
  `experimental.objectKeys()` returns an array of property keys in a specified record.
menu:
  flux_v0_ref:
    name: experimental.objectKeys
    parent: experimental
    identifier: experimental/objectKeys
weight: 101

introduced: 0.40.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L204-L204

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.objectKeys()` returns an array of property keys in a specified record.



##### Function type signature

```js
(o: A) => [string] where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### o
({{< req >}})
Record to return property keys from.




## Examples

### Return all property keys in a record

```js
import "experimental"

user = {firstName: "John", lastName: "Doe", age: 42}

experimental.objectKeys(o: user)// Returns [firstName, lastName, age]


```

