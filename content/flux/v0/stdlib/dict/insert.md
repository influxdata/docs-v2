---
title: dict.insert() function
description: >
  `dict.insert()` inserts a key-value pair into a dictionary and returns a new,
  updated dictionary.
menu:
  flux_v0_ref:
    name: dict.insert
    parent: dict
    identifier: dict/insert
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/dict/dict.flux#L106-L106

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`dict.insert()` inserts a key-value pair into a dictionary and returns a new,
updated dictionary.

If the key already exists in the dictionary, the function overwrites
the existing value.

##### Function type signature

```js
(dict: [A:B], key: A, value: B) => [A:B] where A: Comparable
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### dict
({{< req >}})
Dictionary to update.



### key
({{< req >}})
Key to insert into the dictionary.
Must be the same type as the existing keys in the dictionary.



### value
({{< req >}})
Value to insert into the dictionary.
Must be the same type as the existing values in the dictionary.




## Examples

- [Insert a new key-value pair into the a dictionary](#insert-a-new-key-value-pair-into-the-a-dictionary)
- [Overwrite an existing key-value pair in a dictionary](#overwrite-an-existing-key-value-pair-in-a-dictionary)

### Insert a new key-value pair into the a dictionary

```js
import "dict"

d = [1: "foo", 2: "bar"]

dict.insert(dict: d, key: 3, value: "baz")// Returns [1: "foo", 2: "bar", 3: "baz"]


```


### Overwrite an existing key-value pair in a dictionary

```js
import "dict"

d = [1: "foo", 2: "bar"]

dict.insert(dict: d, key: 2, value: "baz")// Returns [1: "foo", 2: "baz"]


```

