---
title: dict.remove() function
description: >
  The `dict.remove()` function removes a key value pair from a dictionary and returns
  an updated dictionary.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/dict/remove/
  - /influxdb/cloud/reference/flux/stdlib/dict/remove/
menu:
  influxdb_2_0_ref:
    name: dict.remove
    parent: Dictionary
weight: 301
---

The `dict.remove()` function removes a key value pair from a dictionary and returns
an updated dictionary.

```js
import "dict"

dict.remove(
  dict: [1: "foo", 2: "bar"],
  key: 1
)
```

## Parameters

<p>
  {{< req "All paremeters are required" >}}
</p>

### dict
Dictionary to remove a key-value pair from.

_**Data type:** Dictionary_

### key
Key to remove from the dictionary.
Must be the same type as existing keys in the dictionary.

_**Data type:** String | Boolean | Integer | Uinteger | Float | Time | Bytes_

## Examples

##### Remove a property from a dictionary
```js
import "dict"

d = [1: "foo", 2: "bar"]

dNew = dict.remove(
  dict: d,
  key: 1
)

// Verify the key-value pairs was removed

dict.get(dict: dNew, key: 1, default: "")
// Returns an empty string

dict.get(dict: dNew, key: 2, default: "")
// Returns bar
```
