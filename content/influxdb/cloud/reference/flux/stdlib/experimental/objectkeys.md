---
title: experimental.objectKeys() function
description: >
  The `experimental.objectKeys()` function returns an array of keys in a specified record.
menu:
  influxdb_cloud_ref:
    name: experimental.objectKeys
    parent: Experimental
weight: 302
---

The `experimental.objectKeys()` function returns an array of keys in a specified record.

_**Function type:** Transformation_

```js
import "experimental"

experimental.objectKeys(
  o: {key1: "value1", key2: "value2"}
)

// Returns [key1, key2]
```

## Parameters

### o
The record to return keys from.

_**Data type:** Record_

## Examples

### Return all keys in a record
```js
import "experimental"

user = {
  firstName: "John",
  lastName: "Doe",
  age: 42
}

experimental.objectKeys(o: user)

// Returns [firstName, lastName, age]
```
