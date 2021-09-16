---
title: dict.insert() function
description: >
  The `dict.insert()` function inserts a key value pair into a dictionary and
  returns a new, updated dictionary.
  If the key already exists in the dictionary, the function overwrites the existing value.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/dict/insert/
  - /influxdb/cloud/reference/flux/stdlib/dict/insert/
menu:
  flux_0_x_ref:
    name: dict.insert
    parent: dict
weight: 301
introduced: 0.97.0
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

### dict {data-type="dict"}
Dictionary to update.

### key {data-type="string, bool, int, uint, float, time, bytes"}
Key to insert into the dictionary.
Must be the same type as existing keys in the dictionary.

### default {data-type="string, bool, int, uint, float, time, bytes"}
Value to insert into the dictionary.
Must be the same type as existing values in the dictionary.

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

// Verify the new key-value pair was inserted
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

// Verify the new key-value pair was overwritten
dict.get(dict: dNew, key: 2, default: "")

// Returns baz
```
