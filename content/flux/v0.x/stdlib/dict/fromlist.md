---
title: dict.fromList() function
description: >
  The `dict.fromList()` function creates a dictionary from a list of records with
  `key` and `value` properties.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/dict/fromlist/
  - /influxdb/cloud/reference/flux/stdlib/dict/fromlist/
menu:
  flux_0_x_ref:
    name: dict.fromList
    parent: dict
weight: 301
introduced: 0.97.0
---

The `dict.fromList()` function creates a dictionary from a list of records with
`key` and `value` properties.

```js
import "dict"

dict.fromList(pairs: [{key: 1, value: "foo"},{key: 2, value: "bar"}])
```

## Parameters

### pairs {data-type="array of records"}
({{< req >}}) List of records, each containing `key` and `value` properties.

## Examples

##### Create a dictionary from a list of records
```js
import "dict"

// Define a new dictionary using an array of records
d = dict.fromList(pairs: [{key: 1, value: "foo"}, {key: 2, value: "bar"}])

// Return a property of the dictionary
dict.get(dict: d, key: 1, default: "")

// Returns foo
```
