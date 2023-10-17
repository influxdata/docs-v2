---
title: dict.remove() function
description: >
  `dict.remove()` removes a key value pair from a dictionary and returns an updated
  dictionary.
menu:
  flux_v0_ref:
    name: dict.remove
    parent: dict
    identifier: dict/remove
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/dict/dict.flux#L132-L132

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`dict.remove()` removes a key value pair from a dictionary and returns an updated
dictionary.



##### Function type signature

```js
(dict: [A:B], key: A) => [A:B] where A: Comparable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### dict
({{< req >}})
Dictionary to remove the key-value pair from.



### key
({{< req >}})
Key to remove from the dictionary.
Must be the same type as existing keys in the dictionary.




## Examples

### Remove a property from a dictionary

```js
import "dict"

d = [1: "foo", 2: "bar"]

dict.remove(dict: d, key: 1)// Returns [2: "bar"]


```

