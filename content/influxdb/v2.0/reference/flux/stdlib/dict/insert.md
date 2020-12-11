---
title: dict.insert() function
description: >
  The `dict.insert()` function inserts a key value pair into a dictionary and
  returns a new, updated dictionary.
  If the key already exists in the dictionary, the function overwrites the existing value.
menu:
  influxdb_2_0_ref:
    name: dict.insert
    parent: Dictionary
weight: 301
---

The `dict.insert()` function inserts a key value pair into a dictionary and returns
a new, updated dictionary.
If the key already exists in the dictionary, the function overwrites the existing value.

```js
import "dict"

dict.insert(
  dict: [1: "foo", 2: "bar"],
  key: 3,
  value: "baz"
)
```

## Parameters

<p>
  {{< req "All paremeters are required" >}}
</p>

### dict
Dictionary to update.

_**Data type:** Dictionary_

### key
Key to insert into the dictionary.
Must be the same type as existing keys in the dictionary.

_**Data type:** String | Boolean | Integer | Uinteger | Float | Time | Bytes_

### default
Value to insert into the dictionary.
Must be the same type as existing values in the dictionary.

_**Data type:** String | Boolean | Integer | Uinteger | Float | Time | Bytes_

## Examples

##### Insert a new key-value pair into a dictionary
```js
import "dict"

d = [1: "foo", 2: "bar"]

dNew = dict.insert(
  dict: d,
  key: 3,
  value: "baz"
)

dict.get(dict: dNew, key: 3, default: "")

// Returns baz
```

##### Overwrite an existing key-value pair in a dictionary
```js
import "dict"

d = [1: "foo", 2: "bar"]

dNew = dict.insert(
  dict: d,
  key: 2,
  value: "baz"
)

dict.get(dict: dNew, key: 2, default: "")

// Returns baz
```