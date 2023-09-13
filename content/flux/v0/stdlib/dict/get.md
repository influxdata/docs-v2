---
title: dict.get() function
description: >
  `dict.get()` returns the value of a specified key in a dictionary or a default value
  if the key does not exist.
menu:
  flux_v0_ref:
    name: dict.get
    parent: dict
    identifier: dict/get
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/dict/dict.flux#L58-L58

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`dict.get()` returns the value of a specified key in a dictionary or a default value
if the key does not exist.



##### Function type signature

```js
(default: A, dict: [B:A], key: B) => A where B: Comparable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### dict
({{< req >}})
Dictionary to return a value from.



### key
({{< req >}})
Key to return from the dictionary.



### default
({{< req >}})
Default value to return if the key does not exist in the
dictionary. Must be the same type as values in the dictionary.




## Examples

### Return a property of a dictionary

```js
import "dict"

d = [1: "foo", 2: "bar"]

dict.get(dict: d, key: 1, default: "")// Returns "foo"


```

