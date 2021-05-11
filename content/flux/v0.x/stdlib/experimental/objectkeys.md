---
title: experimental.objectKeys() function
description: >
  The `experimental.objectKeys()` function returns an array of keys in a specified record.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/objectkeys/
  - /influxdb/cloud/reference/flux/stdlib/experimental/objectkeys/
menu:
  flux_0_x_ref:
    name: experimental.objectKeys
    parent: experimental
weight: 302
introduced: 0.40.0
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

### o {data-type="record"}
The record to return keys from.

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
